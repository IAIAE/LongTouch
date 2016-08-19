;(function(global,LongTouch){
  function assert(statement,callback) {
    if(statement) callback(true);
    else callback(false);
  }

  var test1 = document.getElementById('test1')
  var test2 = document.getElementById('test2')
  LongTouch.attach(test1);
  test1.addEventListener('longtouch',function(event){
    console.info('longtouch');
  });
  test1.addEventListener('touchstart',function(event){
    console.info('touchstart1');
  });
  test1.addEventListener('touchstart',function(event){
    console.info('touchstart2');
  });
  test1.addEventListener('touchend',function(event){
    console.info('touchend1');
  });
  test1.addEventListener('touchend',function(event){
    console.info('touchend2');
  });
  test1.addEventListener('click',function(event){
    console.info('click');
  });

})(window,LongTouch);