(function() {
  'use strict';
  init();
  function init() {
    $('#autogrow').click(grow);
  }
  var isOn = false;
  var timer;
  function grow() {
    isOn = !isOn;
    $('#autogrow').toggleClass('on');
    if (isOn) {
      start();
    } else {
      clearInterval(timer);
    }
  }
  function start() {
    clearInterval(timer);
    timer = setInterval(growing, 1000);
  }
  function growing() {
    $('.alive:not(.beanstalk)').map((function(i, d) {
      return $(d).attr('data-id');
    })).each((function(i, v) {
      var tree = $((".tree[data-id=" + v + "]"));
      ajax(("/trees/" + v + "/grow"), 'PUT', null, (function(html) {
        tree.replaceWith(html);
        if ($(html).hasClass('beanstalk')) {
          audioBeanStalk.play();
        }
        if ($(html).hasClass('dead')) {
          audioDeadTree.play();
        }
      }));
    }));
  }
})();

//# sourceMappingURL=autogrow.map
