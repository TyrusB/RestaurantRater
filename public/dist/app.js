function Restaurant(a){$.extend(this,a)}function handleActivationStatusOfSubmit(){var a=$("#rest-submit"),b=$("#rest-input").val();b&&a.attr("disabled")?a.removeAttr("disabled"):b||a.attr("disabled","disabled")}function Restaurants(a){this.models=[];var b=this;_.each(a,function(a){var c=new Restaurant(a);b.models.push(c)})}function Slider(a,b){var c=this;this.$el=a,this.init=function(a){var d=c.$el;d.slider({step:10,value:a||50,change:function(a,c){var d=c.value/20;b.text(d),2>d?b.css("color","red"):d>=3.5?b.css("color","green"):b.css("color","gold")}}),d.slider({value:a})},this.getValue=function(){return c.$el.slider("value")/20}}Restaurant.prototype.buildLi=function(){var a='<li data-id="'+this._id+'"';return this.ratings&&this.ratings.overall.avgScore&&(a+='data-avg-overall="'+this.ratings.overall.avgScore+'"'),a+=">"+this.name+"</li>",$(a)},Restaurant.prototype.submitRating=function(a,b){$.ajax({url:"/restaurants/"+this._id+"/ratings",method:"post",data:{overallRating:a},success:function(a){b.find($("#avg-score")).text(a.ratings.overall.avgScore),b.find($("#num-ratings")).text(a.ratings.overall.numRatings),$(".past-ratings-info").find("span").text("You've rated this restaurant. Feel free to change your rating.")}})};var restaurantIndex={loadIfIndexPage:function(){if($("#restaurants-data").length>0){var a=JSON.parse($("#restaurants-data").html());this.init(a)}},init:function(a){var b=new Restaurants(a);this.restaurants=b;var c=b.buildList();c.appendTo($("#restaurants-list")),$("input[name=restaurant_name]").on("keyup",this.handleSearchInput.bind(this,b)),$("#restaurants-list").on("click","li",this.handleRestaurantClick),$(".restaurant-form").on("submit",this.handleFormSubmission)},handleSearchInput:function(a){var b=$("#rest-input").val(),c=a.searchNames(b),d=a.buildList(c);$("#restaurants-list").empty().append(d),a.exactNameMatch(b)?$(".restaurant-form").find("input[type=submit]").attr("value","Go").css("background-color","#32CD32"):$(".restaurant-form").find("input[type=submit]").attr("value","Add").css("background-color","red"),handleActivationStatusOfSubmit()},handleRestaurantClick:function(){{var a=$(this).text();$(this).data("id")}$(".restaurant-form").find("input[name=restaurant_name]").val(a),$(".restaurant-form").find("input[type=submit]").attr("value","Go").css("background-color","#32CD32"),handleActivationStatusOfSubmit()},handleFormSubmission:function(){var a=$(this).find("#rest-input").val();if(restaurants.exactNameMatch(a)){var b=restaurants.findRestaurant(a);$(this).attr("action","/restaurants/"+b._id).attr("method","get")}else $(this).attr("action","/restaurants/new").attr("method","post");return!0}};$(function(){restaurantIndex.loadIfIndexPage()}),$(function(){if($("#restaurant-data").length>0){var a=JSON.parse($("#restaurant-data").html()),b=new Restaurant(a),c=$("#slider-val").data("slider-val"),d=$(".slider"),e=$(".current-rating-num"),f=new Slider(d,e);f.init(c),$("#submit-ratings").on("click",function(a){a.preventDefault();var c=f.getValue();b.submitRating(c,$(".ratings-info-section"))})}}),Restaurants.prototype.buildList=function(a){"undefined"==typeof a&&(a=this.models);var b=$('<ul id="restaurants-holder"></ul>');return _.each(a,function(a){var c=a.buildLi();b.append(c)}),b},Restaurants.prototype.searchNames=function(a){var b=[];return _.each(this.models,function(c){-1!==c.name.toLowerCase().indexOf(a.toLowerCase())&&b.push(c)}),b},Restaurants.prototype.exactNameMatch=function(a){return _.any(this.models,function(b){return b.name.toLowerCase()===a.toLowerCase()})},Restaurants.prototype.findRestaurant=function(a){return _.find(this.models,function(b){return b.name.toLowerCase()===a.toLowerCase()?b:void 0})},$(function(){$('input[type="text"]').on("focus blur",function(){$(this).toggleClass("form-focused")})});