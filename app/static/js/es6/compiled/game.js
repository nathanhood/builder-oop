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
  function login() {
    var username = $('#username').val();
    ajax('/login', 'POST', {username: username}, (function(html) {
      $('#dashboard').empty().append(html);
    }));
  }
  function ajax(url, verb) {
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
})();

//# sourceMappingURL=game.map
