Animation = require('./libs/animation/Animation');


# ---------------------------------------------------
# フォントの頂点情報作成
# ---------------------------------------------------
class FontVertexMgr
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    # データ保存先
    @_data = {};
    
    # データ読み込み用
    @_loadList = [];
    @_loadListNow = 0;
    
    # コールバック 作成中
    @onProgress;
    
    # コールバック 作成完了
    @onComplete;
  
  
  
  # ------------------------------------
  # 初期化
  # ------------------------------------
  init: =>
  
  
  
  
  # ------------------------------------
  # データ作成開始
  # ------------------------------------
  load: =>
    
    for key,val of MY.conf.KEY_TABLE
#       if Number(key) > 57
      if Number(key) > 89
        @_loadList.push(val);
    @_loadListNow = 0;
    
    MY.update.add(@_update);
  
  
  
  # ------------------------------------
  # 更新
  # ------------------------------------
  _update: =>
    
    # 作成
    arr = @getVertex(@_loadList[@_loadListNow]);
    @_loadListNow++;
    if @_loadListNow >= @_loadList.length
      if @onComplete? then @onComplete();
      MY.update.remove(@_update);
    else
      if @onProgress? then @onProgress((@_loadListNow+1) / @_loadList.length);
  
  
  
  # -----------------------------------
  # 頂点情報取得
  # -----------------------------------
  getVertex: (str) =>
    
    # あったらすぐに返す
    if @_data[str]?
      return @_data[str];
    
    # 文字のGeometry
    txtGeo = new THREE.TextGeometry(str, {
      size:6,
      height:0,
      curveSegments:1,
      font:"helvetiker",
      weight:"bold"
    });
    
    # テキスト中央に来るように
    txtGeo.computeBoundingBox();
    box = txtGeo.boundingBox;
    offsetX = -box.min.x - (box.max.x - box.min.x) * 0.5;
    offsetY = -box.min.y - (box.max.y - box.min.y) * 0.5;
    
    # 頂点情報取り出し
    arr = [];
    i = 0;
    len = txtGeo.faces.length;
    num = 1700;
    vertices = txtGeo.vertices;
    lines = [];
    while i < num
      f = txtGeo.faces[i%len];
      a = vertices[f.a];
      b = vertices[f.b];
      c = vertices[f.c];
      
      if lines[i%len]?
        line = lines[i%len];
      else
        lineA = @getLinearPts(a, b);
        lineB = @getLinearPts(b, c);
        lineC = @getLinearPts(c, a);
        line = lineA.concat(lineB, lineC);
        lines[i%len] = line;
      
      for val,l in line
        arr.push(val.x + offsetX);
        arr.push(val.y + offsetY);
        arr.push(val.z + MY.u.range(100) * 0.005);
      
      i++;
    
    txtGeo.dispose();
    
    # 保存しておく
    @_data[str] = arr;
    
    return arr;
  
  
  
  # -----------------------------------
  # ２点間、等間隔のポイント
  # -----------------------------------
  getLinearPts: (a, b, div) =>
    
    div = div || 0.005;
    
    anm = new Animation();
    anm.set({
      x:{from:a.x, to:b.x},
      y:{from:a.y, to:b.y},
      z:{from:a.z, to:b.z},
      frame:100,
      ease:"bounceOut"
    });
    
    arr = [];
    r = 0;
    while r < 1
      anm.rate(r);
      vec3 = new THREE.Vector3(
        anm.get("x"),
        anm.get("y"),
        anm.get("z")
      );
      arr.push(vec3);
      r += div;
    
    return arr;
















module.exports = FontVertexMgr;