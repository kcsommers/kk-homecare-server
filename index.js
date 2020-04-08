require('dotenv').config();
require('./database');
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const app = express();
const bp = require('body-parser');

const parseFolder = folder => {
  // 2K Homecare/painting
  const segments = folder.split('/');
  return segments[segments.length - 1];
};

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use('/photos', require('./controllers/photos.router'));
app.use('/admin', require('./controllers/admin.router'));
app.use('/admin/invoices', require('./controllers/invoices.router'));
app.use('/admin/messages', require('./controllers/messages.router'));

app.listen(port, () => console.log(`Hooked on ${port}`));

// const fuck = () => {
  // BeforeAfter.insertMany([
  //   {
  //     beforeUrl: 'https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  //     afterUrl: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823__340.jpg'
  //   },
  //   {
  //     beforeUrl: 'https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  //     afterUrl: 'https://cdn.pixabay.com/photo/2013/07/21/13/00/rose-165819__340.jpg'
  //   },
  //   {
  //     beforeUrl: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  //     afterUrl: 'https://s.ftcdn.net/v2013/pics/all/curated/RKyaEDwp8J7JKeZWQPuOVWvkUjGQfpCx_cover_580.jpg?r=1a0fc22192d0c808b8bb2b9bcfbf4a45b1793687'
  //   },
  //   {
  //     beforeUrl: 'https://www.bigstockphoto.com/images/homepage/module-6.jpg',
  //     afterUrl: 'https://cdn.cnn.com/cnnnext/dam/assets/191203174105-edward-whitaker-1-large-169.jpg'
  //   },
  //   {
  //     beforeUrl: 'https://images.unsplash.com/photo-1521033719794-41049d18b8d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
  //     afterUrl: 'https://www.freedigitalphotos.net/images/img/homepage/394230.jpg'
  //   }
  // ])
// };

// fuck();