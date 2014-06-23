var express = require('express');
var router = express.Router();
var Restaurant = require('../models/restaurant');
var _ = require('../public/javascripts/lodash.underscore.min.js')

/* Auth function - no persistent users, but we need their email via cookie */
function isEmailCookieStored(req, res, next) {
  if (req.cookies.email) {
    next();
  } else {
    res.redirect('/');
  }
}

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
router.get('/restaurants', isEmailCookieStored, function(req, res) {
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
router.get('/restaurants/:id', isEmailCookieStored, function(req, res) {
  var restaurantQuery = Restaurant.findById(req.params.id)

  restaurantQuery.exec(function(err, restaurantData) {
    if (!err) {
      var userEmail = req.cookies.email;
      var userHasRated = hasUserRatedYet(restaurantData, userEmail);
      var startingOverallRating = userHasRated ? findUserRating(restaurantData, "overall", userEmail) * 20 : 25;
      
      console.log(startingOverallRating);
      res.render('restaurant_show', { 
        restaurantJSON: JSON.stringify(restaurantData),
        name: restaurantData.name,
        avgScore: restaurantData.ratings.overall.avgScore || "Not Rated",
        numRatings: restaurantData.ratings.overall.numRatings || "0",
        userHasRated: userHasRated,
        overallRating: startingOverallRating
      });

    } else {
      res.render('error');
    }
  });
});

router.post('/restaurants/new', isEmailCookieStored, function(req, res) {
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
  var userOverallRating = req.body.overallRating,
      userEmail = req.cookies.email;

  /* If, somehow, the user has thwarted our auth attempts, send a 500 error*/
  if (!userEmail) {
    res.status(500);
    res.send();
  }

  var restaurantQuery = Restaurant.findById(req.params.id)

  restaurantQuery.exec(function(err, restaurant) {
    /* Two paths: either user is one of the ratings, or not */
    userHasRated = hasUserRatedYet(restaurant, userEmail);

    var overallRatings = restaurant.ratings.overall

    /* If the user's rated already, then we need to adjust the score*/
    if (userHasRated) {
      var priorOverallRating;

      /* Go through emails, recording the old score and then changing it*/
      _.each(overallRatings.emails, function(emailObj) {
        if (emailObj.email === userEmail) {
          priorOverallRating = emailObj.rating;
          emailObj.rating = userOverallRating;
        }
      });
      /* Adjust the meta-data */
      overallRatings.avgScore = (overallRatings.avgScore * overallRatings.numRatings - priorOverallRating + userOverallRating) / overallRatings.numRatings

    /* Otherwise we need to add to it */
    } else {
      var scoreSum = overallRatings.avgScore * overallRatings.numRatings;
      overallRatings.numRatings += 1;

      overallRatings.avgScore = (scoreSum + userOverallRating) / overallRatings.numRatings;
      overallRatings.emails.push( {"email": userEmail, "rating": userOverallRating} )
    }

    restaurant.save(function(err, restaurant) {
      if (!err) {
        res.json(restaurant);
      } else {
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

function findUserRating(restaurant, ratingType, userEmail) {
  var userRating;
  _.find(restaurant["ratings"][ratingType]["emails"], function(emailObj) {
    if (emailObj.email === userEmail) {
      userRating = emailObj.rating;
      return true;
    } else {
      return false;
    }
  });

  return userRating;
}


module.exports = router;
