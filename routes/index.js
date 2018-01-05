var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.cookies.userCode) {
    res.redirect('/users')
  }
  else {
    res.render('index', {message: "Sign In Below"})
  }
})

router.post('/', function(req, res, next) {
  res.send("hi")
})
module.exports = router;
