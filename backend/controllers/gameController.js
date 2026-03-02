import User from '../models/User.js';
import Question from '../models/Question.js';
import translate from 'google-translate-api-x';
import stringSimilarity from 'string-similarity';

// @desc    Login or register a user with PIN
// @route   POST /api/login
export const loginPlayer = async (req, res) => {
    const { username, pin, gameMode } = req.body;

    if (!username || !pin) {
        return res.status(400).json({ message: "Username and PIN are required" });
    }

    try {
        let user = await User.findOne({ username });

        // Scenario A: User does not exist, create new
        if (!user) {
            user = await User.create({ username, pin, gameMode: gameMode || 'Solo' });
            return res.status(200).json({ userId: user._id, username: user.username });
        }

        // Scenario B: User exists, verify PIN
        if (!user.pin) {
            // Legacy user with no PIN - set the PIN for them
            user.pin = pin;
            user.gameMode = gameMode || 'Solo';
            await user.save();
        } else if (user.pin !== pin) {
            return res.status(401).json({ message: "Username taken or incorrect PIN" });
        } else {
            user.gameMode = gameMode || user.gameMode;
            await user.save();
        }

        return res.status(200).json({ userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Initiate a scan for a specific QR code
// @route   POST /api/scan
export const handleScan = async (req, res) => {
    const { userId, qrId, lang = 'en' } = req.body;
    console.log(`Scan Request: UserID=${userId}, Station=${qrId}, Target Lang=${lang}`);

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 1. Security: Check if already answered
        if (user.answeredQuestions.includes(qrId)) {
            return res.status(403).json({ message: "Already answered" });
        }

        const question = await Question.findOne({ qrId });
        if (!question) {
            console.log(`Question not found for QR: ${qrId}`);
            return res.status(404).json({ message: "Invalid QR code" });
        }



        // 2. Logic: Set start time ONLY if it's a new scan
        if (user.activeQrId !== qrId || !user.currentQuestionStartTime) {
            user.currentQuestionStartTime = Date.now();
            user.activeQrId = qrId;
            await user.save();
        }

        let finalQuestionText = question.questionText;
        let finalOptions = question.options || [];

        if (lang !== 'en') {
            // Priority 1: Use hardcoded/human translation if available
            if (question.translations && question.translations.get(lang)) {
                finalQuestionText = question.translations.get(lang);

                // Option translation fallback (if needed)
                if (finalOptions.length > 0) {
                    try {
                        const optsRes = await translate(finalOptions, { to: lang });
                        if (optsRes) {
                            if (Array.isArray(optsRes)) finalOptions = optsRes.map(res => res.text);
                            else if (optsRes.text) finalOptions = [optsRes.text];
                        }
                    } catch (err) { }
                }
            } else {
                // Priority 2: Use Google Translate API fallback
                try {
                    const transRes = await translate(finalQuestionText, { to: lang });
                    if (transRes && transRes.text) {
                        finalQuestionText = transRes.text;

                        if (lang === 'hi' || lang === 'mr') {
                            finalQuestionText = finalQuestionText.replace(/मामा/g, 'काका');
                            finalQuestionText = finalQuestionText.replace(/अंकल/gi, 'काका');
                        }
                    }

                    if (finalOptions.length > 0) {
                        const optsRes = await translate(finalOptions, { to: lang });
                        if (optsRes) {
                            if (Array.isArray(optsRes)) finalOptions = optsRes.map(res => res.text);
                            else if (optsRes.text) finalOptions = [optsRes.text];
                        }
                    }
                } catch (err) {
                    console.error("Question translation failed, falling back to English.");
                }
            }
        }

        console.log(`Scan successful for ${user.username} at station ${qrId}`);
        // 3. Return questionText and startTime for timer persistence
        res.status(200).json({
            questionText: finalQuestionText,
            options: finalOptions,
            startTime: user.currentQuestionStartTime,
            isSabotaged: user.isSabotaged
        });
    } catch (error) {
        console.error("HandleScan Full Error:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Submit an answer for the active challenge
// @route   POST /api/submit
export const handleSubmit = async (req, res, io) => {
    const { userId, qrId, answer } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // 1. Security: Verify qrId matches the activeQrId
        if (user.activeQrId !== qrId) {
            return res.status(400).json({ message: "Invalid challenge session" });
        }

        const usedHint = user.hintsUsed.includes(qrId);

        // 2. Calculate time taken
        const timeTaken = (Date.now() - user.currentQuestionStartTime) / 1000;

        // 3. Time Check: 60s + 5s network grace
        if (timeTaken > 65) {
            user.totalActiveTime += 60;

            // Record timeout in history
            user.submissionHistory.push({
                qrId,
                userAnswer: "TIMEOUT",
                correctAnswer: "N/A",
                isCorrect: false,
                timeTaken: 60,
                usedHint
            });

            user.answeredQuestions.push(qrId);
            user.activeQrId = null;
            user.currentQuestionStartTime = null;
            await user.save();
            return res.status(200).json({ message: "RESPONSE RECORDED" });
        }

        // 4. Validation
        const question = await Question.findOne({ qrId });
        if (!question) return res.status(404).json({ message: "Question not found" });



        let normalizedUserAnswer = answer.trim().toLowerCase().replace(/\s\s+/g, ' ');
        const normalizedCorrectAnswer = question.correctAnswer.trim().toLowerCase().replace(/\s\s+/g, ' ');

        let isCorrect = false;

        // CRITICAL FIX: If the answer is completely blank or N/A (caused by anti-cheat/timeout),
        // it must be instantly marked false, otherwise `includes("")` evaluates to TRUE for empty strings!
        if (
            normalizedUserAnswer !== "" &&
            normalizedUserAnswer !== "n/a" &&
            normalizedUserAnswer !== "timeout" &&
            !normalizedUserAnswer.includes("anti-cheat")
        ) {
            // 1. First check if it's already an exact match (this saves us from translating Movie Titles like "Lagaan" into "Tax")
            isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

            // 2. If it's not an exact match, try translating it to see if they answered correctly in another language
            if (!isCorrect) {
                try {
                    const transRes = await translate(normalizedUserAnswer, { to: 'en' });
                    if (transRes && transRes.text) {
                        normalizedUserAnswer = transRes.text.toLowerCase().replace(/\s\s+/g, ' ');
                    }
                } catch (err) {
                    console.error("Answer evaluation translation failed:", err);
                }

                // Allow for spelling variations (e.g. 70%) or substring hits
                const similarity = stringSimilarity.compareTwoStrings(normalizedUserAnswer, normalizedCorrectAnswer);
                isCorrect = similarity >= 0.70 || normalizedUserAnswer.includes(normalizedCorrectAnswer) || normalizedCorrectAnswer.includes(normalizedUserAnswer);
            }
        }

        // 5. Scoring
        if (isCorrect) {
            user.score += 10;


        }

        // 6. Record submission history
        user.submissionHistory.push({
            qrId,
            userAnswer: answer,
            correctAnswer: question.correctAnswer,
            isCorrect,
            timeTaken,
            usedHint
        });

        // 7. Finalize: Add time, clear state
        user.totalActiveTime += timeTaken;
        user.answeredQuestions.push(qrId);
        user.activeQrId = null;
        user.currentQuestionStartTime = null;
        await user.save();

        // 8. Real-time update
        if (io) {
            io.emit('leaderboard_update');
        }

        res.status(200).json({
            correct: isCorrect,
            score: user.score,
            message: "RESPONSE RECORDED"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get the current standings
// @route   GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find()
            .sort({ score: -1, totalActiveTime: 1 })
            .limit(20)
            .select('username score totalActiveTime');

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

// @desc    Get personal user profile data
// @route   GET /api/user/:username
export const getProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select('-__v');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users with their full history for Admin Panel
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ score: -1, totalActiveTime: 1 }).select('-pin -__v');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Sabotage a player (toggles sabotage state)
// @route   POST /api/admin/sabotage
export const sabotagePlayer = async (req, res, io) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Toggle the sabotage state
        user.isSabotaged = !user.isSabotaged;
        await user.save();

        if (io) {
            io.emit('sabotage_status', { userId: user._id, isSabotaged: user.isSabotaged });
        }

        res.status(200).json({ message: `Player sabotage ${user.isSabotaged ? 'activated' : 'deactivated'}`, isSabotaged: user.isSabotaged });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a hint for the active question (-5 points)
// @route   POST /api/hint
export const getHint = async (req, res) => {
    const { userId, qrId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.activeQrId !== qrId) {
            return res.status(400).json({ message: "Invalid session for hint" });
        }

        // Apply penalty if not already used on this station
        if (!user.hintsUsed) user.hintsUsed = [];
        if (!user.hintsUsed.includes(qrId)) {
            user.score -= 5;
            user.hintsUsed.push(qrId);
            await user.save();
        }

        const question = await Question.findOne({ qrId });
        if (!question) return res.status(404).json({ message: "Question not found" });

        // Generate generic hint if a custom one doesn't exist
        let hintText = question.hint;
        if (!hintText || hintText.trim() === "") {
            const ans = question.correctAnswer;
            // Generate basic logic hint based on answer
            if (ans.length > 3 && isNaN(ans)) {
                hintText = `Starts with '${ans.substring(0, 2)}' and ends with '${ans.slice(-1)}'`;
            } else if (!isNaN(ans) && ans.length > 1) {
                hintText = `It is a ${ans.length}-digit number.`;
            } else {
                hintText = `The length of the answer is ${ans.length} character(s).`;
            }
        }

        res.status(200).json({ hint: hintText, newScore: user.score });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
