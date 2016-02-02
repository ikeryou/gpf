Canvas        = require('./Canvas');
FontVertexMgr = require('./FontVertexMgr');
MakedImg      = require('./MakedImg');
About         = require('./About');
Loading       = require('./Loading');


# ---------------------------------------------------
# コンテンツ
# ---------------------------------------------------
class Contents
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    # 頂点データ管理
    @_vertexData;
    
    # ローディング
    @_loading;
    
    # 描画オブジェクト
    @_canvas;
    
    # 説明画面
    @_about;
    
    # 作成した画像
    @_makedImg;
  
  
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  init: =>
    
    if MY.u.isSmt()
      $(".dg").css({display:"none"});
    
    # 頂点データ管理
    @_vertexData = new FontVertexMgr();
    @_vertexData.init();
    
    # PCならデータ読み込み
    if !MY.u.isSmt()
      
      # ローディング
      @_loading = new Loading();
      @_loading.init();
      
      @_vertexData.onProgress = @_eProgressData;
      @_vertexData.onComplete = @_eCompleteData;
      @_vertexData.load();
      
    else
      
      @_eCompleteData();
  
  
  
  # -----------------------------------
  # イベント データ読み込み中
  # -----------------------------------
  _eProgressData: (rate) =>
    
    @_loading.update(rate);
  
  
  
  # -----------------------------------
  # イベント データ読み込み完了
  # -----------------------------------
  _eCompleteData: =>
    
    # あれば削除
    if @_loading?
      @_loading.dispose();
      @_loading = null;
    
    # 描画オブジェクト
    @_canvas = new Canvas(@_vertexData);
    @_canvas.init();
    @_canvas.onChange   = @_eChangeFont;
    @_canvas.onSelected = @_eSelectedFont;
    
    # 作成した画像
    @_makedImg = new MakedImg();
    @_makedImg.init();
    
    # 説明画面
    @_about = new About();
    @_about.init();
    @_about.onClickSave  = @_eSave;
    @_about.onClickReset = @_eReset;
    @_about.btnVisible(false);
  
  
  
  # -----------------------------------
  # イベント 文字変わった
  # -----------------------------------
  _eChangeFont: =>
  
  
  
  # -----------------------------------
  # イベント 文字選択した
  # -----------------------------------
  _eSelectedFont: (url) =>
    
    @_about.btnVisible(true);
    @_makedImg.add(url);
  
  
  
  # -----------------------------------
  # イベント 保存
  # -----------------------------------
  _eSave: =>
    
    @_makedImg.save();
  
  
  
  # -----------------------------------
  # イベント リセット
  # -----------------------------------
  _eReset: =>
    
    @_about.btnVisible(false);
    @_makedImg.reset();
  
  
  
  



module.exports = Contents;