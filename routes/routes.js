var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET restaurant selection page*/
router.get('/restaurants', function(req, res) {
  var email = req.query.email;
  var restNames = Restaurant
    .find({})
    .sort('name')
    .select('name');

  restNames.exec(function(err, names) {
    if (!err) {
      var restNames = names.map(function(name) {
        return name.name;
      })
      var templateNames = JSON.stringify(names);
      res.render('restaurant_index', {names: restNames, templateNames: templateNames});
    } else {
      // render an error
      res.render('error');
    }
  })
  
})

module.exports = router;
