$(function() {

  /* Want to build up our list of restaurants*/
  var restaurants = JSON.parse($('#restaurant-data').html());
  var $restHolder = $('<ul class="restaurant-holder"></ul>');

  restaurants.forEach(function(restaurant) {
    var $restLi = $('<li data-id="' + restaurant._id +'">' + restaurant.name + '</li>')
    $restHolder.append($restLi);
  });

  $restHolder.appendTo($('.restaurant-list'));
})