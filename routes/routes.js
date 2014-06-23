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
      var userEmail = req.cookies.email;
      var userHasRated = hasUserRatedYet(restaurantData, userEmail);
      // var startingOverallRating = userHasRated ? findUserRating(restaurantData, "overall", userEmail) * 10 : 25;

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
  restaurant = new Restaurant({
    name: restaurantName,
    ratings: {
      overall: {
        numRatings: 0,
        avgScore: 0,
        emails: []
      }
    }});
  restaurant.save(function(err, restaurant) {
    if (err) {
      res.redirect('/restaurants');
    } else {
      res.redirect('/restaurants/' + restaurant._id);
    }
  });
});

router.post('/restaurants/:id/ratings', function(req, res) {
  var overallRating = req.body.overallRating,
      userEmail = req.cookies.email;

  var restaurantQuery = Restaurant.findById(req.params.id)

  restaurantQuery.exec(function(err, restaurant) {
    userHasRated = hasUserRatedYet(restaurant, userEmail);
    var oldOverallAvgScore = restaurant.ratings.overall.avgScore || 0,
        oldOverallNumRatings = restaurant.ratings.overall.numRatings || 0;

    if (userHasRated) {
      var oldOverallRating = findUserRating(restaurant, "overall", userEmail);
      setUserRatings(restaurant, userEmail, overallRating);

      var totalScore = oldOverallAvgScore * oldOverallNumRatings;
      var totalScore = totalScore - oldOverallRating + overallRating;
      restaurant.ratings.overall.avgScore = totalScore / oldOverallNumRatings;

    } else {
      restaurant.ratings.overall.numRatings = (restaurant.ratings.overall.numRatings || 0) + 1;
      restaurant.ratings.overall.avgScore = (oldOverallAvgScore + overallRating) / (oldOverallNumRatings + 1);
      restaurant.ratings.overall.emails.push({ "email": userEmail, "rating": overallRating});
    }

    restaurant.save(function(err, restaurant) {
      if (!err) {
        res.json(restaurant);
      } else {
        console.log(err);
        res.status(500);
        res.send();
      }
    })
  });
})

function hasUserRatedYet(restaurant, userEmail) {
  return _.any(restaurant.ratings.overall.emails, function(emailObj) {
    return emailObj.email === userEmail;
  });
}

/* Note - use _.find to short circuit search, cutting off when value is found */
function findUserRating(restaurant, ratingType, userEmail) {
  var rating;
  _.find(restaurant["ratings"][ratingType]["emails"], function(emailObj) {
    if (emailObj.email === userEmail) {
      rating = emailObj.score;
      return true;
    }
    return false;
  });

  return rating;
}

function setUserRatings(restaurant, userEmail, userScore) {
  _.find(restaurant.ratings.overall.emails, function(emailObj) {
    if (emailObj.email === userEmail) {
      emailObj.score = userScore;
      return true;
    }
    return false;
  })
}

module.exports = router;
