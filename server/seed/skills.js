
let outputSkills = []; //[{name: ""} ... ]
function append(array){
    array.forEach(string => outputSkills.push({name: string}));
}

//specific to me
append([
    "ketogenic diet",
    "aeron chairs",
    "dell xps 15",
    "matniz venus egpu"
]);

//music
append([
    "piano",
    "trumpet",
    "trombone"
]);

//lifestyle
append([
    "composting",
    "sewing",
    "laundry",
    "vaccuum",
    "letter writing",
    "personal finance",
    "couponing",
    "organizing",
    "clip booking",
    "homeowners association",
    "insurance",
    "ironing",
    "cooking",
    "slowcooker",
    "sous vide",
    "baking",
    "cupcakes",
    "gardening",
    "vegetable garden",

    "home automation",
    "irrigation system",
    "dog fence",
    "dogs",
    "dog training",

    "fridge repair",
])

//professional
append([
    "apache",
    "javascript",
    "php",
    "c++",
    "c#",
    "go (programming)",
    "sql",
    "mongoDB",
    "postgresql",
    "react",
    "angularjs",
    "react-native",
    "android",
    "iOS",
    "docker (programming)",
    "kubernetes",
    "macintosh",
    "iPhone",
    "Samsung",
    "nodejs",
    "npm",
    "tomcat",
    "apache struts",
    "mysql",
    "mariaDB",
    "ES6",
    "webpack",
    "gulpjs",
    "gruntjs",
    "nosql",
    "webstorm",
    "java",
    "intel",
    "amd",
    "SAP",
    "amazon web services",
    "git",
    "svn",
    "bash",
    "ubuntu",
    "linux",
    "scrum",

    "cardiology",
    "neurology",
    "CT machine",
    "HIPA",
    "stock options",
    "401k",
    "ROTH IRA",
    "index funds",
    "systems administration",

    "excel",
    "microsoft word",
    "google sheets",
    "powerpoint",

    "adobe illustrator",
    "adobe photoshop",
    "adobe indesign",
    "adobe premiere",

    "cv joint",
    "clutch replacement",
    "brake repair",
    "driveshaft repair",
    "strut replacement",
    "car bearing",
    "muffler",
])

//school
append([
    "math",
    "geometry",
    "algebra",
    "trigonometry",
    "calculus",
    "probability",
    "combinatorics",
    "differential equations",
    "linear algebra",
    "optimization (math)",

    "physics",
    "orbital mechanics",
    "statics",

    "science",
    "chemistry",
    "mass spectography",
    "biology",
    "organic chemistry",
    "anatomy & physiology",
    "microbiology",

    "philosophy",
    "ethics",
    "essay writing",
    "college application",
    "SAT",
    "common application",
    "Ivy League",

    "history",
    "american history",
    "european history",

    "economics",
    "accounting",
    "finance",
    "managerial finance",
    "actuarial science",
])

//sports
append([
    "airsoft",
    "aerobatics",
    "glider",
    "hang gliding",
    "parachuting",
    "wingsuit",
    "paragliding",
    "ultralight aviation",
    "archery",
    "badminton",
    "biribol",
    "bossaball",
    "table tennis",
    "tennis",
    "volleyball",
    "basketball",
    "baseball",
    "softball",
    "cricket",
    "kickball",
    "ballet",
    "dancing",
    "cheerleading",
    "gymnastics",
    "skateboarding",
    "scootering",
    "skydiving",
    "snowboarding",
    "surfing",
    "wakeboarding",
    "paddleboarding",
    "dodgeball",
    "climbing",
    "ice climbing",
    "rock climbing",
    "bouldering",
    "hiking",
    "lead climbing",
    "mountain biking",
    "track cycling",
    "downhill biking",
    "unicycle",
    "judo",
    "sumo",
    "wrestling",
    "boxing",
    "muay thai",
    "karate",
    "shaolin",
    "taekwondo",
    "winch chun",
    "billiards",
    "snooker",
    "dressage",
    "rodeo",
    "polo",
    "disc golf",
    "rugby",
    "golf",
    "juggling",
    "trapeze",
    "handball",
    "hockey",
    "figure skating",
    "triathlon",
    "biathlon",
    "pentathlon",
    "decathlon",
    "geocaching",
    "badminton",
    "racquetball",
    "tennis",
    "running",
    "marathon",
    "sailing",
    "alpine skiing",
    "speed skating",
    "lacrosse",
    "water polo",
    "parkour",
])

// let languages = [
//     {
//         "name": "Afar"
//     },
//     {
//         "name": "Abkhaz"
//     },
//     {
//         "name": "Avestan"
//     },
//     {
//         "name": "Afrikaans"
//     },
//     {
//         "name": "Akan"
//     },
//     {
//         "name": "Amharic"
//     },
//     {
//         "name": "Aragonese"
//     },
//     {
//         "name": "Arabic"
//     },
//     {
//         "name": "Assamese"
//     },
//     {
//         "name": "Avaric"
//     },
//     {
//         "name": "Aymara"
//     },
//     {
//         "name": "Azerbaijani"
//     },
//     {
//         "name": "South Azerbaijani"
//     },
//     {
//         "name": "Bashkir"
//     },
//     {
//         "name": "Belarusian"
//     },
//     {
//         "name": "Bulgarian"
//     },
//     {
//         "name": "Bihari"
//     },
//     {
//         "name": "Bislama"
//     },
//     {
//         "name": "Bambara"
//     },
//     {
//         "name": "Bengali; Bangla"
//     },
//     {
//         "name": "Tibetan Standard, Tibetan, Central"
//     },
//     {
//         "name": "Breton"
//     },
//     {
//         "name": "Bosnian"
//     },
//     {
//         "name": "Catalan; Valencian"
//     },
//     {
//         "name": "Chechen"
//     },
//     {
//         "name": "Chamorro"
//     },
//     {
//         "name": "Corsican"
//     },
//     {
//         "name": "Cree"
//     },
//     {
//         "name": "Czech"
//     },
//     {
//         "name": "Old Church Slavonic, Church Slavonic, Old Bulgarian"
//     },
//     {
//         "name": "Chuvash"
//     },
//     {
//         "name": "Welsh"
//     },
//     {
//         "name": "Danish"
//     },
//     {
//         "name": "German"
//     },
//     {
//         "name": "Divehi; Dhivehi; Maldivian;"
//     },
//     {
//         "name": "Dzongkha"
//     },
//     {
//         "name": "Ewe"
//     },
//     {
//         "name": "Greek, Modern"
//     },
//     {
//         "name": "English"
//     },
//     {
//         "name": "Esperanto"
//     },
//     {
//         "name": "Spanish; Castilian"
//     },
//     {
//         "name": "Estonian"
//     },
//     {
//         "name": "Basque"
//     },
//     {
//         "name": "Persian (Farsi)"
//     },
//     {
//         "name": "Fula; Fulah; Pulaar; Pular"
//     },
//     {
//         "name": "Finnish"
//     },
//     {
//         "name": "Fijian"
//     },
//     {
//         "name": "Faroese"
//     },
//     {
//         "name": "French"
//     },
//     {
//         "name": "Western Frisian"
//     },
//     {
//         "name": "Irish"
//     },
//     {
//         "name": "Scottish Gaelic; Gaelic"
//     },
//     {
//         "name": "Galician"
//     },
//     {
//         "name": "Guaraní"
//     },
//     {
//         "name": "Gujarati"
//     },
//     {
//         "name": "Manx"
//     },
//     {
//         "name": "Hausa"
//     },
//     {
//         "name": "Hebrew (modern)"
//     },
//     {
//         "name": "Hindi"
//     },
//     {
//         "name": "Hiri Motu"
//     },
//     {
//         "name": "Croatian"
//     },
//     {
//         "name": "Haitian; Haitian Creole"
//     },
//     {
//         "name": "Hungarian"
//     },
//     {
//         "name": "Armenian"
//     },
//     {
//         "name": "Herero"
//     },
//     {
//         "name": "Interlingua"
//     },
//     {
//         "name": "Indonesian"
//     },
//     {
//         "name": "Interlingue"
//     },
//     {
//         "name": "Igbo"
//     },
//     {
//         "name": "Nuosu"
//     },
//     {
//         "name": "Inupiaq"
//     },
//     {
//         "name": "Ido"
//     },
//     {
//         "name": "Icelandic"
//     },
//     {
//         "name": "Italian"
//     },
//     {
//         "name": "Inuktitut"
//     },
//     {
//         "name": "Japanese"
//     },
//     {
//         "name": "Javanese"
//     },
//     {
//         "name": "Georgian"
//     },
//     {
//         "name": "Kongo"
//     },
//     {
//         "name": "Kikuyu, Gikuyu"
//     },
//     {
//         "name": "Kwanyama, Kuanyama"
//     },
//     {
//         "name": "Kazakh"
//     },
//     {
//         "name": "Kalaallisut, Greenlandic"
//     },
//     {
//         "name": "Khmer"
//     },
//     {
//         "name": "Kannada"
//     },
//     {
//         "name": "Korean"
//     },
//     {
//         "name": "Kanuri"
//     },
//     {
//         "name": "Kashmiri"
//     },
//     {
//         "name": "Kurdish"
//     },
//     {
//         "name": "Komi"
//     },
//     {
//         "name": "Cornish"
//     },
//     {
//         "name": "Kyrgyz"
//     },
//     {
//         "name": "Latin"
//     },
//     {
//         "name": "Luxembourgish, Letzeburgesch"
//     },
//     {
//         "name": "Ganda"
//     },
//     {
//         "name": "Limburgish, Limburgan, Limburger"
//     },
//     {
//         "name": "Lingala"
//     },
//     {
//         "name": "Lao"
//     },
//     {
//         "name": "Lithuanian"
//     },
//     {
//         "name": "Luba-Katanga"
//     },
//     {
//         "name": "Latvian"
//     },
//     {
//         "name": "Malagasy"
//     },
//     {
//         "name": "Marshallese"
//     },
//     {
//         "name": "Māori"
//     },
//     {
//         "name": "Macedonian"
//     },
//     {
//         "name": "Malayalam"
//     },
//     {
//         "name": "Mongolian"
//     },
//     {
//         "name": "Marathi (Marāṭhī)"
//     },
//     {
//         "name": "Malay"
//     },
//     {
//         "name": "Maltese"
//     },
//     {
//         "name": "Burmese"
//     },
//     {
//         "name": "Nauru"
//     },
//     {
//         "name": "Norwegian Bokmål"
//     },
//     {
//         "name": "North Ndebele"
//     },
//     {
//         "name": "Nepali"
//     },
//     {
//         "name": "Ndonga"
//     },
//     {
//         "name": "Dutch"
//     },
//     {
//         "name": "Norwegian Nynorsk"
//     },
//     {
//         "name": "Norwegian"
//     },
//     {
//         "name": "South Ndebele"
//     },
//     {
//         "name": "Navajo, Navaho"
//     },
//     {
//         "name": "Chichewa; Chewa; Nyanja"
//     },
//     {
//         "name": "Occitan"
//     },
//     {
//         "name": "Ojibwe, Ojibwa"
//     },
//     {
//         "name": "Oromo"
//     },
//     {
//         "name": "Oriya"
//     },
//     {
//         "name": "Ossetian, Ossetic"
//     },
//     {
//         "name": "Panjabi, Punjabi"
//     },
//     {
//         "name": "Pāli"
//     },
//     {
//         "name": "Polish"
//     },
//     {
//         "name": "Pashto, Pushto"
//     },
//     {
//         "name": "Portuguese"
//     },
//     {
//         "name": "Quechua"
//     },
//     {
//         "name": "Romansh"
//     },
//     {
//         "name": "Kirundi"
//     },
//     {
//         "name": "Romanian"
//     },
//     {
//         "name": "Russian"
//     },
//     {
//         "name": "Kinyarwanda"
//     },
//     {
//         "name": "Sanskrit (Saṁskṛta)"
//     },
//     {
//         "name": "Sardinian"
//     },
//     {
//         "name": "Sindhi"
//     },
//     {
//         "name": "Northern Sami"
//     },
//     {
//         "name": "Sango"
//     },
//     {
//         "name": "Sinhala, Sinhalese"
//     },
//     {
//         "name": "Slovak"
//     },
//     {
//         "name": "Slovene"
//     },
//     {
//         "name": "Samoan"
//     },
//     {
//         "name": "Shona"
//     },
//     {
//         "name": "Somali"
//     },
//     {
//         "name": "Albanian"
//     },
//     {
//         "name": "Serbian"
//     },
//     {
//         "name": "Swati"
//     },
//     {
//         "name": "Southern Sotho"
//     },
//     {
//         "name": "Sundanese"
//     },
//     {
//         "name": "Swedish"
//     },
//     {
//         "name": "Swahili"
//     },
//     {
//         "name": "Tamil"
//     },
//     {
//         "name": "Telugu"
//     },
//     {
//         "name": "Tajik"
//     },
//     {
//         "name": "Thai"
//     },
//     {
//         "name": "Tigrinya"
//     },
//     {
//         "name": "Turkmen"
//     },
//     {
//         "name": "Tagalog"
//     },
//     {
//         "name": "Tswana"
//     },
//     {
//         "name": "Tonga (Tonga Islands)"
//     },
//     {
//         "name": "Turkish"
//     },
//     {
//         "name": "Tsonga"
//     },
//     {
//         "name": "Tatar"
//     },
//     {
//         "name": "Twi"
//     },
//     {
//         "name": "Tahitian"
//     },
//     {
//         "name": "Uyghur, Uighur"
//     },
//     {
//         "name": "Ukrainian"
//     },
//     {
//         "name": "Urdu"
//     },
//     {
//         "name": "Uzbek"
//     },
//     {
//         "name": "Venda"
//     },
//     {
//         "name": "Vietnamese"
//     },
//     {
//         "name": "Volapük"
//     },
//     {
//         "name": "Walloon"
//     },
//     {
//         "name": "Wolof"
//     },
//     {
//         "name": "Xhosa"
//     },
//     {
//         "name": "Yiddish"
//     },
//     {
//         "name": "Yoruba"
//     },
//     {
//         "name": "Zhuang, Chuang"
//     },
//     {
//         "name": "Chinese"
//     },
//     {
//         "name": "Zulu"
//     }
// ];

module.exports = outputSkills;