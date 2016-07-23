(function($){
  $(function(){
    // Plugin initialization
    $('.button-collapse').sideNav({menuWidth: 240, activationWidth: 70});
    $('.slider').slider({full_width: true, height: 700});
    $('.dropdown-button').dropdown();
    $('.tab-demo').show().tabs();
    $('.parallax').parallax();
    $('.modal-trigger').leanModal();
    $('.scrollspy').scrollSpy();
    $('.button-collapse').sideNav({'edge': 'left'});
    $('.datepicker').pickadate({selectYears: 20});
    $('select').not('.disabled').material_select();
  });
})(jQuery);
