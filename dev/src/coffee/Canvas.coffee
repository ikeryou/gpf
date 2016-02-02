

# ---------------------------------------------------
# GL描画クラス
# ---------------------------------------------------
class Canvas
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: (fontVertex) ->
    
    # フォントデータ
    @_fontVertex = fontVertex;
    
    @_id = "xCanvas";
    
    # canvas
    @_c;
    
    # webglコンテキスト
    @_gl;
    
    @_programs = [];
    
    # マトリクスオブジェクト
    @_mMatrix;
    @_vMatrix;
    @_pMatrix;
    @_vpMatrix;
    @_mvpMatrix;
    @_invMatrix;
    
    # ビュー座標マトリクス用パラメータ
    @_viewParam = {};
    
    # プロジェクション座標マトリクス用パラメータ
    @_projParam = {};
    
    # パーティクルのサイズ
    @_box = {};
    
    # attribute変数として渡す
    
    # 頂点
    @_attVertex = [];
    
    # id ノイズ用
    @_attNoiseId = [];
    
    # id
    @_attId = [];
    
    # 色
    @_attColor = [];
    
    # 特定位置までの距離
    @_attDist = [];
    
    
    # 位置、角度
    @_transform = {
      position:new THREE.Vector3(),
      rotation:new THREE.Vector3()
    };
    
    # ノイズ生成オブジェクト
    @_noise = new ImprovedNoise();
    
    # コールバック 文字変更
    @onChange;
    
    # コールバック 文字選択
    @onSelected;  
  
  
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  init: =>
    
    # canvas
    @_c = document.getElementById(@_id);
    
    # webglコンテキスト
    @_gl = @_c.getContext('webgl') || @_c.getContext('experimental-webgl');
    
    if !@_gl?
      return;
    
    # モデル座標変換用マトリクス
    @_mMatrix = @_getMatrix();
    
    # ビュー座標変換用マトリクス
    @_vMatrix = @_getMatrix();
    
    # ビュー座標マトリクス用パラメータ
    @_viewParam.cameraPosition = [0,0,10]; # カメラ位置
    @_viewParam.centerPoint    = [0,0,0]; # 注視点
    @_viewParam.cameraUp       = [0,1,0]; # カメラの上方向
    
    # ビュー座標変換用マトリクスに反映
    MY.mat.lookAt(@_viewParam.cameraPosition, @_viewParam.centerPoint, @_viewParam.cameraUp, @_vMatrix);
    
    # プロジェクション座標変換用マトリクス
    @_pMatrix = @_getMatrix();
    
    # プロジェクション座標マトリクス用パラメータ
    @_projParam.fovy   = 45;                     # 視野角
    @_projParam.aspect = @_c.width / @_c.height; # アスペクト比
    @_projParam.near   = 0.5;                    # 空間の最前面
    @_projParam.far    = 10000;                  # 空間の奥行き終端
    
    # プロジェクション座標変換用マトリクスに反映
    MY.mat.perspective(@_projParam.fovy, @_projParam.aspect, @_projParam.near, @_projParam.far, @_pMatrix);
    
    # 掛け合わせる用
    @_vpMatrix  = @_getMatrix();
    @_mvpMatrix = @_getMatrix();
    
    # 背景色
    @_gl.clearColor(0,0,0,0);
    @_gl.clearDepth(1);
    
    # アルファブレンディング
    @_gl.enable(@_gl.BLEND);
    @_gl.blendEquationSeparate(@_gl.FUNC_ADD, @_gl.FUNC_ADD);
    @_gl.blendFuncSeparate(@_gl.SRC_ALPHA, @_gl.ONE_MINUS_CONSTANT_COLOR, @_gl.ONE, @_gl.ONE);
    
    # プログラムオブジェクト
    @_programs[0] = @_getProgram(document.getElementById("vs").textContent, document.getElementById("fs").textContent);
    
    # 最初はランダム
    @_attVertex = @_fontVertex.getVertex(@_getRandStr());
    
    # パーティクルオブジェクト作成
    @_makeParticle();
    
    MY.resize.add(@_resize, true);
    MY.update.add(@_update);
    
    if !MY.u.isSmt()
      
      # キーボード入力
      document.onkeydown = @_eKeydown;
      
      # クリックで選択
      $("#" + @_id).on("click", =>
        @_update();
        if @onSelected? then @onSelected(@_c.toDataURL());
      );
  
  
  
  # -----------------------------------
  # パーティクル作成
  # -----------------------------------
  _makeParticle: =>
    
    a = MY.param.b * 0.01;
    b = MY.param.a;
    i = 0;
    len = @_attVertex.length;
    while i < len
      
      key = i/3;
      
      # 頂点ID ノイズ用
      x = @_attVertex[i];
      y = @_attVertex[i+1];
      z = @_attVertex[i+2];
      @_attNoiseId[key] = @_noise.noise(x * a, y * a, z * a) * b;
      
      # 頂点ID
      @_attId[i/3] = key * 0.003;
      
      # カラー HSVのH
      @_attColor[key] = key * 0.01;
      
      i += 3;
    
    MY.param.particleNum = String(len / 3);
    #console.log("particleNum::", @_attVertex.length / 3);
    
    # 頂点ID
    @_setAttrib(@_programs[0], @_attId, "vertexId", 1);
    
    # 頂点ID ノイズ用
    @_setAttrib(@_programs[0], @_attNoiseId, "vertexNoiseId", 1);
    
    # 頂点
    @_setAttrib(@_programs[0], @_attVertex, "position", 3);
    
    # カラー
    @_setAttrib(@_programs[0], @_attColor, "color", 1);
    
    # ボックスの計算
    @_makeParticleBox();
    @_computeDist();
  
  
  
  # -----------------------------------
  # パーティクルのボックス計算
  # -----------------------------------
  _makeParticleBox: =>
    
    minX = 9999;
    maxX = -9999;
    minY = 9999;
    maxY = -9999;
    
    i = 0;
    len = @_attVertex.length;
    while i < len
      x = @_attVertex[i];
      y = @_attVertex[i+1];
      if x > maxX
        maxX = x;
      if x < minX
        minX = x;
      if y > maxY
        maxY = y;
      if y < minY
        minY = y;
      i += 3;
    
    @_box.x = {
      min:minX,
      max:maxX
    };
    
    @_box.y = {
      min:minY,
      max:maxY
    };
    
    dx = @_box.x.min - @_box.x.max;
    dy = @_box.y.min - @_box.y.max;
    @_box.cross = Math.sqrt(dx * dx + dy * dy);
  
  
  
  # -----------------------------------
  # 指定値からの距離
  # -----------------------------------
  _getDist: (x, y, tx, ty) =>
    
    tx = tx || 0;
    ty = ty || 0;
    
    dx = tx - x;
    dy = ty - y;
    d = Math.sqrt(dx * dx + dy * dy);
    
    return MY.u.map(d, 0, 1, 0, @_box.cross * 1);
  
  
  
  # -----------------------------------
  # 指定位置までの距離の計算
  # -----------------------------------
  _computeDist: =>
    
    tgX = @_box.x.min;
    tgY = @_box.y.min;
    tgX = tgY = 0;
    i = 0;
    len = @_attVertex.length;
    while i < len
      x = @_attVertex[i];
      y = @_attVertex[i+1];
      dist = @_getDist(x, y, tgX, tgY);
      @_attDist.push(dist);
      i += 3;
    
    # 渡す
    @_setAttrib(@_programs[0], @_attDist, "dist", 1);
  
  
  
  # -----------------------------------
  # リサイズ
  # -----------------------------------
  _resize: (w, h) =>
    
    w = w || MY.resize.sw();
    h = h || MY.resize.sh();
    
    if window.devicePixelRatio? && window.devicePixelRatio >= 2
      scale1 = 2;
      scale2 = 0.5;
    else
      scale1 = 1;
      scale2 = 1;
    
    # canvasサイズ変更
    @_c.width = w * scale1;
    @_c.height = h * scale1;
    $("#" + @_id).css({
      width:@_c.width * scale2,
      height:@_c.height * scale2
    });
    
    # アスペクト比変更
    if @_gl?
      @_gl.viewport(0, 0, @_c.width, @_c.height);
      @_projParam.aspect = @_c.width / @_c.height;
      MY.mat.identity(@_pMatrix);
      MY.mat.perspective(@_projParam.fovy, @_projParam.aspect, @_projParam.near, @_projParam.far, @_pMatrix);
      MY.mat.multiply(@_pMatrix, @_vMatrix, @_vpMatrix);
  
  
  
  # -----------------------------------
  # update
  # -----------------------------------
  _update: =>
    
    if !@_gl? then return;
    
    # 画面クリア
    @_gl.clear(@_gl.COLOR_BUFFER_BIT | @_gl.DEPTH_BUFFER_BIT);
    MY.mat.identity(@_mMatrix);
    
    e = 0.1;
    
    sw = MY.resize.sw();
    sh = MY.resize.sh();
    
    # 位置
    range = sw * 0.03;
    tx = MY.u.radian(MY.u.map(MY.mouse.x, range, -range, 0, sw));
    ty = MY.u.radian(MY.u.map(MY.mouse.y, -range, range, 0, sh));
    @_transform.position.x += (tx - @_transform.position.x) * e;
    @_transform.position.y += (ty - @_transform.position.y) * e;
    MY.mat.translate(@_mMatrix, [@_transform.position.x,@_transform.position.y,0], @_mMatrix);
    
    # 回転
    rotX = MY.u.radian(MY.u.map(MY.mouse.x, -45, 45, 0, sw));
    rotY = MY.u.radian(MY.u.map(MY.mouse.y, -45, 45, 0, sh));
    @_transform.rotation.x += (rotX - @_transform.rotation.x) * e;
    @_transform.rotation.y += (rotY - @_transform.rotation.y) * e;
    MY.mat.rotate(@_mMatrix, @_transform.rotation.x, [0, 1, 0], @_mMatrix);
    MY.mat.rotate(@_mMatrix, @_transform.rotation.y, [1, 0, 0], @_mMatrix);
    
    # mvpMatrix更新
    MY.mat.multiply(@_pMatrix, @_vMatrix, @_vpMatrix);
    MY.mat.multiply(@_vpMatrix, @_mMatrix, @_mvpMatrix);
    @_setUniform(@_programs[0], @_mvpMatrix, "mvpMatrix", "mat4");
    
    # カウンター
    @_setUniform(@_programs[0], MY.update.cnt, "time", "float");
    
    # 差
    @_setUniform(@_programs[0], MY.param.div1 * 0.01, "div1", "float");
    @_setUniform(@_programs[0], MY.param.div2 * 0.01, "div2", "float");
    
    # 半径
    @_setUniform(@_programs[0], MY.param.radX, "radX", "float");
    @_setUniform(@_programs[0], MY.param.radY, "radY", "float");
    @_setUniform(@_programs[0], MY.param.radZ, "radZ", "float");
    
    # FL
    @_setUniform(@_programs[0], MY.param.fl, "fl", "float");
    
    # 点のサイズ
    @_setUniform(@_programs[0], MY.param.minSize, "minSize", "float");
    @_setUniform(@_programs[0], MY.param.maxSize, "maxSize", "float");
    @_setUniform(@_programs[0], MY.param.pSize * 0.01, "pSize", "float");
    
    # 速度
    @_setUniform(@_programs[0], MY.param.speed * 0.0001, "speed", "float");
    
    # カラーのSV
    @_setUniform(@_programs[0], MY.param.sv, "sv", "float");
    
    # ノイズ使う
    @_setUniform(@_programs[0], MY.param.noise, "useNoise", "int");
    
    # 色オフセット
    @_setUniform(@_programs[0], [MY.param.colorR * 0.01, MY.param.colorG * 0.01, MY.param.colorB * 0.01], "offsetColor", "vec3");
    
    # 描画
    if MY.param.line
      @_gl.drawArrays(@_gl.LINE_STRIP, 0, @_attVertex.length / 3);
    else
      @_gl.drawArrays(@_gl.POINTS, 0, @_attVertex.length / 3);
    
    @_gl.flush();
  
  
  
  # -----------------------------------
  # マトリックスオブジェクト
  # -----------------------------------
  _getMatrix: =>
    
    return MY.mat.identity(MY.mat.create());
  
  
  
  # -----------------------------------
  # プログラムオブジェクト作成
  # -----------------------------------
  _getProgram: (vertexSource, fragmentSource) =>
    
    vertexShader   = @_gl.createShader(@_gl.VERTEX_SHADER);
    fragmentShader = @_gl.createShader(@_gl.FRAGMENT_SHADER);
    
    programs = @_gl.createProgram();
    @_gl.shaderSource(vertexShader, vertexSource);
    @_gl.compileShader(vertexShader);
    @_gl.attachShader(programs, vertexShader);
    
    if !@_gl.getShaderParameter(vertexShader, @_gl.COMPILE_STATUS)
      console.log("vertexShader error =====================");
      console.log(@_gl.getShaderInfoLog(vertexShader));
      console.log("========================================");
    
    @_gl.shaderSource(fragmentShader, fragmentSource);
    @_gl.compileShader(fragmentShader);
    @_gl.attachShader(programs, fragmentShader);
    
    if !@_gl.getShaderParameter(fragmentShader, @_gl.COMPILE_STATUS)
      console.log("fragmentShader error ===================");
      console.log(@_gl.getShaderInfoLog(fragmentShader));
      console.log("========================================");
    
    @_gl.linkProgram(programs);
    
    if !@_gl.getProgramParameter(programs, @_gl.LINK_STATUS)
      console.log("program error ==========================");
      console.log(@_gl.getProgramInfoLog(programs));
      console.log("========================================");
    
    @_gl.useProgram(programs);
    
    return programs;
  
  
  
  # -----------------------------------
  # attribute変数登録
  # -----------------------------------
  _setAttrib: (programs, arr, name, num) =>
    
    buffer = @_gl.createBuffer();
    @_gl.bindBuffer(@_gl.ARRAY_BUFFER, buffer);
    @_gl.bufferData(@_gl.ARRAY_BUFFER, new Float32Array(arr), @_gl.STATIC_DRAW);
    
    loc = @_gl.getAttribLocation(programs, name);
    @_gl.enableVertexAttribArray(loc);
    @_gl.vertexAttribPointer(loc, num, @_gl.FLOAT, false, 0, 0);
  
  
  
  # -----------------------------------
  # uniform変数登録
  # -----------------------------------
  _setUniform: (programs, obj, name, type) =>
    
    uniLocation = @_gl.getUniformLocation(programs, name);
  
    switch type
      when "mat4"
        @_gl.uniformMatrix4fv(uniLocation, false, obj);
      
      when "vec3"
        @_gl.uniform3fv(uniLocation, obj);
      
      when "vec4"
        @_gl.uniform4fv(uniLocation, obj);
      
      when "int"
        @_gl.uniform1i(uniLocation, obj);
      
      when "float"
        @_gl.uniform1f(uniLocation, obj);
  
  
  
  # -----------------------------------
  # イベント キーボード入力した
  # -----------------------------------
  _eKeydown: (e) =>
    
    str = MY.conf.KEY_TABLE[String(e.keyCode)];
    
    # 文字切り替え
    if str? then @_setStr(str);
  
  
  
  # -----------------------------------
  # 文字切り替え
  # -----------------------------------
  _setStr: (str) =>
    
    # 頂点差し替え
    @_attVertex = @_fontVertex.getVertex(str);
    
    # att変数更新
    @_makeParticle();
    #@_setAttrib(@_programs[0], @_attVertex, "position", 3);
    
    
    @_update();
    
    if @onChange? then @onChange();
  
  
  
  # -----------------------------------
  # ランダムな文字
  # -----------------------------------
  _getRandStr: =>
    
    arr = [];
    for key,val of MY.conf.KEY_TABLE
      arr.push(val);
    
    return MY.u.arrRand(arr);







module.exports = Canvas;