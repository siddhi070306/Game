import Question from '../models/Question.js';

export const seedQuestions = async () => {
    try {
        const count = await Question.countDocuments();
        if (count === 0) {
            const scavengerQuestions = [
                {
                    qrId: "QR001",
                    questionText: "Which logic gate returns 1 only if all inputs are 1?",
                    correctAnswer: "AND"
                },
                {
                    qrId: "QR002",
                    questionText: "What is the decimal equivalent of the binary number 1010?",
                    correctAnswer: "10"
                },
                {
                    qrId: "QR003",
                    questionText: "Who is known as the father of modern computing?",
                    correctAnswer: "Alan Turing"
                },
                {
                    qrId: "QR004",
                    questionText: "In networking, what does HTTP stand for?",
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
