var audioChop,
    audioBeanStalk,
    audioDeadTree;
function ajax(url, verb) {
  'use strict';
  var data = arguments[2] !== (void 0) ? arguments[2] : {};
  var success = arguments[3] !== (void 0) ? arguments[3] : (function(r) {
    return console.log(r);
  });
  var dataType = arguments[4] !== (void 0) ? arguments[4] : 'html';
  $.ajax({
    url: url,
    type: verb,
    dataType: dataType,
    data: data,
    success: success
  });
}
(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#dashboard').on('click', '#plant', plant);
    $('#dashboard').on('click', '#getForest', forest);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
    $('#dashboard').on('click', '#sell', sell);
    $('#dashboard').on('click', '#purchase-autogrow', purchaseAutoGrow);
    $('#dashboard').on('click', '#purchase-autoseed', purchaseAutoSeed);
    preloadAssets();
  }
  function purchaseAutoSeed(event) {
    var userId = $('#user').attr('data-id');
    ajax(("/users/" + userId + "/purchase/autoseed"), 'PUT', null, (function(html) {
      $('#dashboard').empty().append(html);
      items();
    }));
  }
  function purchaseAutoGrow() {
    var userId = $('#user').attr('data-id');
    ajax(("/users/" + userId + "/purchase/autogrow"), 'PUT', null, (function(html) {
      $('#dashboard').empty().append(html);
      items();
    }));
  }
  function preloadAssets() {
    audioChop = $('<audio>')[0];
    audioChop.src = '/audios/treefall.mp3';
    audioBeanStalk = $('<audio>')[0];
    audioBeanStalk.src = '/audios/beanstalk.mp3';
    audioDeadTree = $('<audio>')[0];
    audioDeadTree.src = '/audios/deadTree.mp3';
  }
  function sell(event) {
    var userId = $('#user').attr('data-id');
    var data = $(this).closest('form').serialize();
    ajax(("/sell/" + userId), 'POST', data, (function(html) {
      $('#dashboard').empty().append(html);
    }));
    event.preventDefault();
  }
  function chop() {
    audioChop.play();
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    var userId = $('#user').attr('data-id');
    ajax(("/trees/" + treeId + "/chop"), 'PUT', null, (function(htmlTree) {
      ajax(("/dashboard/" + userId), 'GET', null, (function(htmlUser) {
        tree.replaceWith(htmlTree);
        $('#dashboard').empty().append(htmlUser);
      }));
    }));
  }
  function grow() {
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    ajax(("/trees/" + treeId + "/grow"), 'PUT', null, (function(html) {
      tree.replaceWith(html);
      if ($(html).hasClass('beanstalk')) {
        audioBeanStalk.play();
      }
      if ($(html).hasClass('dead')) {
        audioDeadTree.play();
      }
    }));
  }
  function forest() {
    var userId = $('#user').attr('data-id');
    ajax(("/trees?userId=" + userId), 'GET', null, (function(html) {
      $('#forest').empty().append(html);
    }));
  }
  function plant() {
    var userId = $('#user').attr('data-id');
    ajax('/trees/plant', 'POST', {userId: userId}, (function(html) {
      $('#forest').append(html);
    }));
  }
  function items() {
    var userId = $('#user').attr('data-id');
    ajax(("/items?userId=" + userId), 'GET', null, (function(html) {
      $('#items').empty().append(html);
    }));
  }
  function login() {
    var username = $('#username').val();
    ajax('/login', 'POST', {username: username}, (function(html) {
      $('#dashboard').empty().append(html);
      forest();
      items();
    }));
  }
})();

//# sourceMappingURL=game.map
