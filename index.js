require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const app = express();
const cloudinary = require('cloudinary');
const db = require('./database');
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
  const { filters, limit, offset, includeTotal } = req.body;
  if (filters && filters.length) {
    const fields = filters.map(tag => ({ tag }));
    console.log('Fields::: ', fields);
    const count = () => {
      return new Promise((resolve, reject) => {
        Image.count({ $or: fields }, (err, total) => {
          if (!err) {
            console.log('TOTLA:::: ', total)
            resolve(total);
          } else {
            reject(err);
          }
        });
      });
    }

    const find = (response, total) => {
      Image.find({ $or: fields }, (err, images) => {
        if (err) {
          response.sendStatus(500).json(err);
        } else {
          console.log('new photos offset', offset)
          response.json({ images, total });
        }
      }).skip(offset).limit(limit);
    }

    if (includeTotal) {
      count()
        .then(total => find(res, total))
        .catch(err => res.sendStatus(500).json(err))
    } else {
      find(res);
    }

    // const expression = tags.reduce((ex, tag, i) => {
    //   let newStr = i === 0 ? ' (' : ' OR ';
    //   newStr += `tags:${tag}`;
    //   if (i === tags.length - 1) {
    //     newStr += ')';
    //   }
    //   return ex + newStr;
    // }, '');
    // cloudinary.v2.search
    //   .expression(`resource_type:image AND folder:"2K Homecare/*" AND${expression}`)
    //   .execute()
    //   .then(result => {
    //     const imgMap = {};
    //     if (result && result.resources) {
    //       result.resources.forEach(img => {
    //         const filter = parseFolder(img.folder);

    //         if (imgMap[filter]) {
    //           imgMap[filter].push(img.url);
    //         } else {
    //           imgMap[filter] = [img.url];
    //         }
    //       });
    //     }
    //     res.json(imgMap);
    //   })
    //   .catch(err => res.sendStatus(500).json(err));
  } else {
    res.sendStatus(400).json({ error: 'No filters in query' })
  }
});

app.listen(port, () => console.log(`Hooked on ${port}`));