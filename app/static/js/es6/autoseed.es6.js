/* global ajax, audioBeanStalk, audioDeadTree, audioChop */
/* jshint unused:false */

(function(){
  'use strict';

  init();

  var totalTrees = $('.tree').length;

  function init(){
    $('#autoseed').click(plant);
  }

  var isOn = false;
  var timer;


  function plant(){
    isOn = !isOn;
    $('#autoseed').toggleClass('on');

    if(isOn){
      start();
    }else{
      clearInterval(timer);
    }
  }

  function start(){
    if(totalTrees < 56){
      clearInterval(timer);
      timer = setInterval(planting, 1000);
    }else{
      clearInterval(timer);
    }
  }

  function planting(){
    var userId = $('#user').attr('data-id');
    ajax('/trees/autoseed', 'POST', {userId:userId}, html=>{
      $('#forest').append(html);
    });
  }

  function dashboard(userId){
    ajax(`/dashboard/${userId}`, 'GET', null, htmlUser=>{
      $('#dashboard').empty().append(htmlUser);
    });
  }


})();
