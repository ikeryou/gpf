


# ---------------------------------------------------
# ポイントクラス
# ---------------------------------------------------
class Point
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: (x, y)->
    
    @x = x || 0;
    @y = y || 0;
    
    
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  reset: =>
    
    @x = @y = 0;
  
  
  
  # -----------------------------------------------
  # 
  # -----------------------------------------------
  subtract: (pt) =>
    
    return new Point(@x - pt.x, @y - pt.y);













module.exports = Point;