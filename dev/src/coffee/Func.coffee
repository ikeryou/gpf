

# ---------------------------------------------------
# 共通関数
# ---------------------------------------------------
class Func
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
  
  
  
  
  # ------------------------------------
  # Canvasのサイズ変更
  # ------------------------------------
  canvasSize: (canvas, w, h) =>
    
    canvas.width = w;
    canvas.height = h;
    $("#" + canvas.id).css({
      width:w,
      height:h
    });
  
  
  
  # ------------------------------------
  # ログ
  # ------------------------------------
  log: (params...) =>
    
    if MY.conf.FLG.LOG
      if console? && console.log? then console.log(params...);
  
  
  
  # ------------------------------------
  # PC、SMTで値だしわけ
  # ------------------------------------
  v: (valPC, valSMT) =>
    
    if MY.u.isSmt()
      return valSMT;
    else
      return valPC;







module.exports = Func;