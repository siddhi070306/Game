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
    },
    options: {
        type: [String],
        default: []
    },
    hint: {
        type: String,
        default: ""
    },
    translations: {
        type: Map,
        of: String,
        default: {}
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedBy: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);
export default Question;
