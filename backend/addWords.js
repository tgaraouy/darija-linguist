require('dotenv').config();
const mongoose = require('mongoose');
const Word = require('./src/models/Word'); // Make sure this path is correct

const words = [
  {
    darija: "عندي",
    phonetic: "3ndi",
    arabicScript: "عَنْدِيْ",
    msaEquivalent: "لدي",
    region: "Casablanca",
    usageDarija: ["عندي موعد مع الطبيب.", "عندي بزاف ديال الحوايج ندير اليوم.", "عندي غير شوية ديال الفلوس."],
    usageFrench: ["J'ai un rendez-vous chez le médecin.", "J'ai beaucoup de choses à faire aujourd'hui.", "Je n'ai qu'un peu d'argent."],
    usageEnglish: ["I have a doctor's appointment.", "I have a lot of things to do today.", "I only have a little money."]
  },
  {
    darija: "فين",
    phonetic: "fin",
    arabicScript: "فِيْنْ",
    msaEquivalent: "أين",
    region: "Rabat",
    usageDarija: ["فين غادي؟", "فين كاين السوق؟", "فين حطيت المفتاح ديالي؟"],
    usageFrench: ["Où vas-tu?", "Où se trouve le marché?", "Où ai-je mis ma clé?"],
    usageEnglish: ["Where are you going?", "Where is the market?", "Where did I put my key?"]
  },
  // Add more words here...
];

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  return Word.insertMany(words);
})
.then((result) => {
  console.log(`${result.length} words added successfully`);
  mongoose.connection.close();
})
.catch((err) => {
  console.error('Error:', err);
  mongoose.connection.close();
});