require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const app = express();
const cloudinary = require('cloudinary');
let _imgCache = new Map();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

app.use(cors());

app.get('/photos', (req, res) => {
  const tags = req.query.filters && req.query.filters.split(',');
  if (tags && tags.length) {
    const expression = tags.reduce((ex, tag, i) => {
      let newStr = i === 0 ? ' (' : ' OR ';
      newStr += `tags:${tag}`;
      if (i === tags.length - 1) {
        newStr += ')';
      }
      return ex + newStr;
    }, '');
    cloudinary.v2.search
      .expression(`resource_type:image AND folder:"2K Homecare/*" AND${expression}`)
      .execute()
      .then(result => {
        res.json(result);
      })
      .catch(err => res.sendStatus(500).json(err));
  } else {
    res.sendStatus(400).json({ error: 'No filters in query' })
  }
});

app.listen(port, () => console.log(`Hooked on ${port}`));