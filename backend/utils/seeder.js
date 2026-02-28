import Question from '../models/Question.js';

export const seedQuestions = async () => {
    try {
        // Clear and reload to ensure IDs match Current 3-digit logic
        await Question.deleteMany({});

        const scavengerQuestions = [
            {
                qrId: "101",
                questionText: "Which logic gate returns 1 only if all inputs are 1?",
                correctAnswer: "AND"
            },
            {
                qrId: "102",
                questionText: "In the programming world, what does HTML stand for?",
                correctAnswer: "Hypertext Markup Language"
            },
            {
                qrId: "103",
                questionText: "What is the capital of France?",
                correctAnswer: "Paris"
            },
            {
                qrId: "104",
                questionText: "Wait! In networking, what does HTTP stand for?",
                correctAnswer: "Hypertext Transfer Protocol"
            },
            {
                qrId: "105",
                questionText: "Solve: 18 ÷ 3 + 4 × (5 - 2)",
                correctAnswer: "18"
            },
            {
                qrId: "106",
                questionText: "What is the chemical symbol for sodium?",
                correctAnswer: "Na"
            }
        ];
        await Question.insertMany(scavengerQuestions);
        console.log("Station questions RE-SEEDED successfully!");
    } catch (error) {
        console.error("Seeding error:", error);
    }
};
