DisplayTransform = require('./libs/display/DisplayTransform');
Point            = require('./libs/object/Point');
Rect             = require('./libs/object/Rect');


# ---------------------------------------------------
# 作成した画像一覧
# ---------------------------------------------------
class MakedImg
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    # 一覧用canvas
    @_canvas;
    @_ctx;
    @_display;
    
    @_images = [];
    
    # 演出用
    @_effect;
    @_effectParam = {
      tOpacity:0,
      opacity:0
    };
    
    @_opacity = 1;
    @_mouseBuffer = new Point();
    @_stopMouseCnt = 0;
    
    # 幅にかけた値だけ左にずらす
    @_zure = 0.3;
  
  
  
  # ------------------------------------
  # 初期化
  # ------------------------------------
  init: =>
    
    # 一覧用canvas
    @_canvas = document.getElementById("xMakedImg");
    @_ctx = @_canvas.getContext("2d");
    @_display = new DisplayTransform({
      id:"xMakedImg"
    });
    @_display.init();
    
    # 演出用
    @_effect = new DisplayTransform({
      id:"xMakedImgEffect"
    });
    @_effect.init();
    @_effect.bgColor("#FFF");
    
    MY.resize.add(@_resize, true);
    MY.update.add(@_update);
  
  
  
  # ------------------------------------
  # リセット
  # ------------------------------------
  reset: =>
    
    @_images = null;
    @_images = [];
    MY.f.canvasSize(@_canvas, 0, 0);
  
  
  
  # -----------------------------------
  # Canvas保存
  # -----------------------------------
  save: =>
    
    url = @_canvas.toDataURL();
    window.open(url);
    
#     a = document.createElement("a");
#     a.href = @_canvas.toDataURL();
#     a.setAttribute("download", "test");
#     
#     e = document.createEvent('MouseEvent');
#     e.initEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
#     a.dispatchEvent(e);
  
  
  
  # ------------------------------------
  # 追加
  # ------------------------------------
  add: (url) =>
    
#     if @_images.length >= 5
#       return;
    
    # 画像読み込み
    img = new Image();
    img.makedImgId = @_images.length;
    img.onload = @_eLoadedImg;
    @_images.push(img);
    
    img.src = url;
  
  
  
  # ------------------------------------
  # イベント 画像読み込み完了
  # ------------------------------------
  _eLoadedImg: (e) =>
    
    img = @_images[e.path[0].makedImgId];
    
    if img?
      @_effectParam.opacity = 1;
      
      # 描画
      @draw();
  
  
  
  # ------------------------------------
  # 描画
  # ------------------------------------
  draw: =>
    
    # サイズ設定
    size = @_getSize();
    MY.f.canvasSize(@_canvas, size.w, size.h);
    
    # 背景色
    @_ctx.fillStyle = "rgb(0, 0, 0)";
    @_ctx.fillRect(0, 0, size.w, size.h);
    
    # 画像配置
    x = 0;
    last = new Rect();
    for val,i in @_images
      if val.complete
        last.x = x;
        last.y = ~~(size.h * 0.5 - val.height * 0.5);
        last.w = val.width;
        last.h = val.height;
        @_ctx.drawImage(val, last.x, last.y, last.w, last.h);
        x += val.width - val.width * @_zure;
    
    # ブラウザに合わせる
    w = MY.resize.sw();
    h = size.h * (w / size.w);
    if h > MY.resize.sh()
      h = MY.resize.sh();
      w = size.w * (h / size.h);
    scale = w / size.w;
    @_display.pivot("0px 0px");
    @_display.size(size.w, size.h);
    @_display.scale(scale, scale);
    @_display.xy(0, ~~(MY.resize.sh() * 0.5 - h * 0.5));
    @_display.render();
    
    # 演出用 一番最後のやつに合わせる
    @_effect.size(last.w*scale, last.h*scale);
    @_effect.xy(last.x*scale, @_display.y() + last.y*scale);
    @_effect.render();
  
  
  
  # ------------------------------------
  # Canvasサイズ取得
  # ------------------------------------
  _getSize: =>
    
    w = 0;
    h = 0;
    for val,i in @_images
      if val.complete
        w += (val.width - val.width * @_zure);
        h = Math.max(h, val.height);
    
    if val?
      w += val.width * @_zure;
      
    
    return {
      w:w,
      h:h
    };
  
  
  
  # -----------------------------------
  # リサイズ
  # -----------------------------------
  _resize: (w, h) =>
    
    w = w || MY.resize.sw();
    h = h || MY.resize.sh();
    
    # 描画
    @draw();
  
  
  
  # -----------------------------------
  # update
  # -----------------------------------
  _update: =>
    
    @_effectParam.opacity += (0 - @_effectParam.opacity) * 0.5;
    @_effect.opacity(@_effectParam.opacity);
    @_effect.render();
    
    opSpeed = 0.03;
    isAddOp = false;
    if @_mouseBuffer.x == MY.mouse.x && @_mouseBuffer.y == MY.mouse.y
      if ++@_stopMouseCnt >= 30
        isAddOp = true;
    else
      @_stopMouseCnt = 0;
    
    if isAddOp
      if (@_opacity += opSpeed) >= 1
        @_opacity = 1;
    else
      if (@_opacity -= opSpeed) < 0.4
        @_opacity = 0.4;
    @_display.opacity(@_opacity);
    @_display.render();
    
    @_mouseBuffer.x = MY.mouse.x;
    @_mouseBuffer.y = MY.mouse.y;
















module.exports = MakedImg;