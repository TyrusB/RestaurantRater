function Slider($el, $currentRatingNum) {
  var slider = this;
  this.$el = $el;

  this.init = function(initialValue) {
    var $slider = slider.$el
    $slider.slider({
      step: 10, 
      value: (initialValue || 50),
      change: function(event, ui) {
        var newRating = ui.value / 20;
        $currentRatingNum.text(newRating);

        if (newRating < 2) {
          $currentRatingNum.css('color', 'red');
        } else if (newRating >= 3.5) {
          $currentRatingNum.css('color', 'green');
        } else {
          $currentRatingNum.css('color', 'gold');
        }
      }
    });
    /* Set our initial value (need to do this again to trigger change event) */
    $slider.slider({value: initialValue});
  }

  this.getValue = function() {
    return slider.$el.slider('value') / 20;
  }
}