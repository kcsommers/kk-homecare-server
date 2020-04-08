const router = require('express').Router();
const Invoice = require('../models/invoice.model');
const moment = require('moment');
const url = require('url');

router.get('/', (req, res) => {
  const { lastId, q, filter } = req.query;

  let redirect = '';
  if (q) {
    redirect += `?q=${q}`;
  }
  if (filter) {
    redirect += (redirect ? '&' : '?') + `filter=${filter}`;
  }
  if (redirect) {
    return res.redirect(`invoices/search${redirect}`);
  }

  const handleResponse = (total, error, invoices) => {
    if (error) {
      return res.status(500).json({ error, success: false });
    }
    res.status(200).json({ success: true, error: null, data: { invoices, total } })
  };

  const fetch = () => {
    return (lastId && lastId !== 'undefined') ?
      Invoice.find({ _id: { $gt: lastId } }) :
      Invoice.find();
  };

  Invoice
    .countDocuments()
    .exec()
    .then(total => {
      fetch()
        .limit(10)
        .exec(handleResponse.bind(this, total))
    })
    .catch(error => {
      res.status(500).json({ error, success: false });
    });
});

router.get('/search', (req, res) => {
  const { q, filter } = req.query;
  let dbFilter = nameSearch = {};
  if (filter === 'past-due') {
    dbFilter.dueDate = { $lt: Date.now() };
  }
  if (filter === 'paid') {
    dbFilter.paid = true;
  }
  if (filter === 'not-sent') {
    dbFilter.sent = false;
  }
  if (q) {
    nameSearch['client.name'] = new RegExp(q, 'i');
  }
  Invoice.find(Object.assign(nameSearch, dbFilter))
    .exec()
    .then(invoices => {
      res.status(200).json({ success: true, data: { invoices } })
    })
    .catch(error => {
      res.status(500).json({ error, success: false });
    })
});

router.get('/:id', (req, res) => {
  Invoice.find({ _id: req.params.id })
    .exec()
    .then(invoice => {
      return res.status(200).json({ success: true, error: null, data: { invoices: invoice } });
    })
    .catch(error => {
      res.status(500).json({ success: false, error });
    })
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
    return res.status(200).json({ success: true, error: null, data: { invoices: [result] } });
  });
});

module.exports = router;