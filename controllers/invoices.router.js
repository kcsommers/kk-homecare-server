const router = require('express').Router();
const Invoice = require('../models/invoice.model');

router.get('/overdue', (req, res) => {
  console.log('REQ', req.query);
  const { offset } = req.query;
  Invoice.find(
    {
      paid: false,
      dueDate: { $gt: new Date.now() }
    }
  )
    .exec()
    .then(result => {
      console.log('RESULT', result)
    }).catch(err => {

    });
});

router.post('/create', (req, res) => {
  const { client, total, items, dueDate } = req.body.invoice;
  Invoice.create({
    client,
    total,
    items,
    dueDate,
    sent: false,
    paid: false,
    datePaid: null,
    dateSent: null
  }, (error, result) => {
    if (error) {
      return res.status(500).json({ success: false, error });
    }
    return res.status(200).json({ success: true, error: null });
  });
});

module.exports = router;