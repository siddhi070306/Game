import Question from '../models/Question.js';

export const seedQuestions = async () => {
    try {
        const count = await Question.countDocuments();
        if (count === 0) {
            const scavengerQuestions = [
                {
                    qrId: "101",
                    questionText: "Which logic gate returns 1 only if all inputs are 1?",
                    correctAnswer: "AND"
                },
                {
                    qrId: "412",
                    questionText: "In the programming world, what does HTML stand for?",
                    correctAnswer: "Hypertext Markup Language"
                },
                {
                    qrId: "789",
                    questionText: "What is the capital of France?",
                    correctAnswer: "Paris"
                },
                {
                    qrId: "104",
                    questionText: "Wait! In networking, what does HTTP stand for?",
                    correctAnswer: "Hypertext Transfer Protocol"
                }
            ];
            await Question.insertMany(scavengerQuestions);
            console.log("Station questions seeded successfully!");
        }
    } catch (error) {
        console.error("Seeding error:", error);
    }
};
