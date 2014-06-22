var mongoose = require('mongoose');

var restaurantSchema = new mongoose.Schema(
  {
    name: String,
    ratings: {
      // taste: {
      //   numRatings: Number,
      //   avgScore: Number,
      //   emails: [{email: String, rating: Number}]
      // },
      // value: {
      //   numRatings: Number,
      //   avgScore: Number,
      //   emails: [{email: String, rating: Number}]
      // },
      overall: {
        numRatings: Number,
        avgScore: Number,
        emails: [{email: String, rating: Number}]
      }
    }
  },
  { collection: "restaurants" }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);