const router = require('express').Router();
const Message = require('../models/message.model');

router.post('/', (req, res) => {
  const { name, email, message, phone, jobType } = req.body;
  Message.create({
    name,
    email,
    phone,
    message,
    jobType,
    date: new Date(),
    replied: false
  }, (error, result) => {
    if (error) {
      res.sendStatus(500).json({ success: null, error });
    } else {
      res.json({ success: true, error: null });
    }
  })
});

module.exports = router;