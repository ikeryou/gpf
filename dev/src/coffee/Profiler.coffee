

# ---------------------------------------------------
# アプリ監視
# ---------------------------------------------------
class Profiler
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    @_stats;
    
    @_init();
  
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  _init:  =>
    
    if MY.conf.FLG.STATS
      @_stats = new Stats();
      @_stats.domElement.style.position = "fixed";
      @_stats.domElement.style.left     = "0px";
      @_stats.domElement.style.bottom   = "0px";
      document.body.appendChild(@_stats.domElement);
      
      MY.update.add(@_update);
  
  
  
  # -----------------------------------------------
  # 更新
  # -----------------------------------------------
  _update:  =>
    
    if @_stats?
      @_stats.update();







module.exports = Profiler;