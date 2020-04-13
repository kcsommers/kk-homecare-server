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

const getBeforeAfter = (fetchAll, getTotal, offset) => {
  return new Promise((resolve, reject) => {
    if (fetchAll) {
      BeforeAfter
        .countDocuments()
        .exec()
        .then(total => {
          BeforeAfter
            .find()
            .exec()
            .then(images => resolve({ total, images, success: true }))
            .catch(err => reject({ error: err, success: false }))
        }).catch(err => reject({ error: err, success: false }))
    } else {
      if (getTotal) {
        BeforeAfter
          .countDocuments()
          .exec()
          .then(total => {
            BeforeAfter
              .find()
              .skip(offset)
              .limit(1)
              .exec()
              .then(images => resolve({ total, images, success: true }))
              .catch(err => reject({ error: err, success: false }))
          }).catch(err => reject({ error: err, success: false }))
      } else {
        BeforeAfter
          .find()
          .skip(offset)
          .limit(1)
          .exec()
          .then(images => resolve({ images, success: true }))
          .catch(err => reject({ error: err, success: false }))
      }
    }
  });
};

const getPhotos = (fetchAll, getTotal, lastId, limit) => {
  return new Promise((resolve, reject) => {
    if (fetchAll) {
      Image
        .countDocuments()
        .exec()
        .then(total => {
          Image
            .find()
            .exec()
            .then(images => resolve({ images, total, success: true }))
            .catch(err => reject({ error: err, success: false }))
        })
        .catch(err => reject(err))
    } else {
      const query = lastId ? { _id: { $gt: lastId } } : {};
      if (getTotal) {
        Image
          .countDocuments()
          .exec()
          .then(total => {
            Image
              .find(query)
              .limit(limit)
              .exec()
              .then(images => resolve({ total, images, success: true }))
              .catch(err => reject({ error: err, success: false }))
          })
          .catch(err => reject(err))
      } else {
        Image
          .find(query)
          .limit(limit)
          .exec()
          .then(images => resolve({ images, success: true }))
          .catch(err => reject({ error: err, success: false }))
      }
    }
  });
}

router.post('/', (req, res) => {
  const {
    limit,
    offset,
    lastId,
    getTotal,
    fetchAll,
    beforeAfter
  } = req.body;
  if (beforeAfter) {
    getBeforeAfter(fetchAll, getTotal, offset)
      .then(result => res.json(result))
      .catch(error => res.sendStatus(500).json(error))
  } else {
    getPhotos(fetchAll, getTotal, lastId, limit)
      .then(result => res.json(result))
      .catch(error => res.sendStatus(500).json(error))
  }
});

router.post('/before-after/upload', upload.array('photos', 2), (req, res) => {

  const uploadedImages = [];
  const upload = async () => {

    const uploadToCloudinary = (file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          file.path,
          { folder: '2K Homecare/before-after' },
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

    if (uploadedImages && uploadedImages.length === 2) {
      BeforeAfter.create({
        beforeUrl: uploadedImages[0].url,
        afterUrl: uploadedImages[1].url
      }, (error, result) => {
        if (error) {
          res.sendStatus(500).json({ success: null, error });
        } else {
          res.json({ success: true, error: null, images: uploadedImages });
        }
      })
    } else {
      res.sendStatus(500).json({ success: false, error: 'Something went wrong' })
    }

    console.log('UPLOADED', uploadedImages)
  };

  upload();

});

router.post('/upload', upload.array('photos', 12), (req, res) => {
  const { tag, beforeAfter } = req.query;

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