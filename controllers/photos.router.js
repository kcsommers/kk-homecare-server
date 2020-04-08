require('dotenv').config();
const router = require('express').Router();
const Image = require('../models/image.model');
const BeforeAfter = require('../models/before-after.model');
const cloudinary = require('cloudinary').v2;
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

router.post('/', (req, res) => {
  const { limit, lastId, getTotal, fetchAll } = req.body;
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
      fetchImages()
        .exec()
        .then(images => res.json({ images, total }))
        .catch(error => res.json({ error }))
    });
  } else {
    fetchImages()
      .exec()
      .then(images => res.json({ images }))
      .catch(error => res.json({ error }))
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

router.post('/upload', upload.array('photos', 12), (req, res) => {
  const { tag } = req.query;

  console.log('TAG:::: ', tag);

  const uploadedImages = [];
  const upload = async () => {

    const uploadToCloudinary = (file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          file.path,
          { tags: [tag], folder: `2K Homecare/${tag}` },
          (err, res) => {
            if (err) {
              return reject(err);
            }
            resolve(res);
          });
      });
    };

    for (let i = 0; i < req.files.length; i++) {
      const result = await uploadToCloudinary(req.files[i]);
      uploadedImages.push(result);
      console.log('RESULT', result);
    }

    console.log('UPLOADED', uploadedImages)
  };

  upload();

});

module.exports = router;