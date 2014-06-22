var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');
var _ = require('../public/javascripts/lodash.underscore.min.js')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('landing_page', { title: 'Express' });
});

/* "Sign In" (no persistent users) by setting email address in cookies*/
router.post('/signin', function(req, res) {
  res.cookie('email', req.body.email, { maxAge: 900000 });

  res.redirect('/restaurants');
});

/* GET restaurant index / selection page */
router.get('/restaurants', function(req, res) {
  var restNamesQuery = Restaurant
    .find({})
    .sort('name')
    .select('name');

  restNamesQuery.exec(function(err, names) {
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
});

/* Restaurant show page */
router.get('/restaurants/:id', function(req, res) {
  var restaurantQuery = Restaurant.find({_id: req.params.id})

  restaurantQuery.exec(function(err, restaurantData) {
    var restaurantData = restaurantData[0]
    if (!err) {
      console.log(restaurantData);
      console.log(restaurantData.ratings);
      var userEmail = req.cookies.email;
      var userHasRated = _.any(restaurantData.ratings.overall.emails, function(emailObj) {
        return emailObj.email === userEmail;
      });

      res.render('restaurant_show', { 
        restaurantJSON: JSON.stringify(restaurantData),
        name: restaurantData.name,
        avgScore: restaurantData.ratings.overall.avgScore || "Not Rated",
        numRatings: restaurantData.ratings.overall.numRatings || "0",
        userHasRated: userHasRated
      });

    } else {
      res.render('error');
    }
  });
});

router.post('/restaurants/new', function(req, res) {
  var restaurantName = req.body.restaurant_name;
  restaurantName = restaurantName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  restaurant = new Restaurant({name: restaurantName});
  restaurant.save(function(err, restaurant) {
    if (err) {
      res.redirect('/restaurants');
    } else {
      res.redirect('/restaurants/' + restaurant._id);
    }
  });

});


module.exports = router;
