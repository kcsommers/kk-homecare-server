require('dotenv').config();
require('./database');
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const app = express();
const cloudinary = require('cloudinary');
const Image = require('./models/image.model');
const bp = require('body-parser');

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET
// });

const parseFolder = folder => {
  // 2K Homecare/painting
  const segments = folder.split('/');
  return segments[segments.length - 1];
}

app.use(cors());
app.use(bp.json());

app.post('/photos', (req, res) => {
  console.log('Hit photos route');
  const { filters, limit, offsets } = req.body;
  if (filters && filters.length) {
    const fields = filters.map(tag => ({ tag }));
  } else {
    res.sendStatus(400).json({ error: 'No filters in query' })
  }
});

app.listen(port, () => console.log(`Hooked on ${port}`));