$(function() {

  /* Want to build up our list of restaurants*/
  var restaurants = JSON.parse($('#restaurant-data').html());
  var $restHolder = $('<ul class="restaurant-holder"></ul>');

  restaurants.forEach(function(restaurant) {
    buildLiFromRestaurant(restaurant, $restHolder)
  });

  $restHolder.appendTo($('.restaurant-list'));


  /* Handle searching */
  $('input[name=restaurant_name]').on('keyup', function() {
    handleActivationStatusOfSubmit();
   
    var entered = $('#rest-input').val();
    /* First, empty the list */
    $('.restaurant-holder').empty();
    /* Next, change the go button to add*/
    $('.restaurant-form').find('input[type=submit]').attr('value', 'Add').css('background-color', 'red');
    
    restaurants.forEach(function(restaurant) {
      /* If the restaurant name contains the entered text, add it to the list*/
      if (restaurant.name.toLowerCase().indexOf(entered.toLowerCase()) !== -1) {
        buildLiFromRestaurant(restaurant, $restHolder);

        /* If the name is an exact match, change the add button to go*/
        if (restaurant.name.toLowerCase() === entered.toLowerCase()) {
          $('.restaurant-form').find('input[type=submit]').attr('value', 'Go').css('background-color', '#32CD32');
        }
      }
    });
  });

  /* Use event delegation to handle clicking on the restaurant list*/
  $('.restaurant-list').on('click', 'li', function() {
    var name = $(this).text(),
        id = $(this).data('id');

    /* If a restaurant is clicked, make the input say that, then change the submit button*/
    $('.restaurant-form').find('input[name=restaurant_name]').val(name);
    $('.restaurant-form').find('input[type=submit]').attr('value', 'Go').css('background-color', '#32CD32');

    handleActivationStatusOfSubmit();
  });


  /* Handle form submission */
  $('.restaurant-form').on('submit', function(event) {
    var input = $(this).find('#rest-input').val()
    var selectedRestaurant = _.find(restaurants, function(restaurant) {
      return restaurant.name.toLowerCase() === input.toLowerCase();
    });
    /* Different routes depending on whether restaurant exists or not */
    if (selectedRestaurant) {
      $(this).attr('action', '/restaurants/' + selectedRestaurant._id).attr('method', 'get');
    } else {
      $(this).attr('action', '/restaurants/new').attr('method', 'post');
    }

    return true;
  })
});

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

function buildLiFromRestaurant(restaurant, ul) {
  var $restLi = $('<li data-id="' + restaurant._id +'">' + restaurant.name + '</li>')
  ul.append($restLi);
}