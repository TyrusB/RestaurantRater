$(function() {
  $('input[type="text"]').on('focus blur', function() {
    $(this).toggleClass('form-focused');
  })
})