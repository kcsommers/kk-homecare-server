const router = require('express').Router();
const Message = require('../models/message.model');

router.get('/', (req, res) => {
  Message
    .countDocuments()
    .exec()
    .then(total => {
      Message
        .find()
        .exec()
        .then(messages => {
          res.status(200).json({ success: true, data: { messages, total } })
        })
        .catch(error => {
          res.status(500).json({ success: false, error });
        });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err });
    });

});

router.post('/', (req, res) => {
  const { name, email, message, phone, jobType } = req.body;
  Message.create({
    client: { name, email, phone },
    message,
    jobType,
    date: new Date(),
    seen: false
  }, (error, result) => {
    if (error) {
      res.sendStatus(500).json({ success: null, error });
    } else {
      res.json({ success: true, error: null });
    }
  })
});

router.put('/:id', (req, res) => {
  Message.updateOne(
    { _id: req.params.id },
    { seen: true }
  )
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({ success: true })
    })
    .catch(
      error => res.status(500).json({ success: false, error })
    )
});

router.delete('/:id', (req, res) => {
  Message
    .deleteOne({ _id: req.params.id })
    .exec()
    .then(result => res.status(200).json({ success: true }))
    .catch(error => {
      console.log(error)
      res.status(500).json({ success: false, error })
    })
});

module.exports = router;
