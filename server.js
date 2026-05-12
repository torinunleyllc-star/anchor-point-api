const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

app.post('/analyze', async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('Key exists:', !!apiKey, 'Key prefix:', apiKey ? apiKey.substring(0, 20) : 'none');
    console.log('Request messages count:', req.body.messages ? req.body.messages.length : 0);
    console.log('Request body size:', JSON.stringify(req.body).length);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    console.log('API status:', response.status);
    console.log('API response (first 500 chars):', text.substring(0, 500));
    
    res.setHeader('Content-Type', 'application/json');
    res.send(text);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
