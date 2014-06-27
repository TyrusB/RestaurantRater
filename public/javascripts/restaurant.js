function Restaurant(attrs) {
  $.extend(this, attrs);
}

Restaurant.prototype.buildLi = function() {
  var tagString = '<li data-id="' + restaurant._id + '"';
  if (this.ratings.overall.avgScore) {
    tagString += 'data-avg-overall="' + this.ratings.overall.avgScore + '"';
  }
  tagString += '>' + restaurant.name + '</li>';

  return $(tagString);
}

Restaurant.prototype.submitRating = function(rating, $ratingsInfoDiv) {
  $.ajax({
      url: '/restaurants/' + this._id + '/ratings',
      method: 'post',
      data: { 'overallRating': rating },
      success: function(restaurant) {
        $ratingsInfoDiv.find($('#avg-score')).text(restaurant.ratings.overall.avgScore);
        $ratingsInfoDiv.find($('#num-ratings')).text(restaurant.ratings.overall.numRatings);
        $('.past-ratings-info').find('span').text("You've rated this restaurant. Feel free to change your rating.");
      }
  })
}