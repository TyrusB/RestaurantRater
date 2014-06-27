function Restaurants(restaurants) {
  this.models = [];

  var collection = this;
  _.each(restaurants, function(restaurant) {
    var newRestaurant = new Restaurant(restaurant)
    collection.models.push(newRestaurant);
  });
}

/* Builds either a full list of restaurants or a partial list */
Restaurants.prototype.buildList = function(restaurants) {
  if (typeof restaurants === "undefined") {
    restaurants = this.models;
  }

  var $restaurantHolder = $('<ul id="restaurants-holder"></ul>');
  _.each(restaurants, function(restaurant) {
    var restaurantLi = restaurant.buildLi();
    $restaurantHolder.append(restaurantLi);
  })

  return $restaurantHolder;
};

Restaurants.prototype.searchNames = function(str) {
  var matches = [];

  _.each(this.models, function(restaurant) {
    if (restaurant.name.toLowerCase().indexOf(str.toLowerCase()) !== -1) {
      matches.push(restaurant);
    }
  });

  return matches;
}

/* Returns boolean, whether str matches exactly a name */
Restaurants.prototype.exactNameMatch = function(str) {
  return _.any(this.models, function(restaurant) {
    return restaurant.name.toLowerCase() === str.toLowerCase();
  });
}

Restaurants.prototype.findRestaurant = function(nameStr) {
  return _.find(this.models, function(restaurant) {
    if (restaurant.name.toLowerCase() === nameStr.toLowerCase()) {
      return restaurant;
    }
  })
}