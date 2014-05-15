/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#dashboard').on('click', '#plant', plant);
    $('#dashboard').on('click', '#getForest', forest);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
    $('#dashboard').on('click', '#sell', sell);
  }

  function sell(event){
    var userId = $('#user').attr('data-id');
    var data = $(this).closest('form').serialize();

    ajax(`/sell/${userId}`, 'POST', data, html=>{
      $('#dashboard').empty().append(html);
    });
    event.preventDefault();
  }

  function chop(){
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    var userId = $('#user').attr('data-id');

    ajax(`/trees/${treeId}/chop`, 'PUT', null, htmlTree=>{
      ajax(`/dashboard/${userId}`, 'GET', null, htmlUser=>{
        tree.replaceWith(htmlTree);
        $('#dashboard').empty().append(htmlUser);
      });
    });
  }

  function grow(){
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    ajax(`/trees/${treeId}/grow`, 'PUT', null, html=>{
      tree.replaceWith(html);
    });
  }

  function forest(){
    var userId = $('#user').attr('data-id');
    ajax(`/trees?userId=${userId}`, 'GET', null, html=>{
      $('#forest').empty().append(html);
    }); //trying to be explicit about query. GET defaults to query string.
  }

  function plant(){
    var userId = $('#user').attr('data-id');
    ajax('/trees/plant', 'POST', {userId:userId}, html=>{
      $('#forest').append(html);
    });
  }

  function login(){
    var username = $('#username').val();
    ajax('/login', 'POST', {username:username}, html=>{
      $('#dashboard').empty().append(html);
    });
  }

  //creating a function for all ajax calls
  function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){//defaulting to html
    $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
  }

})();
