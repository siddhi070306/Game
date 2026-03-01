import Question from '../models/Question.js';

export const seedQuestions = async () => {
    try {
        await Question.deleteMany({});

        const scavengerQuestions = [
            // --- GENERAL (100 Series) ---
            { qrId: "101", questionText: "Who is the Prime Minister of India?", correctAnswer: "Narendra Modi", options: ["Narendra Modi", "Rahul Gandhi", "Amit Shah", "Arvind Kejriwal"] },
            { qrId: "102", questionText: "In USF there are core values CIRCA in that what does R stand for?", correctAnswer: "Respect", options: ["Responsibility", "Righteousness", "Respect", "Readiness"] },
            { qrId: "103", questionText: "What is the capital of France?", correctAnswer: "Paris", options: ["London", "Rome", "Paris", "Berlin"] },
            { qrId: "104", questionText: "Wait! In networking, what does HTTP stand for?", correctAnswer: "Hypertext Transfer Protocol", options: ["Hyper Transfer Text Protocol", "Hypertext Transfer Protocol", "High Test Transfer Protocol", "Hyperlink Transfer Technology"] },
            { qrId: "105", questionText: "What is the chemical symbol for sodium?", correctAnswer: "Na", options: ["So", "N", "Na", "Sd"] },
            { qrId: "106", questionText: "What is the longest river in the world?", correctAnswer: "Nile", options: ["Amazon", "Nile", "Mississippi", "Yangtze"] },
            { qrId: "107", questionText: "How many months have 28 days?", correctAnswer: "All 12 Months", options: ["1", "6", "All 12 Months", "2"] },
            { qrId: "108", questionText: "Which planet is known as the Red Planet?", correctAnswer: "Mars", options: ["Venus", "Mars", "Jupiter", "Saturn"] },
            { qrId: "109", questionText: "Who wrote 'Romeo and Juliet'?", correctAnswer: "William Shakespeare", options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"] },
            { qrId: "110", questionText: "What gas do plants absorb from the atmosphere?", correctAnswer: "Carbon Dioxide", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"] },
            { qrId: "111", questionText: "What is the hardest natural substance on Earth?", correctAnswer: "Diamond", options: ["Gold", "Diamond", "Iron", "Platinum"] },
            { qrId: "112", questionText: "How many continents are there?", correctAnswer: "7", options: ["5", "6", "7", "8"] },
            { qrId: "113", questionText: "What is the largest ocean on Earth?", correctAnswer: "Pacific Ocean", options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"] },
            { qrId: "114", questionText: "Who painted the Mona Lisa?", correctAnswer: "Leonardo da Vinci", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"] },
            { qrId: "115", questionText: "What is the largest mammal in the world?", correctAnswer: "Blue Whale", options: ["Elephant", "Shark", "Giraffe", "Blue Whale"] },
            { qrId: "116", questionText: "How many colors are in a rainbow?", correctAnswer: "7", options: ["6", "7", "8", "9"] },
            { qrId: "117", questionText: "What do bees collect to make honey?", correctAnswer: "Nectar", options: ["Pollen", "Water", "Nectar", "Sap"] },
            { qrId: "118", questionText: "Which is the tallest mountain in the world?", correctAnswer: "Mount Everest", options: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"] },
            { qrId: "119", questionText: "In computing, what does CPU stand for?", correctAnswer: "Central Processing Unit", options: ["Computer Personal Unit", "Control Processing Unit", "Central Processing Unit", "Central Program Unit"] },
            { qrId: "120", questionText: "What is the freezing point of water in Celsius?", correctAnswer: "0", options: ["100", "0", "32", "-10"] },

            // --- ENGLISH GRAMMAR / RIDDLES (400 Series) ---
            { qrId: "400", questionText: "Write a word without a vowel {hint1:it's a word without letters AEIOU, hint2:It’s one of the key elements of music}", correctAnswer: "Rhythm", options: ["Sky", "Rhythm", "Cry", "Fly"] },
            { qrId: "401", questionText: "What has a head and a tail but no body?", correctAnswer: "Coin", options: ["Snake", "Coin", "Rope", "River"] },
            { qrId: "402", questionText: "A man says, This woman's mother is my mother-in-law. What relation is the woman to the man?", correctAnswer: "Daughter" }, // Family (No options)
            { qrId: "403", questionText: "If your uncle's brother is not your uncle, who is he?", correctAnswer: "Father" }, // Family (No options)
            { qrId: "404", questionText: "If you are in a race and pass the person in second place, what place are you in?", correctAnswer: "Second Place", options: ["First Place", "Second Place", "Third Place", "Last Place"] },
            { qrId: "405", questionText: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", correctAnswer: "Echo", options: ["Ghost", "Shadow", "Echo", "Wind"] },
            { qrId: "406", questionText: "What gets wetter as it dries?", correctAnswer: "Towel", options: ["Sponge", "Towel", "Cloth", "Paper"] },
            { qrId: "407", questionText: "The more of this there is, the less you see. What is it?", correctAnswer: "Darkness", options: ["Fog", "Smoke", "Darkness", "Shadow"] },
            { qrId: "408", questionText: "I have keys but open no doors. I have space but no room. You can enter but can't go outside. What am I?", correctAnswer: "Keyboard", options: ["Lock", "Piano", "Keyboard", "Map"] },
            { qrId: "409", questionText: "What goes up but never comes down?", correctAnswer: "Age", options: ["Balloon", "Age", "Smoke", "Height"] },
            { qrId: "410", questionText: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", correctAnswer: "Map", options: ["Globe", "Atlas", "Map", "Dictionary"] },
            { qrId: "411", questionText: "What can you hold in your right hand, but never in your left hand?", correctAnswer: "Your left hand" }, // Body/Relation (No options)
            { qrId: "412", questionText: "What belongs to you, but other people use it more than you?", correctAnswer: "Your name", options: ["Your phone", "Your house", "Your name", "Your car"] },
            { qrId: "413", questionText: "I am full of holes but still hold water. What am I?", correctAnswer: "Sponge", options: ["Net", "Sponge", "Sieve", "Bucket"] },
            { qrId: "414", questionText: "What has legs, but doesn't walk?", correctAnswer: "Table", options: ["Chair", "Snake", "Table", "Bed"] },
            { qrId: "415", questionText: "What breaks yet never falls, and what falls yet never breaks?", correctAnswer: "Day and Night", options: ["Sun and Moon", "Day and Night", "Sky and Earth", "Rain and Snow"] },
            { qrId: "416", questionText: "What comes once in a minute, twice in a moment, but never in a thousand years?", correctAnswer: "The letter M", options: ["Space", "Time", "The letter M", "Clock"] },
            { qrId: "417", questionText: "What has hands but cannot clap?", correctAnswer: "Clock", options: ["Monkey", "Clock", "Robot", "Statue"] },
            { qrId: "418", questionText: "I am an odd number. Take away a letter and I become even. What number am I?", correctAnswer: "Seven", options: ["Nine", "Seven", "Eleven", "Three"] },
            { qrId: "419", questionText: "What has one eye, but can't see?", correctAnswer: "Needle", options: ["Potato", "Needle", "Storm", "Hurricane"] },

            // --- GUESS THE MOVIES (600 Series) ---
            { qrId: "600", questionText: "Ek love story jo train journey se start hoti hai aur family opposition face karti hai.", correctAnswer: "Dilwale Dulhania Le Jayenge", options: ["Kuch Kuch Hota Hai", "Dilwale Dulhania Le Jayenge", "Kabhi Khushi Kabhie Gham", "Mohabbatein"] },
            { qrId: "601", questionText: "Gaon wale British tax se bachne ke liye cricket match khelte hain.", correctAnswer: "Lagaan", options: ["Swades", "Chak De India", "Lagaan", "Mangal Pandey"] },
            { qrId: "602", questionText: "Teen engineering students jo education system ko question karte hain.", correctAnswer: "3 Idiots", options: ["Chhichhore", "3 Idiots", "Munna Bhai MBBS", "PK"] },
            { qrId: "603", questionText: "Ek purani haveli jahan ek mysterious spirit ka raaz chhupa hai.", correctAnswer: "Bhool Bhulaiyaa", options: ["Stree", "Raaz", "Bhool Bhulaiyaa", "1920"] },
            { qrId: "604", questionText: "Ek rich Indian family jisme pyaar aur separation ki kahani hai.", correctAnswer: "Kabhi Khushi Kabhie Gham", options: ["Hum Aapke Hain Koun", "Kal Ho Naa Ho", "Kabhi Khushi Kabhie Gham", "Baghban"] },
            { qrId: "605", questionText: "Teen friends foreign trip par jaate hain aur unki life change ho jaati hai.", correctAnswer: "Zindagi Na Milegi Dobara", options: ["Dil Chahta Hai", "Zindagi Na Milegi Dobara", "Yeh Jawaani Hai Deewani", "Rock On"] },
            { qrId: "606", questionText: "Fast bikes, police aur robbery par based action story.", correctAnswer: "Dhoom", options: ["Race", "Don", "Bang Bang", "Dhoom"] },
            { qrId: "607", questionText: "Indian space mission par based inspiring kahani.", correctAnswer: "Mission Mangal", options: ["Parmanu", "Swades", "Mission Mangal", "Airlift"] },
            { qrId: "608", questionText: "Ek singer ki love story jisme success aur sacrifice hai.", correctAnswer: "Aashiqui 2", options: ["Rockstar", "Kabir Singh", "Aashiqui 2", "Ae Dil Hai Mushkil"] },
            { qrId: "609", questionText: "Ek RAW agent aur ISI agent desh bachaane aur pyaar ke liye sab chod dete hain.", correctAnswer: "Ek Tha Tiger", options: ["Pathaan", "Ek Tha Tiger", "War", "Bang Bang"] },
            { qrId: "610", questionText: "Ek aadmi jiske memory loss ke baad vo apne wife ke murderer ko dhoondtha hai.", correctAnswer: "Ghajini", options: ["Memento", "Talaash", "Ghajini", "Darr"] },
            { qrId: "611", questionText: "Do police officers ek international don ko pakadte hain jo apne aap ko 'Don' kehta hai.", correctAnswer: "Don", options: ["Raees", "Krrish", "Don", "Dhoom 2"] },
            { qrId: "612", questionText: "Ek aam aadmi jo corrupt system ko sudharne ke liye CM banta hai ek din ke liye.", correctAnswer: "Nayak", options: ["Singham", "Nayak", "Simmba", "Rowdy Rathore"] },
            { qrId: "613", questionText: "Ek cop corrupt politicians ka saamna karta hai, 'Aata majhi satakli' bolta hai.", correctAnswer: "Singham", options: ["Dabangg", "Simmba", "Singham", "Sooryavanshi"] },
            { qrId: "614", questionText: "Bhaaiyon ki kahaani jo dhokha milne ke baad revenge lete hain, Amitabh & Shashi Kapoor.", correctAnswer: "Deewaar", options: ["Sholay", "Don", "Deewaar", "Agneepath"] },
            { qrId: "615", questionText: "Ek bacha jiske dyslexia condition ko ek art teacher samajhta hai aur uski life badalta hai.", correctAnswer: "Taare Zameen Par", options: ["Stanley Ka Dabba", "Hichki", "Taare Zameen Par", "Udaan"] },
            { qrId: "616", questionText: "Do dost, Veeru aur Jai, ek daku Gabbar Singh se ladte hain Ramgarh gao me.", correctAnswer: "Sholay", options: ["Karma", "Deewaar", "Sholay", "Kaala Patthar"] },
            { qrId: "617", questionText: "Ek ameer ladka aur middle class ladki, Prem aur Nisha, ki shaadi mein twist hota hai.", correctAnswer: "Hum Aapke Hain Koun..!", options: ["Maine Pyar Kiya", "Hum Saath-Saath Hain", "Hum Aapke Hain Koun..!", "Vivah"] },
            { qrId: "618", questionText: "Do bhaiyan, Karan aur Arjun, dono ko rebirth milta hai apne past death ka badla lene.", correctAnswer: "Karan Arjun", options: ["Ram Lakhan", "Sholay", "Karan Arjun", "Darr"] },
            { qrId: "619", questionText: "Ek deaf and mute gaon ki ladki Pakistan me kho jati hai aur Bajrangi usse wapas chhodne jata hai.", correctAnswer: "Bajrangi Bhaijaan", options: ["PK", "Sultan", "Bajrangi Bhaijaan", "Tubelight"] },

            // --- MATHS (700 Series) (NO OPTIONS) ---
            { qrId: "700", questionText: "Solve: 18 ÷ 3 + 4 × (5 - 2)", correctAnswer: "18" },
            { qrId: "701", questionText: "What is the next number in the sequence: 2, 3, 5, 7, 11?", correctAnswer: "13" },
            { qrId: "702", questionText: "If 2x - 4 = 10, what is x", correctAnswer: "7" },
            { qrId: "703", questionText: "What is 15% of 200?", correctAnswer: "30" },
            { qrId: "704", questionText: "What is 9 multiplied by 8?", correctAnswer: "72" },
            { qrId: "705", questionText: "If a triangle has a base of 10 and height of 5, what is its area?", correctAnswer: "25" },
            { qrId: "706", questionText: "If you buy an item for 40 and sell it for 60, what is the profit percentage?", correctAnswer: "50%" },
            { qrId: "707", questionText: "Solve: 5 ^ 3 (5 cubed)", correctAnswer: "125" },
            { qrId: "708", questionText: "Solve: (10 + 20) x 2 - 10", correctAnswer: "50" },
            { qrId: "709", questionText: "What is the square root of 144?", correctAnswer: "12" },
            { qrId: "710", questionText: "Convert 0.75 into a fraction (e.g. 1/2).", correctAnswer: "3/4" },
            { qrId: "711", questionText: "How many degrees are in a full circle?", correctAnswer: "360" },
            { qrId: "712", questionText: "What is the value of pi (up to two decimal places)?", correctAnswer: "3.14" },
            { qrId: "713", questionText: "If x + 5 = 12, what is 2x?", correctAnswer: "14" },
            { qrId: "714", questionText: "What is the perimeter of a rectangle with length 8 and width 3?", correctAnswer: "22" },
            { qrId: "715", questionText: "Solve: 100 / 4 + 15", correctAnswer: "40" },
            { qrId: "716", questionText: "If a car travels at 60 km/h, how far will it travel in 1.5 hours?", correctAnswer: "90" },
            { qrId: "717", questionText: "What is a polygon with 8 sides called?", correctAnswer: "Octagon" },
            { qrId: "718", questionText: "What is 7 factorial (7!) divided by 6 factorial (6!)?", correctAnswer: "7" },
            { qrId: "719", questionText: "Solve: 8 - 4 x 2 + 10", correctAnswer: "10" }
        ];

        await Question.insertMany(scavengerQuestions);
        console.log("Station questions RE-SEEDED successfully with options!");
    } catch (error) {
        console.error("Seeding error:", error);
    }
};
