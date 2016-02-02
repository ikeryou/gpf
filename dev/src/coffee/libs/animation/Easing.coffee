

# ---------------------------------------------------
# イージング計算用オブジェクト
# ---------------------------------------------------
class Easing
  
  
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    # 進行度 0 ~ d
    @t = 0;
    
    # 開始の値
    @b = 0;
    
    # 開始と終了の差分
    @c = 1;
    
    # 合計時間
    @d = 1;
    
    
    @s = 1.70158;
    @p = 0;
    @a = @c;
    
    @val = 0;
        
        
    # 初期化
    @_init();
    
  
  # -----------------------------------
  # 初期化
  # -----------------------------------
  _init: =>
    
        
  
  # -----------------------------------
  # 削除
  # -----------------------------------
  dispose: =>
    
  
  
  # -----------------------------------
  # リセット
  # -----------------------------------
  reset: =>
    
    @t = 0;
    @val = 0;
    
    @s = 1.70158;
    @p = 0;
    @a = @c;
    
  
  # -----------------------------------
  # linear
  # -----------------------------------
  linear: =>
    
    return @c*@t/@d + @b;
  
  
  # -----------------------------------
  # quadIn
  # -----------------------------------
  quadIn: =>
    
    @t /= @d;
    return @c*@t*@t + @b;
    
    
  # -----------------------------------
  # quadOut
  # -----------------------------------
  quadOut: =>
    
    @t /= @d;
    return -@c * @t*(@t-2) + @b;
    
    
  # -----------------------------------
  # quadInOut
  # -----------------------------------
  quadInOut: =>
    
    @t /= @d/2;
    if @t < 1
      return @c/2*@t*@t + @b;
    
    @t--;
    return -@c/2 * (@t*(@t-2) - 1) + @b;
  
  
  # -----------------------------------
  # cubicIn
  # -----------------------------------
  cubicIn: =>
    
    @t /= @d;
    return @c*@t*@t*@t + @b;
  
  
  # -----------------------------------
  # cubicOut
  # -----------------------------------
  cubicOut: =>
    
    @t /= @d;
    @t--;
    return @c*(@t*@t*@t + 1) + @b;
  
  
  # -----------------------------------
  # cubicInOut
  # -----------------------------------
  cubicInOut: =>
  
    @t /= @d/2;
    if @t < 1
      return @c/2*@t*@t*@t + @b;
    @t -= 2;
    return @c/2*(@t*@t*@t + 2) + @b;
  
  
  # -----------------------------------
  # quartIn
  # -----------------------------------
  quartIn: =>
    
    @t /= @d;
    return @c*@t*@t*@t*@t + @b;
  
  
  # -----------------------------------
  # quartOut
  # -----------------------------------
  quartOut: =>
    
    @t /= @d;
    @t--;
    return -@c * (@t*@t*@t*@t - 1) + @b;
  
  
  # -----------------------------------
  # quartInOut
  # -----------------------------------
  quartInOut: =>
    
    @t /= @d/2;
    if @t < 1
      return @c/2*@t*@t*@t*@t + @b;
    
    @t -= 2;
    return -@c/2 * (@t*@t*@t*@t - 2) + @b;
  
  
  # -----------------------------------
  # quintIn
  # -----------------------------------
  quintIn: =>
    
    @t /= @d;
    return @c*@t*@t*@t*@t*@t + @b;
  
  
  # -----------------------------------
  # quintOut
  # -----------------------------------
  quintOut: =>
    
    @t /= @d;
    @t--;
    return @c*(@t*@t*@t*@t*@t + 1) + @b;
  
  
  # -----------------------------------
  # quiInOut
  # -----------------------------------
  quintInOut: =>
  
    @t /= @d/2.0;
    if @t < 1
      return @c/2.0*@t*@t*@t*@t*@t + @b;
    
    @t = @t - 2;
    return @c/2.0 * (@t*@t*@t*@t*@t + 2) + @b;
    
    
  # -----------------------------------
  # sineIn
  # -----------------------------------
  sineIn: =>
    
    return -@c * Math.cos(@t/@d * (Math.PI/2)) + @c + @b;
  
  
  # -----------------------------------
  # sineOut
  # -----------------------------------
  sineOut: =>
    
    return @c * Math.sin(@t/@d * (Math.PI/2)) + @b;
  
  
  # -----------------------------------
  # sineInOut
  # -----------------------------------
  sineInOut: =>
    
    return -@c/2 * (Math.cos(Math.PI*@t/@d) - 1) + @b;
    
  
  # -----------------------------------
  # expoIn
  # -----------------------------------
  expoIn: =>
  
    return @c * Math.pow(2, 10 * (@t/@d - 1) ) + @b;
  
  
  # -----------------------------------
  # expoOut
  # -----------------------------------
  expoOut: =>
    
    return @c * ( -Math.pow( 2, -10 * @t/@d ) + 1 ) + @b;
  
    
  # -----------------------------------
  # expoInOut
  # -----------------------------------
  expoInOut: =>
  
    @t /= @d/2;
    if @t < 1 
      return @c/2 * Math.pow( 2, 10 * (@t - 1) ) + @b;
    
    @t--;
    return @c/2 * ( -Math.pow( 2, -10 * @t) + 2 ) + @b;  
    
  
  # -----------------------------------
  # circIn
  # -----------------------------------
  circIn: =>  
    
    @t /= @d;
    return -@c * (Math.sqrt(1 - @t*@t) - 1) + @b;
  
  
  # -----------------------------------
  # circOut
  # -----------------------------------
  circOut: =>
    
    @t /= @d;
    @t--;
    return @c * Math.sqrt(1 - @t*@t) + @b;
  
  
  # -----------------------------------
  # circInOut
  # -----------------------------------
  circInOut: =>
    
    @t /= @d/2;
    if @t < 1
      return -@c/2 * (Math.sqrt(1 - @t*@t) - 1) + @b;
    
    @t -= 2;
    return @c/2 * (Math.sqrt(1 - @t*@t) + 1) + @b;
    
  
  # -----------------------------------
  # elasticOut
  # -----------------------------------
  elasticOut: =>
    
#     s = 1.70158;
#     p = 0;
#     a = @c;
    
    if @t == 0
      return @b;
    
    if (@t/=@d) == 1
      return @b + @c;
    
    if !@p 
      @p = @d * 0.3;
    
    if @a < Math.abs(@c)
      @a = @c; 
      @s = @p / 4;
    else 
      @s = @p/(2*Math.PI) * Math.asin(@c/@a);
      
    return @a*Math.pow(2,-10*@t) * Math.sin( (@t*@d-@s)*(2*Math.PI)/@p ) + @c + @b;
    
    
  # -----------------------------------
  # bounceOut
  # -----------------------------------
  bounceOut: =>
    
    if (@t /= @d) < (1 / 2.75) 
      return @c * (7.5625 * @t * @t) + @b;
    
    if @t < (2 / 2.75) 
      return @c * (7.5625 * (@t -= (1.5 / 2.75)) * @t + 0.75) + @b;
    
    if @t < (2.5 / 2.75)
      return @c * (7.5625 * (@t -= (2.25 / 2.75)) * @t + 0.9375) + @b;
    else 
      return @c * (7.5625 * (@t -= (2.625 / 2.75)) * @t + 0.984375) + @b;
    
    
    
    
module.exports = Easing;