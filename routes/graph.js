var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('graph', { title: 'Ego Network' });
});

router.get('/data', function (req, res, next) {
  data = { id: "Hello"}
  res.send(data);
});

router.get('/graph', function (req, res, next) {
  res.render('graph', { title: 'Ego Network' });
});

module.exports = router;
