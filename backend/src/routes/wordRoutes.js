const express = require('express');
const Word = require('../models/Word');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const words = await Word.find();
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const word = new Word(req.body);
  try {
    const newWord = await word.save();
    res.status(201).json(newWord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;