import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    pin: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: 0,
    },
    totalActiveTime: {
        type: Number,
        default: 0, // Measures seconds taken
    },
    answeredQuestions: {
        type: [String],
        default: []
    },
    hintsUsed: {
        type: [String],
        default: []
    },
    submissionHistory: [{
        qrId: { type: String },
        userAnswer: { type: String },
        correctAnswer: { type: String },
        isCorrect: { type: Boolean },
        timeTaken: { type: Number },
        usedHint: { type: Boolean, default: false },
        submittedAt: { type: Date, default: Date.now }
    }],
    currentQuestionStartTime: {
        type: Date,
    },
    activeQrId: {
        type: String,
    }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
