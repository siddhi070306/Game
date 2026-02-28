import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    qrId: {
        type: String,
        required: true,
        unique: true,
    },
    questionText: {
        type: String,
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
