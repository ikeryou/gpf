Display = require('./libs/display/Display');


# ---------------------------------------------------
# ローディング
# ---------------------------------------------------
class Loading extends Display
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    super();
    
    # バー
    @_bar;
    
    @_rate = 0;
  
  
  
  # ------------------------------------
  # 初期化
  # ------------------------------------
  init: =>
    
    super();
    
    # バー
    @_bar = new Display();
    @_bar.init();
    @add(@_bar);
    @_bar.bgColor("#FFF");
    @_bar.render();
    
    MY.resize.add(@_resize, true);
  
  
  
  # -----------------------------------
  # ローディング状況更新
  # -----------------------------------
  update: (rate) =>
    
    @_rate = rate;
    @_resize();
  
  
  
  # -----------------------------------
  # リサイズ
  # -----------------------------------
  _resize: (w, h) =>
    
    w = w || MY.resize.sw();
    h = h || MY.resize.sh();
    
    @_bar.size(w * @_rate, 10);
    @_bar.xy(0, ~~(h * 0.5 - @_bar.height() * 0.5));
    @_bar.render();
  
  
  
  # -----------------------------------
  # 破棄
  # -----------------------------------
  dispose: =>
    
    MY.resize.remove(@_resize);
    
    if @_bar?
      @_bar.dispose();
      @_bar = null;
    
    super();










module.exports = Loading;