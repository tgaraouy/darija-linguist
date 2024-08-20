const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  darija: String,
  phonetic: String,
  arabicScript: String,
  msaEquivalent: String,
  region: String,
  usageDarija: [String],
  usageFrench: [String],
  usageEnglish: [String],
});

module.exports = mongoose.model('Word', wordSchema);