import Question from '../models/Question.js';

export const seedQuestions = async () => {
    try {
        // Clear and reload to ensure IDs match Current 3-digit logic
        await Question.deleteMany({});

        const scavengerQuestions = [
            // --- GENERAL (100 Series) ---
            {
                qrId: "101",
                questionText: "Who is the Prime Minister of India?",
                correctAnswer: "Narendra Modi"
            },
            {
                qrId: "102",
                questionText: "In USF there are core values CIRCA in that what does R stand for? ",
                correctAnswer: "Respect"
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
                questionText: "What is the chemical symbol for sodium?",
                correctAnswer: "Na"
            },
            {
                qrId: "106",
                questionText: "What is the longest river in the world?",
                correctAnswer: "Nile"
            },
            {
                qrId: "107",
                questionText: "How many months have 28 days?",
                correctAnswer: "All 12 Months"
            },

            // --- ENGLISH GRAMMAR / RIDDLES (400 Series) ---
            {
                qrId: "400",
                questionText: "Write a word without a vowel {hint1:it's a word without letters AEIOU, hint2:It’s one of the key elements of music}",
                correctAnswer: "Rhythm"
            },
            {
                qrId: "401",
                questionText: "What has a head and a tail but no body?",
                correctAnswer: "Coin"
            },
            {
                qrId: "402",
                questionText: "A man says, This woman's mother is my mother-in-law. What relation is the woman to the man?",
                correctAnswer: "Daughter"
            },
            {
                qrId: "403",
                questionText: "If your uncle's brother is not your uncle, who is he?",
                correctAnswer: "Father"
            },
            {
                qrId: "404",
                questionText: "If you are in a race and pass the person in second place, what place are you in?",
                correctAnswer: "Second Place"
            },

            // --- GUESS THE MOVIES (600 Series) ---
            {
                qrId: "600",
                questionText: "Ek love story jo train journey se start hoti hai aur family opposition face karti hai.",
                correctAnswer: "Dilwale Dulhania Le Jayenge"
            },
            {
                qrId: "601",
                questionText: "Gaon wale British tax se bachne ke liye cricket match khelte hain.",
                correctAnswer: "Lagaan"
            },
            {
                qrId: "602",
                questionText: "Teen engineering students jo education system ko question karte hain.",
                correctAnswer: "3 Idiots"
            },
            {
                qrId: "603",
                questionText: "Ek purani haveli jahan ek mysterious spirit ka raaz chhupa hai.",
                correctAnswer: "Bhool Bhulaiyaa"
            },
            {
                qrId: "604",
                questionText: "Ek rich Indian family jisme pyaar aur separation ki kahani hai.",
                correctAnswer: "Kabhi Khushi Kabhie Gham"
            },
            {
                qrId: "605",
                questionText: "Teen friends foreign trip par jaate hain aur unki life change ho jaati hai.",
                correctAnswer: "Zindagi Na Milegi Dobara"
            },
            {
                qrId: "606",
                questionText: "Fast bikes, police aur robbery par based action story.",
                correctAnswer: "Dhoom"
            },
            {
                qrId: "607",
                questionText: "Indian space mission par based inspiring kahani.",
                correctAnswer: "Mission Mangal"
            },
            {
                qrId: "608",
                questionText: "Ek singer ki love story jisme success aur sacrifice hai.",
                correctAnswer: "Aashiqui 2"
            },

            // --- MATHS (700 Series) ---
            {
                qrId: "700",
                questionText: "Solve: 18 ÷ 3 + 4 × (5 - 2)",
                correctAnswer: "18"
            },
            {
                qrId: "701",
                questionText: "What is the next number in the sequence: 2, 3, 5, 7, 11?",
                correctAnswer: "13"
            },
            {
                qrId: "702",
                questionText: "If 2x - 4 = 10, what is x",
                correctAnswer: "7"
            },
            {
                qrId: "703",
                questionText: "What is 15% of 200?",
                correctAnswer: "30"
            }
        ];
        await Question.insertMany(scavengerQuestions);
        console.log("Station questions RE-SEEDED successfully!");
    } catch (error) {
        console.error("Seeding error:", error);
    }
};
