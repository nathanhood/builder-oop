/* jshint unused:false */

var audioChop, audioBeanStalk, audioDeadTree;

//creating a function for all ajax calls //making global by putting outside of global function
function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){//defaulting to html
    'use strict';
  $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
}

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
    $('#dashboard').on('click', '#purchase-autogrow', purchaseAutoGrow);
    preloadAssets();
  }


  function purchaseAutoGrow(){
    var userId = $('#user').attr('data-id');
    ajax(`/users/${userId}/purchase/autogrow`, 'PUT', null, html=>{
      $('#dashboard').empty().append(html);
    });
  }

  function preloadAssets(){
    audioChop = $('<audio>')[0];
    audioChop.src = '/audios/treefall.mp3';
    audioBeanStalk = $('<audio>')[0];
    audioBeanStalk.src = '/audios/beanstalk.mp3';
    audioDeadTree = $('<audio>')[0];
    audioDeadTree.src = '/audios/deadTree.mp3';
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
    audioChop.play();
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
      if($(html).hasClass('beanstalk')){
        audioBeanStalk.play();
      }
      if($(html).hasClass('dead')){
        audioDeadTree.play();
      }
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


})();
