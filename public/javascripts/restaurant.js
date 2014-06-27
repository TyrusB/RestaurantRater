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