const router = require('express').Router();
const Image = require('../models/image.model');
const BeforeAfter = require('../models/before-after.model');

router.post('/', (req, res) => {
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

router.post('/before-after', (req, res) => {
  const { offset } = req.body;
  BeforeAfter.find()
    .skip(offset)
    .limit(1)
    .exec()
    .then(images => res.json({ images }))
    .catch(error => res.sendStatus(500).json({ error }))
});

module.exports = router;