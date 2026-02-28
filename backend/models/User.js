import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
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
