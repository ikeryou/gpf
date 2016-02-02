Display = require('./libs/display/Display');


# ---------------------------------------------------
# 説明画面
# ---------------------------------------------------
class About extends Display
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    super({
      id:"xAbout"
    });
    
    # タイトル
    @_ttl;
    
    # キャプション
    @_capPc;
    @_capSmt;
    
    # 保存ボタン
    @_saveBtn;
    
    # リセットボタン
    @_resetBtn;
    
    
    # コールバック 保存
    @onClickSave;
    
    # コールバック リセット
    @onClickReset;
  
  
  
  # ------------------------------------
  # 初期化
  # ------------------------------------
  init: =>
    
    super();
    
    @elm().removeClass("hide");
    
    # タイトル
    @_ttl = new Display({id:"xTitle"});
    @_ttl.init();
    
    # キャプション PC
    @_capPc = new Display({id:"xCaptionPc"});
    @_capPc.init();
    
    # キャプション SMT
    @_capSmt = new Display({id:"xCaptionSmt"});
    @_capSmt.init();
    
    # 保存ボタン
    @_saveBtn = new Display({id:"xSave"});
    @_saveBtn.init();
    @_saveBtn.elm().on("click", =>
      if @onClickSave? then @onClickSave();
    );
    
    # リセットボタン
    @_resetBtn = new Display({id:"xReset"});
    @_resetBtn.init();
    @_resetBtn.elm().on("click", =>
      if @onClickReset? then @onClickReset();
    );
    
    if MY.u.isSmt()
      @btnVisible(false);
      @_capPc.visible(false);
      @_capPc.render();
    else
      @_capSmt.visible(false);
      @_capSmt.render();
    
    MY.resize.add(@_resize, true);
    MY.update.add(@_update);  
  
  
  
  # -----------------------------------
  # ボタンの表示切り替え
  # -----------------------------------
  btnVisible: (bool) =>
    
    if MY.u.isSmt() && bool
      bool = false;
    
    @_saveBtn.visible(bool);
    @_saveBtn.render();
    
    @_resetBtn.visible(bool);
    @_resetBtn.render();
  
  
  
  # -----------------------------------
  # リサイズ
  # -----------------------------------
  _resize: (w, h) =>
    
    w = w || MY.resize.sw();
    h = h || MY.resize.sh();
    
    # タイトル
    @_ttl.xy(MY.f.v(50, 25), MY.f.v(50, 25));
    @_ttl.render();
    
    # キャプション PC
    @_capPc.xy(@_ttl.x(), @_ttl.bottom() + MY.f.v(40, 20));
    @_capPc.render();
    
    # キャプション SMT
    @_capSmt.xy(@_ttl.x(), @_ttl.bottom() + MY.f.v(40, 20));
    @_capSmt.render();
    
    # 保存ボタン
    @_saveBtn.xy(@_ttl.x(), Math.max(@_capPc.bottom(), @_capSmt.bottom()) + MY.f.v(20, 20));
    @_saveBtn.render();
    
    # リセットボタン
    @_resetBtn.xy(@_saveBtn.right() + 30, @_saveBtn.y());
    @_resetBtn.render();
  
  
  
  # -----------------------------------
  # update
  # -----------------------------------
  _update: =>
















module.exports = About;