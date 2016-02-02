UpdateMgr = require('./libs/mgr/UpdateMgr');
ResizeMgr = require('./libs/mgr/ResizeMgr');
DelayMgr  = require('./libs/mgr/DelayMgr');
Utils     = require('./libs/Utils');
Contents  = require('./Contents');
Conf      = require('./Conf');
Func      = require('./Func');
Param     = require('./Param');
Profiler  = require('./Profiler');
Mouse     = require('./Mouse');



# ------------------------------------
# メイン
# ------------------------------------
class Main
  
  # ------------------------------------
  # コンストラクタ
  # ------------------------------------
  constructor: ->
  
  
  
  # ------------------------------------
  # 初期化
  # ------------------------------------
  init: =>
    
    # app専用オブジェクト
    window.MY = {};
    
    # コンフィグ
    MY.conf = new Conf();
    
    # ユーティリティー
    MY.u = new Utils();
    
    # 画面更新管理
    MY.update = new UpdateMgr();
    MY.update.add(@_update);
    
    # リサイズ管理
    MY.resize = new ResizeMgr();
    
    # 遅延実行管理
    MY.delay = new DelayMgr();
    
    # 共通関数
    MY.f = new Func();
    
    # パラメータ管理
    MY.param = new Param();
    
    # プロファイラー
    MY.profiler = new Profiler();
    
    # マウス位置
    MY.mouse = new Mouse();
    
    # 行列計算用オブジェクト
    MY.mat = new matIV();
    
    # コンテンツ
    MY.c = new Contents();
    MY.c.init();
  
  
  
  # ------------------------------------
  # 更新
  # ------------------------------------
  _update: =>
    
    MY.delay.update();









$(window).ready(=>
  app = new Main();
  app.init();
  window.MY.main = app;
);