const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit-form', (req, res) => {
  const { nom, prenom, email, recherche } = req.body;
  const newData = { nom, prenom, email, recherche };
  axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: recherche }],
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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',
    },
  })
  .then(response => {
    const chatGptResponse = response.data.choices[0].message.content;
    console.log('Réponse de ChatGPT:', chatGptResponse);
    newData.chatGptResponse = chatGptResponse;
    const jsonData = JSON.stringify(newData, null, 2);
    fs.writeFile('data.json', jsonData, (err) => {
      if (err) throw err;
      console.log('Données enregistrées dans data.json');
      res.send(chatGptResponse);
    });
  })
  .catch(error => {
    console.error('Erreur lors de la requête à l\'API de ChatGPT:', error);
    res.status(500).send('Erreur lors de la communication avec ChatGPT');
  });
});

app.listen(port, () => {
  console.log('Serveur écoutant sur le port', port);
});
