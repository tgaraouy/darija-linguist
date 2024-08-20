const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'darija_linguist';

let db;

async function connectToDatabase() {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log("Connected successfully to database");
    db = client.db(dbName);
    
    // Test query
    const testDoc = await db.collection('words').findOne({});
    console.log('Test query result:', testDoc ? 'Successfully retrieved a document' : 'No documents found');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/api/words') {
    try {
      const words = await db.collection('words').find({}).toArray();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(words));
    } catch (error) {
      console.error('Error fetching words:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Server error: ' + error.message }));
    }
  } else if (req.method === 'POST' && req.url.startsWith('/api/words/') && req.url.endsWith('/phonetic-suggestion')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const wordId = req.url.split('/')[3];
        const { suggestedPhonetic, audioUrl } = JSON.parse(body);

        console.log('Received suggestion:', { wordId, suggestedPhonetic, audioUrl });

        if (!ObjectId.isValid(wordId)) {
          throw new Error('Invalid word ID');
        }

        const result = await db.collection('words').updateOne(
          { _id: new ObjectId(wordId) },
          { 
            $push: { 
              phoneticSuggestions: {
                phonetic: suggestedPhonetic,
                audioUrl: audioUrl
              } 
            } 
          }
        );

        console.log('Update result:', result);

        if (result.matchedCount === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Word not found' }));
        } else if (result.modifiedCount === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'No changes were made' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Suggestion added successfully' }));
        }
      } catch (error) {
        console.error('Error adding phonetic suggestion:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error: ' + error.message }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

const PORT = 5000;

connectToDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(console.error);