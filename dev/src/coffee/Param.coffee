

# ---------------------------------------------------
# パラメータ管理
# ---------------------------------------------------
class Param
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    @_gui;
    
    @div1 = 0.1;
    @div2 = 0.1;
    
    @radX = 0.2;
    @radY = 0.2;
    @radZ = 1;
    
    @fl = 800;
    
    @minSize = 0.3;
    @maxSize = 1.5;
    @pSize = 200;
    
    @speed = 200;
    
    @sv = 1;
    
    @line = false;
    
    @noise = false;
    
    @a = 2000;
    @b = 100;
    
    @colorR = 100;
    @colorG = 100;
    @colorB = 100;
    
    @particleNum = "0";
    
    
    
    
    @_init();
  
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  _init:  =>
    
    if MY.conf.FLG.PARAM
    
      @_gui = new dat.GUI();
      @_gui.add(@, 'particleNum').listen();;
      @_gui.add(@, 'noise');
      @_gui.add(@, 'colorR', 0, 200).step(1);
      @_gui.add(@, 'colorG', 0, 200).step(1);
      @_gui.add(@, 'colorB', 0, 200).step(1);
      
      #@_gui.close();
      
#       @_gui.add(@, 'div1', 0, 10).step(0.1);
#       @_gui.add(@, 'div2', 0, 10).step(0.1);
#       @_gui.add(@, 'radX', 0, 10).step(0.1);
#       @_gui.add(@, 'radY', 0, 10).step(0.1);
#       @_gui.add(@, 'radZ', 0, 10).step(0.1);
      #@_gui.add(@, 'a', 0, 5000).step(10);
      #@_gui.add(@, 'b', 1, 200).step(1);
      
#       #@_gui.add(@, 'fl', 0, 1000).step(10);
#       @_gui.add(@, 'minSize', 0, 2).step(0.1);
#       @_gui.add(@, 'maxSize', 0, 2).step(0.1);
#       #@_gui.add(@, 'pSize', 0, 200).step(0.1);
#       #@_gui.add(@, 'speed', 0, 200).step(1);
#       @_gui.add(@, 'sv', 0, 1).step(0.1);
      
      #@_gui.add(@, 'line');
      
      
      $(".dg").css({
        zIndex:99999
      });






module.exports = Param;