$(function() {
  var restaurant = JSON.parse($('#restaurant-data').html());

  $('.slider').slider({
    step: 10, 
    value: 50,
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

  $('#submit-ratings').on('click', function(event) {
    event.preventDefault();
    var rating = $('.slider').slider('value') / 20;
    $.ajax({
      url: '/restaurants/' + restaurant._id + '/ratings',
      method: 'post',
      data: { 'overallRating': rating },
      success: function(restaurant) {
        $('#avg-score').text(restaurant.ratings.overall.avgScore);
        $('#num-ratings').text(restaurant.ratings.overall.numRatings);
        $('.past-ratings-info').find('span').text("You've rated this restaurant. Feel free to change your rating.");
      }
    })
  })
});