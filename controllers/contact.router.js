const router = require('express').Router();

router.post('/', (req, res) => {
  const { data } = req.body;
  console.log(data);
});

module.exports = router;