Display = require('./Display')


# ---------------------------------------------------
# transformプロパティを使用するDisplayオブジェクト
# ---------------------------------------------------
class DisplayTransform extends Display
  
  
  # コンストラクタ
  # -----------------------------------------------
  constructor: (option) ->
    
    super(option);
    
    if !@_option.isDefault3d?
      @_option.isDefault3d = true;
    
    # transform用のプロパティ
    @_transform = {
      dx:0,
      dy:0,
      dz:0,
      scaleX:1,
      scaleY:1,
      scaleZ:1,
      rotX:0,
      rotY:0,
      rotZ:0
    };
    
    # 無効フラグ
    @_isNone = false;
    
    # 以前のtransform
    @_oldTransform = {};
    
  
  # -----------------------------------
  # 初期化
  # -----------------------------------
  init: =>
    
    super();
    
    if @_option.isDefault3d
      @perspective();
      @pivot();
  
  
  # -----------------------------------
  # 破棄
  # -----------------------------------
  dispose: =>
    
    @_oldTransform = null;
    @_transform = null;
    
    
    super();
  
  
  
  # -----------------------------------
  # translate
  # -----------------------------------
  translate: (x, y, z) =>
    
    if !x? && !y? && !z? 
      
      return @_transform;
  
    else
    
      x = x || 0;
      y = y || 0;
      z = z || 0;
      
      @_transform.dx = x;
      @_transform.dy = y;
      @_transform.dz = z;
  
  
  # -----------------------------------
  # scale
  # -----------------------------------
  scale: (x, y, z) =>
    
    if !x? && !y? && !z? 
      
      return @_transform;
  
    else
    
      x = x || 1;
      y = y || 1;
      z = z || 1;
      
      @_transform.scaleX = x;
      @_transform.scaleY = y;
      @_transform.scaleZ = z;
    
    
  # -----------------------------------
  # rotate
  # -----------------------------------
  rotate: (x, y, z) =>
    
    if !x? && !y? && !z? 
      
      return @_transform;
  
    else
    
      x = x || 0;
      y = y || 0;
      z = z || 0;
      
      @_transform.rotX = x;
      @_transform.rotY = y;
      @_transform.rotZ = z;
  
  
  # -----------------------------------
  # Transform設定
  # -----------------------------------
  useTransform: (bool) =>
    
    @_isNone = !bool;
    
#     if @_isNone
#       @_elm.css(@_getVendorCss("transform", "none"));
  
  
  
  # -----------------------------------
  # DOMにレンダリング
  # -----------------------------------
  render: =>
  
    super();
    
    if @_isUpdateTransform()
#       if @_isNone
#         @_elm.css(@_getVendorCss("transform", "none"));
#       else
      @_elm.css(
        @_getVendorCss(
          "transform",
          @_translate3d(@_transform.dx, @_transform.dy, @_transform.dz) + " " + @_rotateX(@_transform.rotX) + " " + @_rotateY(@_transform.rotY) + " " + @_rotateZ(@_transform.rotZ) + " " + @_scale3d(@_transform.scaleX, @_transform.scaleY, @_transform.scaleZ);
        )
      );
    
    # 全部0なら初期値にしておく
    if @_isInit()
      @_elm.css(@_getVendorCss("transform", "none"));
    
    # 値をコピー
    for key,value of @_transform
      @_oldTransform[key] = value;
  
  
  
  # -----------------------------------
  # 基準点
  # -----------------------------------
  pivot: (val) =>
    
    val = val || "50% 50%";
    
    @elm().css(
      @_getVendorCss(
        "transform-origin",
        val
      )
    );
  
  
  # -----------------------------------
  # 遠近
  # -----------------------------------
  perspective: (val) =>
    
    val = val || 800;
    
    @elm().css(
      @_getVendorCss(
        "transform-style",
        "preserve-3d"
      )
    ).css(
      @_getVendorCss(
        "perspective",
        val
      )
    ).css(
      @_getVendorCss(
        "backface-visibility",
        "hidden"
      )
    );
  
  
  # -----------------------------------
  # 初期値かどうか
  # -----------------------------------
  _isInit: =>
    
    if @_transform.dx == 0 && @_transform.dy == 0 && @_transform.dz == 0 && @_transform.scaleX == 1 && @_transform.scaleY == 1 && @_transform.scaleZ == 1 && @_transform.rotX == 0 && @_transform.rotY == 0 && @_transform.rotZ == 0
      return true;
    else
      return false;
  
  
  # -----------------------------------
  # 以前のtransformから更新されてるかチェック
  # -----------------------------------
  _isUpdateTransform: =>
    
    for key,value of @_transform
      if value != @_oldTransform[key]
        return true;
    
    return false;
  
  
  # ベンダープレフィックス付きのCSS
  # -----------------------------------
  _getVendorCss: (prop, val) ->
  
    res = {};
    res["-webkit-" + prop] = val;
    res["-o-" + prop]      = val;
    res["-khtml-" + prop]  = val;
    res["-ms-" + prop]     = val;
    res[prop]              = val;

    return res;
    
  
  # translate3d()
  # -----------------------------------
  _translate3d: (x, y, z) ->
  
    y = y || 0;
    z = z || 0;
  
    return 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';
#     return 'translate3d(' + x + 'px,' + y + 'px, 0)';
  
  
  # rotateX()
  # -----------------------------------
  _rotateX: (val) ->
  
    if val == undefined then val = 0;
#     return 'rotateX(' + val + 'deg)';
    return 'rotate3d(1,0,0,' + val + 'deg)';
  

  # rotateY()
  # -----------------------------------
  _rotateY: (val) ->
  
    if val == undefined then val = 0;
#     return 'rotateY(' + val + 'deg)';
    return 'rotate3d(0,1,0,' + val + 'deg)';


  # rotateZ()
  # -----------------------------------
  _rotateZ: (val) ->
    
    if val == undefined then val = 0;
#     return 'rotateZ(' + val + 'deg)';
    return 'rotate3d(0,0,1,' + val + 'deg)';


  # scale3d()
  # -----------------------------------
  _scale3d: (x, y, z) ->
  
    if x == undefined then x = 1;
    if y == undefined then y = 1;
    if z == undefined then z = 1;
    return 'scale3d(' + x + ',' + y + ',' + z + ')';
  
  
  
  
  
  
  
  
  
  
  
  
  
  
module.exports = DisplayTransform;