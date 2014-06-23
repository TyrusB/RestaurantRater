$(function() {
  var restaurant = JSON.parse($('#restaurant-data').html());

  $('.slider').slider({step: 10});

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
      }
    })
  })
});