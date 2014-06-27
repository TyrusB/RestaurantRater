function Restaurants(restaurants) {
  this.models = [];

  _.each(restaurants, function(restaurant) {
    var newRestaurant = new Restaurant(restaurant)
    this.models.push(restaurant);
  });
}

/* Builds either a full list of restaurants or a partial list */
Restaurants.prototype.buildList = function(restaurants) {
  if (typeof restaurants === "undefined") {
    restaurants = this.models;
  }

  var $restaurantHolder = $('<ul class="restaurant-holder"></ul>');
  _.each(this.models, function(restaurant) {
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
  _.find(this.models, function(restaurant) {
    return restaurant.name.toLowerCase() === nameStr.toLowerCase();
  })
}