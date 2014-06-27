$(function() {

  /**/ 

  /* Create our restaurants collection using bootstrapped data */
  var restaurantsData = JSON.parse($('#restaurants-data').html());

  var restaurants = new Restaurants(restaurantsData);

  var restaurantList = restaurants.buildList;
  restaurantList.appendTo($('#restaurants-list'));

  /**/

  /* Handle searching */
  $('input[name=restaurant_name]').on('keyup', function() {
    var entered = $('#rest-input').val();

    /* Build up and attach new list */
    var matches = restaurants.searchNames(entered);
    var $newRestaurantsList = restaurants.buildList(matches);
    $('#restaurants-holder').empty().append($newRestaurantsList);


    /* Handle our buttons */
    if (restaurants.exactNameMatch(entered)) {
      $('.restaurant-form').find('input[type=submit]').attr('value', 'Go').css('background-color', '#32CD32');
    } else {
      $('.restaurant-form').find('input[type=submit]').attr('value', 'Add').css('background-color', 'red');
    }

    /* Handle whether or not submit button is enabled */
    handleActivationStatusOfSubmit();
  });

  /**/

  /* Use event delegation to handle clicking on the restaurant list*/
  $('#restaurants-list').on('click', 'li', function() {
    var name = $(this).text(),
        id = $(this).data('id');

    /* If a restaurant is clicked, make the input say that, then change the submit button*/
    $('.restaurant-form').find('input[name=restaurant_name]').val(name);
    $('.restaurant-form').find('input[type=submit]').attr('value', 'Go').css('background-color', '#32CD32');

    handleActivationStatusOfSubmit();
  });

  /**/

  /* Handle form submission */
  $('.restaurant-form').on('submit', function(event) {
    var input = $(this).find('#rest-input').val();

    /* Different actions depending on whether restaurant exists or not */
    if (restaurants.exactNameMatch) {
      var selectedRestaurant = restaurants.findRestaurant(input);
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
