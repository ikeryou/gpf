Display = require('./Display')
DisplayTransform = require('./DisplayTransform')
DisplayImg = require('./DisplayImg')


# ---------------------------------------------------
# スプライト画像表示クラス
# ---------------------------------------------------
class DisplaySpImg extends DisplayTransform
  
  
  # コンストラクタ
  # -----------------------------------------------
  # @option.src     : 画像ソース
  # @option.retina  : レティナ対応 def=false
  # @option.spParam : スプライト画像パラメータ
  # @option.speed   : SP画像の切り替えスピード
  # @option.loopKey : ループ開始位置 def=0
  # @option.random  : スタート画像NOをランダムに
  # -----------------------------------------------
  constructor: (option) ->
    
    super(option);
    
    if !option.speed?
      option.speed = 1;
    
    if !option.loopKey?
      option.loopKey = 0;
    
    @_spOption = {
      src:option.src,
      retina:option.retina,
      spParam:option.spParam,
      speed:option.speed,
      loopKey:option.loopKey,
      random:option.random
    };
    
    # 画像
    @_img;
    
    @_cnt = 0;
    @_now = 0;
    @onLoad;
  
  
  
  # -----------------------------------
  # 初期化
  # -----------------------------------
  init: =>
    
    super();
    
    @mask(true);
    @render();
    
    # 画像
    @_img = new DisplayImg(@_spOption);
    @_img.onLoad = @_eLoaded;
    @_img.init();
    @add(@_img);
    
    if @_spOption.random? && @_spOption.random
      max = Object.keys(@_spOption.spParam.frames).length - 1;
      @_now = ~~(Math.random() * ((max + 1) - 0) + 0);
    
    @_updateSpImg();
  
  
  
  # -----------------------------------
  # 最初のコマに戻す
  # -----------------------------------
  setFirst: =>
    
    @_cnt = 0;
    @_now = 0;
    @_updateSpImg();
  
  
  
  # -----------------------------------
  # 破棄
  # -----------------------------------
  dispose: =>
    
    if @_img?
      @_img.dispose();
      @_img = null;
    
    @onLoad = null;
    super();
  
  
  
  # -----------------------------------
  # イベント 画像読み込み終わり
  # -----------------------------------
  _eLoaded: =>
    
    if @onLoad? then @onLoad();
  
  
  
  # -----------------------------------
  # 画像更新
  # -----------------------------------
  _updateSpImg: =>
    
    o = @_spOption.spParam.frames[String(@_now)].frame;
    
    if @_spOption.retina
      @size(~~(o.w * 0.5), ~~(o.h * 0.5));
      @_img.xy(-o.x * 0.5, -o.y * 0.5);
    else
      @size(o.w, o.h);
      @_img.xy(-o.x, -o.y);
    
    @render();
    @_img.render();
  
  
  
  # -----------------------------------
  # 更新 フレームレート通りに更新 
  # -----------------------------------
  update: =>
    
    @_cnt++;
    if @_cnt % @_spOption.speed == 0
      len = Object.keys(@_spOption.spParam.frames).length;
      if ++@_now >= len
        @_now = @_spOption.loopKey;
      @_updateSpImg();
  
  
  # -----------------------------------
  # 指定位置に切り替え
  # -----------------------------------
  set: (id) =>
    
    @_now = id;
    @_updateSpImg();
  
  
  
  # -----------------------------------
  # 画像のソース変更
  # -----------------------------------
  setImgSrc: (src) =>
    
    if @_img?
      @_img.changeImgSrc(src);







module.exports = DisplaySpImg;