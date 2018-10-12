var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LinkedIn profile extractor' });
});

router.post('/', function (req, res) {
    res.send({
        data : req.body
    });
});

module.exports = router;
