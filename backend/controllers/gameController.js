import User from '../models/User.js';
import Question from '../models/Question.js';

// @desc    Initiate a scan for a specific QR code
// @route   POST /api/scan
export const handleScan = async (req, res) => {
    const { username, qrId } = req.body;
    console.log(`Scan Request: User=${username}, Station=${qrId}`);

    try {
        let user = await User.findOne({ username });
        if (!user) {
            console.log(`Creating new user: ${username}`);
            user = await User.create({ username });
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

        console.log(`Scan successful for ${username} at station ${qrId}`);
        // 3. Return questionText and startTime for timer persistence
        res.status(200).json({
            questionText: question.questionText,
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
    const { username, qrId, answer } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 1. Security: Verify qrId matches the activeQrId
        if (user.activeQrId !== qrId) {
            return res.status(400).json({ message: "Invalid challenge session" });
        }

        // 2. Calculate time taken
        const timeTaken = (Date.now() - user.currentQuestionStartTime) / 1000;

        // 3. Time Check: 60s + 5s network grace
        if (timeTaken > 65) {
            user.totalActiveTime += 60; // Add 60s penalty as requested
            user.activeQrId = null;
            user.currentQuestionStartTime = null;
            await user.save();
            return res.status(200).json({ message: "RESPONSE RECORDED" });
        }

        // 4. Validation
        const question = await Question.findOne({ qrId });
        if (!question) return res.status(404).json({ message: "Question not found" });

        const normalizedUserAnswer = answer.trim().toLowerCase().replace(/\s\s+/g, ' ');
        const normalizedCorrectAnswer = question.correctAnswer.trim().toLowerCase().replace(/\s\s+/g, ' ');
        const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

        // 5. Scoring
        if (isCorrect) {
            user.score += 10;
        }

        // 6. Finalize: Add time, clear state
        user.totalActiveTime += timeTaken;
        user.answeredQuestions.push(qrId);
        user.activeQrId = null;
        user.currentQuestionStartTime = null;
        await user.save();

        // 7. Real-time update
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
