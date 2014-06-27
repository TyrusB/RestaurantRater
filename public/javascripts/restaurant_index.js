var restaurantIndex = {

  loadIfIndexPage: function() {
    if ($('#restaurants-data').length > 0) {
      var restaurantsData = JSON.parse($('#restaurants-data').html())

      this.init(restaurantsData);
    }
  },

  init: function(restaurantsData) {
    var restaurants = new Restaurants(restaurantsData);
    this.restaurants = restaurants;

    /* Build up the Restaurant list*/
    var restaurantList = restaurants.buildList();
    restaurantList.appendTo($('#restaurants-list'));

    /* initialize events on search bar */
    $('input[name=restaurant_name]').on('keyup', this.handleSearchInput.bind(this, restaurants));

    /* Initialize events on restaurant list (use event delegation) */
    $('#restaurants-list').on('click', 'li', this.handleRestaurantClick);

    /* Initialize events on form */
    $('.restaurant-form').on('submit', this.handleFormSubmission);
  },

  handleSearchInput: function(restaurants) {
    var entered = $('#rest-input').val();

    /* Build up and attach new list */
    var matches = restaurants.searchNames(entered);
    var $newRestaurantsList = restaurants.buildList(matches);
    $('#restaurants-list').empty().append($newRestaurantsList);


    /* Handle our buttons */
    if (restaurants.exactNameMatch(entered)) {
      $('.restaurant-form').find('input[type=submit]').attr('value', 'Go').css('background-color', '#32CD32');
    } else {
      $('.restaurant-form').find('input[type=submit]').attr('value', 'Add').css('background-color', 'red');
    }

    /* Handle whether or not submit button is enabled */
    handleActivationStatusOfSubmit();
  },

  handleRestaurantClick: function() {
    var name = $(this).text(),
        id = $(this).data('id');

    /* If a restaurant is clicked, make the input say that, then change the submit button*/
    $('.restaurant-form').find('input[name=restaurant_name]').val(name);
    $('.restaurant-form').find('input[type=submit]').attr('value', 'Go').css('background-color', '#32CD32');

    handleActivationStatusOfSubmit();
  },

  handleFormSubmission: function() {
    var input = $(this).find('#rest-input').val();

    /* Different actions depending on whether restaurant exists or not */
    if (restaurants.exactNameMatch(input)) {
      var selectedRestaurant = restaurants.findRestaurant(input);
      $(this).attr('action', '/restaurants/' + selectedRestaurant._id).attr('method', 'get');
    } else {
      $(this).attr('action', '/restaurants/new').attr('method', 'post');
    }

    return true;
  }
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

$(function() {
  restaurantIndex.loadIfIndexPage();
});



