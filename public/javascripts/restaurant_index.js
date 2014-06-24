define(['jQueryUI', 'lodash'], function($, _ ) {

  /* Helper functions */

  function clearRestaurantList() {
    $('.restaurant-holder').empty();
  }

  function handleActivationStatusOfSubmit() {
    var $subButton = $('#rest-submit');
    var entered = $('#rest-input').val();

    /* If entered isn't blank, remove the disabled attribute on the button */
    if (entered && $subButton.attr('disabled')) {
      $subButton.removeAttr('disabled');
    } else if (!entered) {
      $subButton.attr('disabled', 'disabled');
    }
  }

  function addRestaurantToList(restaurant, ul) {
    var $restLi = $('<li data-id="' + restaurant._id +'">' + restaurant.name + '</li>')
    ul.append($restLi);
  }

  function createRestaurantList(restaurants) {
    var $restHolder = $('<ul class="restaurant-holder"></ul>');

    restaurants.forEach(function(restaurant) {
      addRestaurantToList(restaurant, $restHolder)
    });

    return $restHolder;
  }

  /* This is where we wrap all the page initialization code */
  function setupRestaurantIndexPage() {
    /* Section: initializing restaurant list on page load */
    var restaurants = JSON.parse($('#restaurant-data').html());
    var $restaurantList = createRestaurantList(restaurants);
    $restaurantList.appendTo($('.restaurant-list'));


    /* Section: searching */
    $('input[name=restaurant_name]').on('keyup', function() {
       var entered = $('#rest-input').val();

      clearRestaurantList();
      $('.restaurant-form').find('input[type=submit]').attr('value', 'Add').css('background-color', 'red');

      var matchingRestaurants = _.filter(restaurants, function(restaurant) {
        return restaurant.name.toLowerCase().indexOf(entered.toLowerCase()) !== -1;
      });

      _.each(matchingRestaurants, function(restaurant) {
        attachRestaurantToList(restaurant, $restaurantList)

        /* Change the add button to go if a match is found*/
        if (restaurant.name.toLowerCase() === entered.toLowerCase()) {
          $('.restaurant-form').find('input[type=submit]').attr('value', 'Go').css('background-color', '#32CD32');
        }
      });

      /* Finally, determine whether or not the button is active */
      handleActivationStatusOfSubmit();
    });


    /* Section for handling a click on restaurant list li */
    $('.restaurant-list').on('click', 'li', function() {
      var name = $(this).text(),
          id = $(this).data('id');

      /* If a restaurant is clicked, make the input say that, then change the submit button*/
      $('.restaurant-form').find('input[name=restaurant_name]').val(name);
      $('.restaurant-form').find('input[type=submit]').attr('value', 'Go').css('background-color', '#32CD32');

      handleActivationStatusOfSubmit();
    });


    /* Section: form submission */
    $('.restaurant-form').on('submit', function(event) {
      var input = $(this).find('#rest-input').val()
      var selectedRestaurant = _.find(restaurants, function(restaurant) {
        return restaurant.name.toLowerCase() === input.toLowerCase();
      });
      /* Different actions depending on whether restaurant exists or not */
      if (selectedRestaurant) {
        $(this).attr('action', '/restaurants/' + selectedRestaurant._id).attr('method', 'get');
      } else {
        $(this).attr('action', '/restaurants/new').attr('method', 'post');
      }

      return true;
    })
  }

  return {
    initialize: setupRestaurantIndexPage
  }
};


