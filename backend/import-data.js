const { MongoClient } = require('mongodb');
const fs = require('fs');

const url = 'mongodb://localhost:27017';
const dbName = 'darija_linguist';

async function importData() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection('words');

    // Read the JSON file
    const data = JSON.parse(fs.readFileSync('words.json', 'utf8'));

    // Insert the data into MongoDB
    const result = await collection.insertMany(data.words);

    console.log(`${result.insertedCount} documents were inserted`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

importData();