

# ---------------------------------------------------
# マウス位置管理
# ---------------------------------------------------
class Mouse
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    @x = 0;
    @y = 0;
    @oldX = 0;
    @oldY = 0;
    
    @_init();
  
  
  # ------------------------------------
  # 初期化
  # ------------------------------------
  _init: =>
    
    if MY.u.isSmt()
      $(window).on("touchmove", @_eMouseMove);
      @x = MY.resize.sw() * 0.5;
      @y = MY.resize.sh() * 0.5;
      $(window).on('touchmove.noScroll', (e) =>
        e.preventDefault();
      );
    else
      $(window).on("mousemove", @_eMouseMove);
  
  
  
  # -----------------------------------
  # イベント MouseMove
  # -----------------------------------
  _eMouseMove: (e) =>
    
    @oldX = @x;
    @oldY = @y;
    
    if MY.u.isSmt()
      touches = event.touches;
      event.preventDefault();
      if touches? && touches.length > 0
        @x = touches[0].pageX;
        @y = touches[0].pageY;
    else
      @x = e.clientX;
      @y = e.clientY;
  
  
  
  # -----------------------------------
  # 指定位置からマウス位置までの距離
  # -----------------------------------
  dist: (tx, ty) =>
    
    dx = tx - @x;
    dy = ty - @y;
    
    return Math.sqrt(dx * dx + dy * dy);






module.exports = Mouse;