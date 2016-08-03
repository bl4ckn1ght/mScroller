/**
 * mScroller 一款自定义滚动条
 * author: Ming
 * date: 2016/07/31
 */

function mScroller(options) {
  function mainScorll() {

    var defaults = {
      wrap: $("#wrap"),
      content: $("#cont"),
      wheel: 20,
      backgroundColor: '#ccc'
    };

    var params = $.extend(defaults, options || {});

    var $ch = params.content.height(); //获取内容宽度
    var $wh = params.wrap.height(); //获取容器宽度

    if ($ch > $wh) {
      var html = '<div class="scroll-box"><div class="scroll-bar"></div></div>';
      params.wrap.append(html);

      //获取滚动条
      var $scrollBar = $('.scroll-bar');
      var $wrapScrollBar = $('.scroll-box');

      //设置滚动条属性
      $wrapScrollBar.css({
        'position': 'absolute',
        'top': '0',
        'left': params.wrap.width() - 8 + 'px',
        'width': '8px',
        'padding': '0 2px'
      });
      $scrollBar.css({
        'position': 'relative',
        'top': '0',
        'left': '0',
        'borderRadius': '4px',
        'overflow': 'hidden',
        'backgroundColor': params.backgroundColor
      });

      //设置滚动按钮宽度
      $scrollBar.height($wh * $wh / $ch);

      var $sh = $scrollBar.height(); //获取滚动条宽度
      var disX = 0; //初始化disx
      var sMoveDis = params.wheel; //滚动滚轮单次移动的距离
      //设置滚动条滚动距离函数
      function fnChangePos(data) {
        if (data < 0) data = 0;
        else if (data > ($wh - $sh)) data = $wh - $sh;
        $scrollBar.css('top', data);
        params.content.css('top', -($ch - $wh) * data / ($wh - $sh));
      }

      //鼠标滚轮事件处理函数
      function fnMouseWheel(e) {
        var evt = e || window.event;
        var wheelDelta = evt.wheelDelta || evt.detail; //鼠标滚动值，可由此判断鼠标滚动方向
        if (wheelDelta == -120 || wheelDelta == 3) fnChangePos($scrollBar.position().top + sMoveDis);
        else if (wheelDelta == 120 || wheelDelta == -3) fnChangePos($scrollBar.position().top - sMoveDis);
        e.preventDefault();
      }

      //滚动条拖动事件
      $scrollBar.mousedown(function(event) {
        disX = event.pageY - $(this).position().top; //鼠标位置 - 滚动条的位置
        if (this.setCapture) {
          $(this).mousemove(function(event) {
            fnChangePos(event.pageY - disX);
          });
          this.setCapture(); //设置捕获范围
          $scrollBar.mouseup(function() {
            $(this).unbind('mousemove mouseup');
            this.releaseCapture(); //取消捕获范围
          });
        } else {
          $(document).mousemove(function(event) {
            fnChangePos(event.pageY - disX);
          });
          $(document).mouseup(function() {
            $(document).unbind('mousemove mouseup');
          });
        }
        return false;
      });

      //滚动条鼠标滚轮事件注册
      if (params.wrap[0].addEventListener) { //for firefox
        params.wrap[0].addEventListener("DOMMouseScroll", fnMouseWheel);
      }
      params.wrap[0].onmousewheel = fnMouseWheel; // for other browser
    } else {
      params.content.css('top', 0);
      $('.scroll-box').remove();
      if (params.wrap[0].addEventListener) { //for firefox
        params.wrap[0].addEventListener("DOMMouseScroll", false);
      }
      params.wrap[0].onmousewheel = null; // for other browser
    }
  }

  mainScorll();

  //窗口改变时再调用一次
  $(window).resize(function() {
    mainScorll();
  })
}
