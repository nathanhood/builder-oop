/* global ajax, audioBeanStalk, audioDeadTree */
/* jshint unused:false */

(function(){
  'use strict';

  init();

  function init(){
    $('#autogrow').click(grow);
  }

  var isOn = false;
  var timer;

  function grow(){
    isOn = !isOn;
    $('#autogrow').toggleClass('on');

    if(isOn){
      start();
    }else{
      clearInterval(timer);
    }
  }

  function start(){
    clearInterval(timer);
    timer = setInterval(growing, 1000);
  }

  function growing(){
    $('.alive:not(.beanstalk)').map((i,d)=>$(d).attr('data-id')).each((i,v)=>{
      var tree = $(`.tree[data-id=${v}]`);

      ajax(`/trees/${v}/grow`, 'PUT', null, html=>{
        tree.replaceWith(html);
        if($(html).hasClass('beanstalk')){
          audioBeanStalk.play();
        }
        if($(html).hasClass('dead')){
          audioDeadTree.play();
        }
      });
    }); //mapping dom elements with class of alive and !beanstalk and extracting ids and putting them into array

  }


})();
