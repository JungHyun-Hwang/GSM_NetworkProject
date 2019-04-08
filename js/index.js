// Toggle Function
$('.toggle').click(function(){
  // Switches the Icon
  $(this).children('i').toggleClass('fa-pencil');
  // Switches the forms
  $('.form').animate({
    height: "toggle",
    'padding-top': 'toggle',
    'padding-bottom': 'toggle',
    opacity: "toggle"
  }, "slow");
});

jQuery('#jobselect').change(function() {
    var state = jQuery('#jobselect option:selected').val();
    if(state == 'student') {
        jQuery('.layer_stu').show();
        jQuery('.layer_tch').hide();
    }else if(state == 'admin') {
        jQuery('.layer_stu').hide();
        jQuery('.layer_tch').show();
    }
    else {
        jQuery('.layer_stu').hide();
        jQuery('.layer_tch').hide();
    }
});
