$(function() {

  if ($('#restaurant-data').length > 0) {

    var restaurantData = JSON.parse($('#restaurant-data').html())
    var restaurant = new Restaurant(restaurantData);

    /**/

    /* Initialize slider, and set change handler*/
    var sliderVal = $('#slider-val').data('slider-val');

    $('.slider').slider({
      step: 10, 
      value: (sliderVal || 50),
      change: function(event, ui) {
        var newRating = ui.value / 20;
        $('.current-rating-num').text(newRating);

        if (newRating < 2) {
          $('.current-rating-num').css('color', 'red');
        } else if (newRating >= 3.5) {
          $('.current-rating-num').css('color', 'green');
        } else {
          $('.current-rating-num').css('color', 'gold');
        }
      }
    });
    /* Set our initial value (need to do this again to trigger change event) */
    $('.slider').slider({value: sliderVal});

    /**/

    /* Submitting our ratings sends an ajax request */
    $('#submit-ratings').on('click', function(event) {
      event.preventDefault();
      var rating = $('.slider').slider('value') / 20;
      
      restaurant.submitRating(rating, $('.ratings-info-section'));
    });

  }
  

});