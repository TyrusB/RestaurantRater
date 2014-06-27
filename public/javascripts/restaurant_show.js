var restaurantShow = {
  loadIfShowPage: function() {
    if ($('#restaurant-data').length > 0) {
      var restaurantData = JSON.parse($('#restaurant-data').html())
      this.init(restaurantData);
    }
  },

  init: function(restaurantData) {
    var restaurant = new Restaurant(restaurantData);

    var slider = this.initializeSlider();

    $('#submit-ratings').on('click', {slider: slider, restaurant: restaurant}, this.handleRatingSubmission);
  },

  initializeSlider: function() {
    var sliderVal = $('#slider-val').data('slider-val');

    var $sliderEl = $('.slider'),
        $ratingEl = $('.current-rating-num');

    var slider = new Slider($sliderEl, $ratingEl);

    slider.init(sliderVal);

    return slider;
  },

  handleRatingSubmission: function(event) {
    event.preventDefault();
    var slider = event.data.slider,
        restaurant = event.data.restaurant;
    var rating = slider.getValue();
    
    restaurant.submitRating(rating, $('.ratings-info-section'));
  }
}

$(function() {
  restaurantShow.loadIfShowPage();
});
