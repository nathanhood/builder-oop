/* global ajax, audioBeanStalk, audioDeadTree, audioChop */
/* jshint unused:false */

(function(){
  'use strict';

  init();

  function init(){
    $('#autogrow').click(grow);
    slider();
  }

  var isOn = false;
  var timer;

  function slider(){
    $('#range-slider').noUiSlider({
      start: 100,
      range: {
        'min': 4,
        'max': 10000
      },
      serialization: {
    		lower: [
          $.Link({
            target: $('#chop-height')
          })
    		],
    		format: {
          decimals: 0,
    			thousand: ','
          // postfix: 'ft'
    		}
    	}
    });
  }

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
    var chopHeight = $('#chop-height').val();
    var userId = $('#user').attr('data-id');

    $('.alive:not(.beanstalk)').map((i,d)=>$(d).attr('data-id')).each((i,v)=>{
      var tree = $(`.tree[data-id=${v}]`);

      ajax(`/trees/${v}/autogrow`, 'PUT', {chopHeight:chopHeight}, html=>{
        tree.replaceWith(html);
        if($(html).hasClass('beanstalk')){
          audioBeanStalk.play();
        }
        if($(html).hasClass('chopped')){
          audioChop.play();
          dashboard(userId);
        }else if($(html).hasClass('dead')){
          audioDeadTree.play();
        }
      });
    }); //mapping dom elements with class of alive and !beanstalk and extracting ids and putting them into array
  }

  function dashboard(userId){
    ajax(`/dashboard/${userId}`, 'GET', null, htmlUser=>{
      $('#dashboard').empty().append(htmlUser);
    });
  }


})();
