$(function() {

  if ($('#restaurant-data').length > 0) {

    var restaurantData = JSON.parse($('#restaurant-data').html())
    var restaurant = new Restaurant(restaurantData);

    /**/

    /* Grab any bootstrapped slider data and initialize the slider*/
    var sliderVal = $('#slider-val').data('slider-val');

    var $sliderEl = $('.slider'),
        $ratingEl = $('.current-rating-num');

    var slider = new Slider($sliderEl, $ratingEl);
    slider.init(sliderVal);

    /**/

    /* Submitting our ratings sends an ajax request */
    $('#submit-ratings').on('click', function(event) {
      event.preventDefault();
      var rating = slider.getValue();
      
      restaurant.submitRating(rating, $('.ratings-info-section'));
    });

  }

});
