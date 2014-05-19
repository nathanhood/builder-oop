(function() {
  'use strict';
  init();
  var isOn = false;
  var timer;
  function init() {
    $('#autoroot').click(root);
  }
  function root() {
    isOn = !isOn;
    $('#autoroot').toggleClass('on');
    if (isOn) {
      start();
    } else {
      clearInterval(timer);
    }
  }
  function start() {
    clearInterval(timer);
    timer = setInterval(rooting, 5000);
  }
  function rooting() {
    var userId = $('#user').attr('data-id');
    ajax(("/trees/" + userId + "/autoroot"), 'DELETE', null, (function(html) {
      $('#forest').empty().append(html);
    }));
  }
})();

//# sourceMappingURL=autoroot.map
