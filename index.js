require('dotenv').config();
require('./database');
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const app = express();
const Image = require('./models/image.model');
const BeforeAfter = require('./models/before-after.model');
const bp = require('body-parser');

const parseFolder = folder => {
  // 2K Homecare/painting
  const segments = folder.split('/');
  return segments[segments.length - 1];
};

app.use(cors());
app.use(bp.json());

app.post('/photos', (req, res) => {
  const { limit, lastId, getTotal, fetchAll } = req.body;
  const handleResponse = (error, images) => {
    if (error) {
      res.sendStatus(500).json({ error });
    } else {
      res.json({ images });
    }
  }
  const fetchImages = () => {
    if (fetchAll) {
      return Image.find();
    }
    if (lastId) {
      return Image.find({ _id: { $gt: lastId } }).limit(limit);
    } else {
      return Image.find().limit(limit);
    }
  }
  if (getTotal) {
    Image.countDocuments().exec().then((total) => {
      fetchImages().exec(handleResponse)
    });
  } else {
    fetchImages().exec(handleResponse);
  }
});

app.post('/before-after', (req, res) => {
  const { offset } = req.body;
  BeforeAfter.find()
    .skip(offset)
    .limit(1)
    .exec()
    .then(images => res.json({ images }))
    .catch(error => res.sendStatus(500).json({ error }))
});

app.listen(port, () => console.log(`Hooked on ${port}`));