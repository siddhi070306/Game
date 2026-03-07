import Question from '../models/Question.js';

export const seedQuestions = async () => {
    try {
        await Question.deleteMany({});

        const scavengerQuestions = [
            // --- GENERAL (100 Series) ---
            { qrId: "101", questionText: "Who is the current President of India?", correctAnswer: "Droupadi Murmu", options: ["Narendra Modi", "Rahul Gandhi", "Ram Nath Kovind", "Droupadi Murmu"] },
            { qrId: "102", questionText: "In USF there are core values CIRCA in that what does R stand for?", correctAnswer: "Respect", options: ["Responsibility", "Righteousness", "Respect", "Readiness"] },
            { qrId: "103", questionText: "What is the capital of India?", correctAnswer: "New Delhi", options: ["Mumbai", "Kolkata", "New Delhi", "Chennai"] },
            { qrId: "104", questionText: "In USF there are core values CIRCA what does A stands for??", correctAnswer: "Accountable", options: ["Accountable", "Acocuntant", "Accountantship", "Audit"] },
            { qrId: "105", questionText: "What is the chemical symbol for sodium?", correctAnswer: "Na", options: ["So", "N", "Na", "Sd"] },
            { qrId: "106", questionText: "What is the longest river in the world?", correctAnswer: "Nile", options: ["Amazon", "Nile", "Mississippi", "Yangtze"] },
            { qrId: "107", questionText: "How many months have 28 days?", correctAnswer: "All 12 Months", options: ["1", "6", "All 12 Months", "2"] },
            { qrId: "108", questionText: "Which planet is known as the Red Planet?", correctAnswer: "Mars", options: ["Venus", "Mars", "Jupiter", "Saturn"] },
            { qrId: "109", questionText: "Which is the hottest planet in solar system?", correctAnswer: "Venus", options: ["Mercury", "Venus", "Earth", "Mars"] },
            { qrId: "110", questionText: "What gas do plants absorb from the atmosphere?", correctAnswer: "Carbon Dioxide", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"] },
            { qrId: "111", questionText: "What is the hardest natural substance on Earth?", correctAnswer: "Diamond", options: ["Carbon", "Diamond", "Iron", "Platinum"] },
            { qrId: "112", questionText: "How many continents are there?", correctAnswer: "7", options: ["5", "6", "7", "8"] },
            { qrId: "113", questionText: "What is the largest ocean on Earth?", correctAnswer: "Pacific Ocean", options: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"] },
            { qrId: "114", questionText: "Who is the founder of udyan care?", correctAnswer: "Kiran Modi", options: ["Kiran Modi Mam", "Bhagyashree Mam", "Mangal Mam", "Komal Mam"] },
            { qrId: "115", questionText: "What is the largest mammal in the world?", correctAnswer: "Blue Whale", options: ["Elephant", "Shark", "Giraffe", "Blue Whale"] },
            { qrId: "116", questionText: "Women to recieve nobel price twice  ?", correctAnswer: "Marie Curie", options: ["Marie Curie", "Malala Yousafzai", "Mother Teresa", "Kiran Bedi"] },
            { qrId: "117", questionText: "Who wrote the nation anthem of India?", correctAnswer: "Rabindranath Tagore", options: ["Mahatma Gandhi", "Rabindranath Tagore", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"] },
            { qrId: "118", questionText: "Which is the tallest mountain in the world?", correctAnswer: "Mount Everest", options: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"] },
            { qrId: "119", questionText: "In computer, what does CPU stand for?", correctAnswer: "Central Processing Unit", options: ["Computer Personal Unit", "Control Processing Unit", "Central Processing Unit", "Central Program Unit"] },
            { qrId: "120", questionText: "What is the freezing point of water in Celsius?", correctAnswer: "0", options: ["100", "0", "32", "-10"] },
            { qrId: "121", questionText: "What is the chemical symbol for Gold?", correctAnswer: "Au", options: ["Ag", "Au", "Gd", "Go"] },

            // --- ENGLISH GRAMMAR / RIDDLES (400 Series) ---
            { qrId: "400", questionText: "Write a word without a vowel { hint:It’s one of the key elements of music}", correctAnswer: "Rhythm", options: ["Melody", "Rhythm", "Chord", "Harmony"] },
            { qrId: "401", questionText: "What has a head and a tail but no body?", correctAnswer: "Coin", options: ["Snake", "Coin", "Rope", "Node"] },
            { qrId: "402", questionText: "A man says, This woman's mother is my mother-in-law. What relation is the woman to the man?", correctAnswer: "Wife" }, // Family (No options)
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
            { qrId: "420", questionText: "Choose the grammatically correct sentence:", correctAnswer: "Each of the students was given a book.", options: ["Each of the students were given a book.", "Each of the students was given a book.", "Each of the student were given a book.", "Each of the students are given a book."] },
            { qrId: "421", questionText: "What has keys but can't open locks?", correctAnswer: "A piano", options: ["A piano", "A map", "A treasure chest", "A password"] },
            { qrId: "422", questionText: "I have branches, but no fruit, trunk, or leaves. What am I?", correctAnswer: "A bank", options: ["A bank", "A shadow", "A stick", "A skeleton"] },

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
            { qrId: "620", questionText: "In Yeh Jawaani Hai Deewani, what is the name of the scenic Himalayan trek the group embarks on?", correctAnswer: "Manali Trek", options: ["Roopkund Trek", "Manali Trek", "Kheerganga Trek", "Hampta Pass Trek"] },
            { qrId: "621", questionText: "\"Mogambo khush hua\" is the unforgettable dialogue of the villain in which classic film?", correctAnswer: "Mr. India", options: ["Shaan", "Don", "Mr. India", "Ram Lakhan"] },

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
            { qrId: "719", questionText: "Solve: 8 - 4 x 2 + 10", correctAnswer: "10" },
            { qrId: "720", questionText: "What is the square root of 144 multiplied by 2?", correctAnswer: "24", options: ["12", "24", "36", "14"] }
        ];

        const translateDict = {
            // General (100 Series)
            '101': { mr: 'भारताचे पंतप्रधान कोण आहेत?', hi: 'भारत के प्रधानमंत्री कौन हैं?' },
            '102': { mr: 'USF मध्ये CIRCA ही मुख्य मूल्ये आहेत, त्यात R चा अर्थ काय?', hi: 'USF में CIRCA मुख्य मूल्य हैं, उसमें R का क्या अर्थ है?' },
            '103': { mr: 'फ्रान्सची राजधानी कोणती आहे?', hi: 'फ्रांस की राजधानी कौन सी है?' },
            '104': { mr: 'थांबा! नेटवर्किंगमध्ये, HTTP चा अर्थ काय आहे?', hi: 'रुकिए! नेटवर्किंग में, HTTP का क्या अर्थ है?' },
            '105': { mr: 'सोडियमचे रासायनिक चिन्ह काय आहे?', hi: 'सोडियम का रासायनिक प्रतीक क्या है?' },
            '106': { mr: 'जगातील सर्वात लांब नदी कोणती आहे?', hi: 'दुनिया की सबसे लंबी नदी कौन सी है?' },
            '107': { mr: 'किती महिन्यांत 28 दिवस असतात?', hi: 'कितने महीनों में 28 दिन होते हैं?' },
            '108': { mr: 'कोणता ग्रह लाल ग्रह म्हणून ओळखला जातो?', hi: 'किस ग्रह को लाल ग्रह के नाम से जाना जाता है?' },
            '109': { mr: '\'रोमिओ आणि ज्युलिएट\' कोणी लिहिले?', hi: '\'रोमियो और जूलियट\' किसने लिखा था?' },
            '110': { mr: 'वनस्पती वातावरणातून कोणता वायू शोषून घेतात?', hi: 'पौधे वायुमंडल से कौन सी गैस सोखते हैं?' },
            '111': { mr: 'पृथ्वीवरील सर्वात कठीण नैसर्गिक पदार्थ कोणता आहे?', hi: 'पृथ्वी पर सबसे कठोर प्राकृतिक पदार्थ कौन सा है?' },
            '112': { mr: 'किती खंड आहेत?', hi: 'कितने महाद्वीप हैं?' },
            '113': { mr: 'पृथ्वीवरील सर्वात मोठा महासागर कोणता आहे?', hi: 'पृथ्वी पर सबसे बड़ा महासागर कौन सा है?' },
            '114': { mr: 'मोनालिसाचे चित्र कोणी काढले?', hi: 'मोनालिसा की पेंटिंग किसने बनाई थी?' },
            '115': { mr: 'जगातील सर्वात मोठा सस्तन प्राणी कोणता आहे?', hi: 'दुनिया का सबसे बड़ा स्तनपायी जानवर कौन सा है?' },
            '116': { mr: 'इंद्रधनुष्यात किती रंग असतात?', hi: 'इंद्रधनुष्य में कितने रंग होते हैं?' },
            '117': { mr: 'मधमाश्या मध बनवण्यासाठी काय गोळा करतात?', hi: 'मधुमक्खियां शहद बनाने के लिए क्या इकट्ठा करती हैं?' },
            '118': { mr: 'जगातील सर्वात उंच पर्वत कोणता आहे?', hi: 'दुनिया का सबसे ऊंचा पर्वत कौन सा है?' },
            '119': { mr: 'संगणकामध्ये, CPU चा अर्थ काय आहे?', hi: 'कंप्यूटर में, CPU का क्या अर्थ है?' },
            '120': { mr: 'सेल्सिअसमध्ये पाण्याचा गोठणबिंदू किती असतो?', hi: 'सेल्सियस में पानी का हिमांक (freezing point) क्या है?' },

            // Riddles (400 Series)
            '400': { mr: 'स्वर (Vowel) नसलेला शब्द लिहा {hint: हे संगीतातील मुख्य घटकांपैकी एक आहे}', hi: 'बिना स्वर (vowel) का एक शब्द लिखें {hint: यह संगीत के मुख्य तत्वों में से एक है}' },
            '401': { mr: 'असे काय आहे ज्याला डोके आणि शेपटी आहे पण शरीर नाही?', hi: 'वह क्या है जिसके सिर और पूंछ है लेकिन शरीर नहीं है?' },
            '402': { mr: 'एक माणूस म्हणतो, या स्त्रीची आई माझी सासू आहे. तर त्या स्त्रीचे त्या माणसाशी काय नाते आहे?', hi: 'एक आदमी कहता है, इस औरत की माँ मेरी सास है। तो उस औरत का उस आदमी से क्या रिश्ता है?' },
            '403': { mr: 'जर तुमच्या काकाचा भाऊ तुमचा काका नसेल, तर तो कोण आहे?', hi: 'यदि आपके चाचा का भाई आपका चाचा नहीं है, तो वह कौन है?' },
            '404': { mr: 'जर तुम्ही शर्यतीत दुसऱ्या क्रमांकावरील व्यक्तीला मागे टाकले, तर तुम्ही कोणत्या स्थानावर आहात?', hi: 'यदि आप एक दौड़ में हैं और दूसरे स्थान वाले व्यक्ति को पीछे छोड़ देते हैं, तो आप किस स्थान पर हैं?' },
            '405': { mr: 'मी तोंडाशिवाय बोलतो आणि कानांशिवाय ऐकतो. मला शरीर नाही, पण मी वाऱ्याने जिवंत होतो. मी कोण आहे?', hi: 'मैं बिना मुँह के बोलता हूँ और बिना कानों के सुनता हूँ। मेरा कोई शरीर नहीं है, लेकिन मैं हवा के साथ जिंदा हो जाता हूँ। मैं कौन हूँ?' },
            '406': { mr: 'असे काय आहे जे पुसताना अधिक ओले होते?', hi: 'वह क्या है जो पोंछते ही गीला हो जाता है?' },
            '407': { mr: 'हे जितके जास्त असेल, तितके तुम्हाला कमी दिसेल. हे काय आहे?', hi: 'यह जितना अधिक होगा, आप उतना ही कम देख पाएंगे। यह क्या है?' },
            '408': { mr: 'माझ्याकडे चाव्या (keys) आहेत पण मी दरवाजे उघडू शकत नाही. माझ्याकडे जागा (space) आहे पण खोली (room) नाही. तुम्ही प्रवेश (enter) करू शकता पण बाहेर जाऊ शकत नाही. मी कोण आहे?', hi: 'मेरे पास कुंजियाँ (keys) हैं लेकिन मैं दरवाजे नहीं खोल सकता। मेरे पास जगह (space) है लेकिन कमरा (room) नहीं है। आप प्रवेश (enter) कर सकते हैं लेकिन बाहर नहीं जा सकते। मैं कौन हूँ?' },
            '409': { mr: 'असे काय आहे जे फक्त वर जाते पण कधीही खाली येत नाही?', hi: 'वह क्या है जो ऊपर जाता है लेकिन कभी नीचे नहीं आता?' },
            '410': { mr: 'माझ्यात शहरे आहेत, पण घरे नाहीत. डोंगर आहेत, पण झाडे नाहीत. पाणी आहे, पण मासे नाहीत. मी कोण आहे?', hi: 'मुझमें शहर हैं, लेकिन घर नहीं। पहाड़ हैं, लेकिन पेड़ नहीं। पानी है, लेकिन मछलियाँ नहीं। मैं कौन हूँ?' },
            '411': { mr: 'तुम्ही तुमच्या उजव्या हातात काय पकडू शकता, पण डाव्या हातात कधीच नाही?', hi: 'आप अपने दाहिने हाथ में क्या पकड़ सकते हैं, लेकिन बाएं हाथ में कभी नहीं?' },
            '412': { mr: 'ते तुमचे आहे, परंतु इतर लोक त्याचा तुमच्यापेक्षा जास्त वापर करतात. ते काय आहे?', hi: 'यह आपका है, लेकिन दूसरे लोग इसका उपयोग आपसे अधिक करते हैं। यह क्या है?' },
            '413': { mr: 'माझ्यात अनेक छिद्रे आहेत तरीही मी पाणी धरून ठेवू शकतो. मी कोण आहे?', hi: 'मुझमें छेद हैं लेकिन फिर भी मैं पानी पकड़ सकता हूँ। मैं कौन हूँ?' },
            '414': { mr: 'ज्याला पाय आहेत, पण तो चालू शकत नाही. तो कोण आहे?', hi: 'जिसके पैर हैं, लेकिन वह चल नहीं सकता। वह क्या है?' },
            '415': { mr: 'असे काय आहे जे टूटते पण पडत नाही, आणि जे पडते पण कधीच टूटत नाही?', hi: 'वह क्या है जो टूटता है लेकिन कभी गिरता नहीं, और जो गिरता है लेकिन कभी टूटता नहीं?' },
            '416': { mr: 'जे एका मिनिटात एकदाच येते, क्षणात दोनदा येते, पण हजार वर्षात कधीच येत नाही. ते काय आहे?', hi: 'जो एक मिनट में एक बार आता है, एक पल में दो बार, लेकिन एक हजार साल में कभी नहीं। वह क्या है?' },
            '417': { mr: 'ज्याला हात आहेत पण टाळी वाजवू शकत नाही. तो कोण आहे?', hi: 'जिसके हाथ हैं लेकिन ताली नहीं बजा सकता। वह क्या है?' },
            '418': { mr: 'मी एक विषम संख्या (odd number) आहे. एक अक्षर काढून टाका आणि मी सम (even) बनतो. मी कोणती संख्या आहे?', hi: 'मैं एक विषम संख्या (odd number) हूँ। एक अक्षर हटा दो और मैं सम (even) बन जाता हूँ। मैं कौन सी संख्या हूँ?' },
            '419': { mr: 'ज्याला एक डोळा आहे, पण तो पाहू शकत नाही. तो कोण आहे?', hi: 'जिसकी एक आँख है, लेकिन वह देख नहीं सकता। वह क्या है?' },

            // Guess the movies (600 Series)
            '600': { mr: 'एक प्रेमकथा जी ट्रेन प्रवासापासून सुरू होते आणि कुटुंबाच्या विरोधाचा सामना करते.', hi: 'एक प्रेम कहानी जो ट्रेन जर्नी से शुरू होती है और फैमिली अपोजिशन फेस करती है।' },
            '601': { mr: 'ब्रिटिश टॅक्सपासून वाचण्यासाठी गावकरी क्रिकेट मॅच खेळतात.', hi: 'गांव वाले ब्रिटिश टैक्स से बचने के लिए क्रिकेट मैच खेलते हैं।' },
            '602': { mr: 'तीन इंजिनिअरिंग विद्यार्थी जे शिक्षण व्यवस्थेला प्रश्न विचारतात.', hi: 'तीन इंजीनियरिंग छात्र जो शिक्षा प्रणाली पर सवाल उठाते हैं।' },
            '603': { mr: 'एक जुनी हवेली जिथे एका रहस्यमयी आत्म्याचे रहस्य दडलेले आहे.', hi: 'एक पुरानी हवेली जहाँ एक रहस्यमयी आत्मा का राज छुपा है।' },
            '604': { mr: 'एक श्रीमंत भारतीय कुटुंब ज्यामध्ये प्रेम आणि विरहाची कहाणी आहे.', hi: 'एक अमीर भारतीय परिवार जिसमें प्यार और जुदाई की कहानी है।' },
            '605': { mr: 'तीन मित्र परदेश दौऱ्यावर जातात आणि त्यांचे आयुष्य बदलते.', hi: 'तीन दोस्त विदेश यात्रा पर जाते हैं और उनकी जिंदगी बदल जाती है।' },
            '606': { mr: 'फास्ट बाईक्स, पोलीस आणि चोरीवर आधारित ॲक्शन स्टोरी.', hi: 'फास्ट बाइक्स, पुलिस और चोरी पर आधारित एक्शन स्टोरी।' },
            '607': { mr: 'भारतीय अंतराळ मोहिमेवर आधारित प्रेरणादायी कहाणी.', hi: 'भारतीय अंतरिक्ष मिशन पर आधारित एक प्रेरणादायक कहानी।' },
            '608': { mr: 'एका गायकाची प्रेमकथा ज्यामध्ये यश आणि त्याग आहे.', hi: 'एक गायक की प्रेम कहानी जिसमें सफलता और त्याग है।' },
            '609': { mr: 'एक रॉ एजंट आणि आयएसआय एजंट देश वाचवण्यासाठी आणि प्रेमासाठी सर्वस्व पणाला लावतात.', hi: 'एक रॉ एजेंट और आईएसआई एजेंट देश बचाने और प्यार के लिए सब छोड़ देते हैं।' },
            '610': { mr: 'एक माणूस ज्याची स्मरणशक्ती हरवल्यानंतर तो त्याच्या पत्नीचा खून करणाऱ्याला शोधतो.', hi: 'एक आदमी जो अपनी याददाश्त खोने के बाद अपनी पत्नी के हत्यारे को ढूंढता है।' },
            '611': { mr: 'दोन पोलीस अधिकारी एका आंतरराष्ट्रीय डॉनला पकडतात जो स्वतःला डॉन म्हणवतो.', hi: 'दो पुलिस अधिकारी एक अंतरराष्ट्रीय डॉन को पकड़ते हैं जो खुद को डॉन कहता है।' },
            '612': { mr: 'एक सामान्य माणूस जो भ्रष्ट व्यवस्था सुधारण्यासाठी एका दिवसासाठी मुख्यमंत्री बनतो.', hi: 'एक आम आदमी जो भ्रष्ट व्यवस्था को सुधारने के लिए एक दिन के लिए मुख्यमंत्री बनता है।' },
            '613': { mr: 'एक पोलीस भ्रष्ट राजकारण्यांचा सामना करतो, आणि \'आता माझी सटकली\' म्हणतो.', hi: 'एक पुलिसवाला भ्रष्ट नेताओं का सामना करता है, और \'आता माझी सटकली\' कहता है।' },
            '614': { mr: 'फसवणूक झाल्यानंतर बदला घेणाऱ्या दोन भावांची कहाणी, अमिताभ आणि शशी कपूर.', hi: 'धोखा मिलने के बाद बदला लेने वाले भाइयों की कहानी, अमिताभ और शशि कपूर।' },
            '615': { mr: 'एक मूल ज्याची डिस्लेक्सियाची समस्या एक कला शिक्षक समजून घेतो आणि त्याचे आयुष्य बदलतो.', hi: 'एक बच्चा जिसकी डिस्लेक्सिया की स्थिति को एक कला शिक्षक समझता है और उसकी जिंदगी बदलता है।' },
            '616': { mr: 'दोन मित्र, वीरू आणि जय, रामगड गावात गब्बर सिंग नावाच्या एका डाकूशी लढतात.', hi: 'दो दोस्त, वीरू और जय, रामगढ़ गांव में गब्बर सिंह नाम के डाकू से लड़ते हैं।' },
            '617': { mr: 'एक श्रीमंत मुलगा आणि मध्यमवर्गीय मुलगी, प्रेम आणि निशा यांच्या लग्नात ट्विस्ट येतो.', hi: 'एक अमीर लड़का और मध्यमवर्गीय लड़की, प्रेम और निशा की शादी में एक ट्विस्ट आता है।' },
            '618': { mr: 'करण आणि अर्जुन या दोन भावांना त्यांच्या मागील मृत्यूबद्दल सूड घेण्यासाठी पुनर्जन्म मिळतो.', hi: 'दो भाई, करण और अर्जुन, दोनों को अपने पिछले जन्म की मौत का बदला लेने के लिए पुनर्जन्म मिलता है।' },
            '619': { mr: 'एक मुकी-बहिरी गावातील मुलगी पाकिस्तानात हरवते आणि बजरंगी तिला परत सोडण्यासाठी जातो.', hi: 'एक मूक-बधिर गांव की लड़की पाकिस्तान में खो जाती है और बजरंगी उसे वापस छोड़ने जाता है।' },

            // Maths (700 Series)
            '700': { mr: 'सोडवा: 18 ÷ 3 + 4 × (5 - 2)', hi: 'हल करें: 18 ÷ 3 + 4 × (5 - 2)' },
            '701': { mr: 'या क्रमानंतर कोणती संख्या येईल: 2, 3, 5, 7, 11?', hi: 'इस क्रम के बाद कौन सी संख्या आएगी: 2, 3, 5, 7, 11?' },
            '702': { mr: 'जर 2x - 4 = 10, तर x काय आहे?', hi: 'यदि 2x - 4 = 10, तो x क्या है?' },
            '703': { mr: '200 चे 15% किती आहे?', hi: '200 का 15% कितना है?' },
            '704': { mr: '9 ला 8 ने गुणल्यावर किती मिळते?', hi: '9 को 8 से गुणा करने पर क्या मिलता है?' },
            '705': { mr: 'जर त्रिकोणाचा पाया 10 आणि उंची 5 असेल, तर त्याचे क्षेत्रफळ किती?', hi: 'यदि एक त्रिभुज का आधार 10 और ऊंचाई 5 है, तो उसका क्षेत्रफल क्या है?' },
            '706': { mr: 'जर तुम्ही 40 ला एखादी वस्तू विकत घेतली आणि 60 ला विकली, तर किती टक्के नफा झाला?', hi: 'यदि आप एक वस्तु 40 में खरीदते हैं और 60 में बेचते हैं, तो लाभ का प्रतिशत क्या है?' },
            '707': { mr: 'सोडवा: 5 ^ 3 (5 चा घन)', hi: 'हल करें: 5 ^ 3 (5 का घन)' },
            '708': { mr: 'सोडवा: (10 + 20) x 2 - 10', hi: 'हल करें: (10 + 20) x 2 - 10' },
            '709': { mr: '144 चे वर्गमूळ काय आहे?', hi: '144 का वर्गमूल क्या है?' },
            '710': { mr: '0.75 ला अपूर्णांकात (उदा. 1/2) बदला.', hi: '0.75 को एक अंश/भिन्न (fraction) के रूप में लिखें (जैसे 1/2)।' },
            '711': { mr: 'वर्तुळात किती अंश असतात?', hi: 'एक पूर्ण चक्र (circle) में कितने डिग्री होते हैं?' },
            '712': { mr: 'पाय (pi) चे मूल्य काय आहे (दोन दशांश स्थळांपर्यंत)?', hi: 'पाइ (pi) का मान क्या है (दो दशमलव स्थानों तक)?' },
            '713': { mr: 'जर x + 5 = 12, तर 2x काय आहे?', hi: 'यदि x + 5 = 12, तो 2x क्या है?' },
            '714': { mr: '8 लांबी आणि 3 रुंदी असलेल्या आयताची परिमिती किती आहे?', hi: '8 लंबाई और 3 चौड़ाई वाले आयत की परिधि क्या है?' },
            '715': { mr: 'सोडवा: 100 / 4 + 15', hi: 'हल करें: 100 / 4 + 15' },
            '716': { mr: 'जर एक कार 60 किमी/तास वेगाने धावत असेल, तर ती 1.5 तासात किती अंतर पार करेल?', hi: 'यदि एक कार 60 किमी/घंटा की गति से चलती है, तो वस्तु 1.5 घंटों में कितनी दूर जाएगी?' },
            '717': { mr: '8 बाजू असलेल्या बहुभुजाला काय म्हणतात?', hi: '8 भुजाओं वाले बहुभुज को क्या कहा जाता है?' },
            '718': { mr: '7 फॅक्टोरिअल (7!) भागिले 6 फॅक्टोरिअल (6!) किती आहे?', hi: '7 फैक्टोरियल (7!) को 6 फैक्टोरियल (6!) से भाग देने पर क्या आता है?' },
            '719': { mr: 'सोडवा: 8 - 4 x 2 + 10', hi: 'हल करें: 8 - 4 x 2 + 10' }
        };

        scavengerQuestions.forEach(q => {
            if (translateDict[q.qrId]) {
                q.translations = translateDict[q.qrId];
            }
        });

        await Question.insertMany(scavengerQuestions);
        console.log("Station questions RE-SEEDED successfully with options!");
    } catch (error) {
        console.error("Seeding error:", error);
    }
};
