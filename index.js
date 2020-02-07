require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const app = express();
const axios = require('axios');
const cloudinaryUrl = `https://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_SECRET}@api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}`;
const headers = {
  'Authorization': `Bearer ${process.env.SMARTSHEET_TOKEN}`,
  'Content-Type': 'application/json'
};

app.use(cors());

app.get('/photos/:folder', (req, res) => {
  axios.get(`${cloudinaryUrl}/folders`, { headers })
    .then(response => {
      console.log('Response:::: ', response);
      res.json(response.data);
    })
    .catch(e => {
      console.error('Error in photos route:::: ', e);
      res.sendStatus(500);
    });
});

app.listen(port, () => console.log(`Hooked on ${port}`));