import User from '../models/User.js';
import Question from '../models/Question.js';
import translate from 'google-translate-api-x';
import stringSimilarity from 'string-similarity';

// @desc    Login or register a user with PIN
// @route   POST /api/login
export const loginPlayer = async (req, res) => {
    const { username, pin } = req.body;

    if (!username || !pin) {
        return res.status(400).json({ message: "Username and PIN are required" });
    }

    try {
        let user = await User.findOne({ username });

        // Scenario A: User does not exist, create new
        if (!user) {
            user = await User.create({ username, pin });
            return res.status(200).json({ userId: user._id, username: user.username });
        }

        // Scenario B: User exists, verify PIN
        if (!user.pin) {
            // Legacy user with no PIN - set the PIN for them
            user.pin = pin;
            await user.save();
        } else if (user.pin !== pin) {
            return res.status(401).json({ message: "Username taken or incorrect PIN" });
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
            try {
                const transRes = await translate(finalQuestionText, { to: lang });
                if (transRes && transRes.text) {
                    finalQuestionText = transRes.text;
                }

                // Translate the buttons/options as well
                if (finalOptions.length > 0) {
                    const optsRes = await translate(finalOptions, { to: lang });
                    if (optsRes) {
                        if (Array.isArray(optsRes)) {
                            finalOptions = optsRes.map(res => res.text);
                        } else if (optsRes.text) {
                            finalOptions = [optsRes.text];
                        }
                    }
                }
            } catch (err) {
                console.error("Question translation failed, falling back to English.");
            }
        }

        console.log(`Scan successful for ${user.username} at station ${qrId}`);
        // 3. Return questionText and startTime for timer persistence
        res.status(200).json({
            questionText: finalQuestionText,
            options: finalOptions,
            startTime: user.currentQuestionStartTime
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
                timeTaken: 60
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

        // 1. First check if it's already an exact match (this saves us from translating Movie Titles like "Lagaan" into "Tax")
        let isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

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
            timeTaken
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
