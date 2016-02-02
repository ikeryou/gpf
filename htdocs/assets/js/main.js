(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var About, Display,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Display = require('./libs/display/Display');

About = (function(superClass) {
  extend(About, superClass);

  function About() {
    this._update = bind(this._update, this);
    this._resize = bind(this._resize, this);
    this.btnVisible = bind(this.btnVisible, this);
    this.init = bind(this.init, this);
    About.__super__.constructor.call(this, {
      id: "xAbout"
    });
    this._ttl;
    this._capPc;
    this._capSmt;
    this._saveBtn;
    this._resetBtn;
    this.onClickSave;
    this.onClickReset;
  }

  About.prototype.init = function() {
    About.__super__.init.call(this);
    this.elm().removeClass("hide");
    this._ttl = new Display({
      id: "xTitle"
    });
    this._ttl.init();
    this._capPc = new Display({
      id: "xCaptionPc"
    });
    this._capPc.init();
    this._capSmt = new Display({
      id: "xCaptionSmt"
    });
    this._capSmt.init();
    this._saveBtn = new Display({
      id: "xSave"
    });
    this._saveBtn.init();
    this._saveBtn.elm().on("click", (function(_this) {
      return function() {
        if (_this.onClickSave != null) {
          return _this.onClickSave();
        }
      };
    })(this));
    this._resetBtn = new Display({
      id: "xReset"
    });
    this._resetBtn.init();
    this._resetBtn.elm().on("click", (function(_this) {
      return function() {
        if (_this.onClickReset != null) {
          return _this.onClickReset();
        }
      };
    })(this));
    if (MY.u.isSmt()) {
      this.btnVisible(false);
      this._capPc.visible(false);
      this._capPc.render();
    } else {
      this._capSmt.visible(false);
      this._capSmt.render();
    }
    MY.resize.add(this._resize, true);
    return MY.update.add(this._update);
  };

  About.prototype.btnVisible = function(bool) {
    if (MY.u.isSmt() && bool) {
      bool = false;
    }
    this._saveBtn.visible(bool);
    this._saveBtn.render();
    this._resetBtn.visible(bool);
    return this._resetBtn.render();
  };

  About.prototype._resize = function(w, h) {
    w = w || MY.resize.sw();
    h = h || MY.resize.sh();
    this._ttl.xy(MY.f.v(50, 25), MY.f.v(50, 25));
    this._ttl.render();
    this._capPc.xy(this._ttl.x(), this._ttl.bottom() + MY.f.v(40, 20));
    this._capPc.render();
    this._capSmt.xy(this._ttl.x(), this._ttl.bottom() + MY.f.v(40, 20));
    this._capSmt.render();
    this._saveBtn.xy(this._ttl.x(), Math.max(this._capPc.bottom(), this._capSmt.bottom()) + MY.f.v(20, 20));
    this._saveBtn.render();
    this._resetBtn.xy(this._saveBtn.right() + 30, this._saveBtn.y());
    return this._resetBtn.render();
  };

  About.prototype._update = function() {};

  return About;

})(Display);

module.exports = About;


},{"./libs/display/Display":16}],2:[function(require,module,exports){
var Canvas,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Canvas = (function() {
  function Canvas(fontVertex) {
    this._getRandStr = bind(this._getRandStr, this);
    this._setStr = bind(this._setStr, this);
    this._eKeydown = bind(this._eKeydown, this);
    this._setUniform = bind(this._setUniform, this);
    this._setAttrib = bind(this._setAttrib, this);
    this._getProgram = bind(this._getProgram, this);
    this._getMatrix = bind(this._getMatrix, this);
    this._update = bind(this._update, this);
    this._resize = bind(this._resize, this);
    this._computeDist = bind(this._computeDist, this);
    this._getDist = bind(this._getDist, this);
    this._makeParticleBox = bind(this._makeParticleBox, this);
    this._makeParticle = bind(this._makeParticle, this);
    this.init = bind(this.init, this);
    this._fontVertex = fontVertex;
    this._id = "xCanvas";
    this._c;
    this._gl;
    this._programs = [];
    this._mMatrix;
    this._vMatrix;
    this._pMatrix;
    this._vpMatrix;
    this._mvpMatrix;
    this._invMatrix;
    this._viewParam = {};
    this._projParam = {};
    this._box = {};
    this._attVertex = [];
    this._attNoiseId = [];
    this._attId = [];
    this._attColor = [];
    this._attDist = [];
    this._transform = {
      position: new THREE.Vector3(),
      rotation: new THREE.Vector3()
    };
    this._noise = new ImprovedNoise();
    this.onChange;
    this.onSelected;
  }

  Canvas.prototype.init = function() {
    this._c = document.getElementById(this._id);
    this._gl = this._c.getContext('webgl') || this._c.getContext('experimental-webgl');
    if (this._gl == null) {
      return;
    }
    this._mMatrix = this._getMatrix();
    this._vMatrix = this._getMatrix();
    this._viewParam.cameraPosition = [0, 0, 10];
    this._viewParam.centerPoint = [0, 0, 0];
    this._viewParam.cameraUp = [0, 1, 0];
    MY.mat.lookAt(this._viewParam.cameraPosition, this._viewParam.centerPoint, this._viewParam.cameraUp, this._vMatrix);
    this._pMatrix = this._getMatrix();
    this._projParam.fovy = 45;
    this._projParam.aspect = this._c.width / this._c.height;
    this._projParam.near = 0.5;
    this._projParam.far = 10000;
    MY.mat.perspective(this._projParam.fovy, this._projParam.aspect, this._projParam.near, this._projParam.far, this._pMatrix);
    this._vpMatrix = this._getMatrix();
    this._mvpMatrix = this._getMatrix();
    this._gl.clearColor(0, 0, 0, 0);
    this._gl.clearDepth(1);
    this._gl.enable(this._gl.BLEND);
    this._gl.blendEquationSeparate(this._gl.FUNC_ADD, this._gl.FUNC_ADD);
    this._gl.blendFuncSeparate(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_CONSTANT_COLOR, this._gl.ONE, this._gl.ONE);
    this._programs[0] = this._getProgram(document.getElementById("vs").textContent, document.getElementById("fs").textContent);
    this._attVertex = this._fontVertex.getVertex(this._getRandStr());
    this._makeParticle();
    MY.resize.add(this._resize, true);
    MY.update.add(this._update);
    if (!MY.u.isSmt()) {
      document.onkeydown = this._eKeydown;
      return $("#" + this._id).on("click", (function(_this) {
        return function() {
          _this._update();
          if (_this.onSelected != null) {
            return _this.onSelected(_this._c.toDataURL());
          }
        };
      })(this));
    }
  };

  Canvas.prototype._makeParticle = function() {
    var a, b, i, key, len, x, y, z;
    a = MY.param.b * 0.01;
    b = MY.param.a;
    i = 0;
    len = this._attVertex.length;
    while (i < len) {
      key = i / 3;
      x = this._attVertex[i];
      y = this._attVertex[i + 1];
      z = this._attVertex[i + 2];
      this._attNoiseId[key] = this._noise.noise(x * a, y * a, z * a) * b;
      this._attId[i / 3] = key * 0.003;
      this._attColor[key] = key * 0.01;
      i += 3;
    }
    MY.param.particleNum = String(len / 3);
    this._setAttrib(this._programs[0], this._attId, "vertexId", 1);
    this._setAttrib(this._programs[0], this._attNoiseId, "vertexNoiseId", 1);
    this._setAttrib(this._programs[0], this._attVertex, "position", 3);
    this._setAttrib(this._programs[0], this._attColor, "color", 1);
    this._makeParticleBox();
    return this._computeDist();
  };

  Canvas.prototype._makeParticleBox = function() {
    var dx, dy, i, len, maxX, maxY, minX, minY, x, y;
    minX = 9999;
    maxX = -9999;
    minY = 9999;
    maxY = -9999;
    i = 0;
    len = this._attVertex.length;
    while (i < len) {
      x = this._attVertex[i];
      y = this._attVertex[i + 1];
      if (x > maxX) {
        maxX = x;
      }
      if (x < minX) {
        minX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
      if (y < minY) {
        minY = y;
      }
      i += 3;
    }
    this._box.x = {
      min: minX,
      max: maxX
    };
    this._box.y = {
      min: minY,
      max: maxY
    };
    dx = this._box.x.min - this._box.x.max;
    dy = this._box.y.min - this._box.y.max;
    return this._box.cross = Math.sqrt(dx * dx + dy * dy);
  };

  Canvas.prototype._getDist = function(x, y, tx, ty) {
    var d, dx, dy;
    tx = tx || 0;
    ty = ty || 0;
    dx = tx - x;
    dy = ty - y;
    d = Math.sqrt(dx * dx + dy * dy);
    return MY.u.map(d, 0, 1, 0, this._box.cross * 1);
  };

  Canvas.prototype._computeDist = function() {
    var dist, i, len, tgX, tgY, x, y;
    tgX = this._box.x.min;
    tgY = this._box.y.min;
    tgX = tgY = 0;
    i = 0;
    len = this._attVertex.length;
    while (i < len) {
      x = this._attVertex[i];
      y = this._attVertex[i + 1];
      dist = this._getDist(x, y, tgX, tgY);
      this._attDist.push(dist);
      i += 3;
    }
    return this._setAttrib(this._programs[0], this._attDist, "dist", 1);
  };

  Canvas.prototype._resize = function(w, h) {
    var scale1, scale2;
    w = w || MY.resize.sw();
    h = h || MY.resize.sh();
    if ((window.devicePixelRatio != null) && window.devicePixelRatio >= 2) {
      scale1 = 2;
      scale2 = 0.5;
    } else {
      scale1 = 1;
      scale2 = 1;
    }
    this._c.width = w * scale1;
    this._c.height = h * scale1;
    $("#" + this._id).css({
      width: this._c.width * scale2,
      height: this._c.height * scale2
    });
    if (this._gl != null) {
      this._gl.viewport(0, 0, this._c.width, this._c.height);
      this._projParam.aspect = this._c.width / this._c.height;
      MY.mat.identity(this._pMatrix);
      MY.mat.perspective(this._projParam.fovy, this._projParam.aspect, this._projParam.near, this._projParam.far, this._pMatrix);
      return MY.mat.multiply(this._pMatrix, this._vMatrix, this._vpMatrix);
    }
  };

  Canvas.prototype._update = function() {
    var e, range, rotX, rotY, sh, sw, tx, ty;
    if (this._gl == null) {
      return;
    }
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    MY.mat.identity(this._mMatrix);
    e = 0.1;
    sw = MY.resize.sw();
    sh = MY.resize.sh();
    range = sw * 0.03;
    tx = MY.u.radian(MY.u.map(MY.mouse.x, range, -range, 0, sw));
    ty = MY.u.radian(MY.u.map(MY.mouse.y, -range, range, 0, sh));
    this._transform.position.x += (tx - this._transform.position.x) * e;
    this._transform.position.y += (ty - this._transform.position.y) * e;
    MY.mat.translate(this._mMatrix, [this._transform.position.x, this._transform.position.y, 0], this._mMatrix);
    rotX = MY.u.radian(MY.u.map(MY.mouse.x, -45, 45, 0, sw));
    rotY = MY.u.radian(MY.u.map(MY.mouse.y, -45, 45, 0, sh));
    this._transform.rotation.x += (rotX - this._transform.rotation.x) * e;
    this._transform.rotation.y += (rotY - this._transform.rotation.y) * e;
    MY.mat.rotate(this._mMatrix, this._transform.rotation.x, [0, 1, 0], this._mMatrix);
    MY.mat.rotate(this._mMatrix, this._transform.rotation.y, [1, 0, 0], this._mMatrix);
    MY.mat.multiply(this._pMatrix, this._vMatrix, this._vpMatrix);
    MY.mat.multiply(this._vpMatrix, this._mMatrix, this._mvpMatrix);
    this._setUniform(this._programs[0], this._mvpMatrix, "mvpMatrix", "mat4");
    this._setUniform(this._programs[0], MY.update.cnt, "time", "float");
    this._setUniform(this._programs[0], MY.param.div1 * 0.01, "div1", "float");
    this._setUniform(this._programs[0], MY.param.div2 * 0.01, "div2", "float");
    this._setUniform(this._programs[0], MY.param.radX, "radX", "float");
    this._setUniform(this._programs[0], MY.param.radY, "radY", "float");
    this._setUniform(this._programs[0], MY.param.radZ, "radZ", "float");
    this._setUniform(this._programs[0], MY.param.fl, "fl", "float");
    this._setUniform(this._programs[0], MY.param.minSize, "minSize", "float");
    this._setUniform(this._programs[0], MY.param.maxSize, "maxSize", "float");
    this._setUniform(this._programs[0], MY.param.pSize * 0.01, "pSize", "float");
    this._setUniform(this._programs[0], MY.param.speed * 0.0001, "speed", "float");
    this._setUniform(this._programs[0], MY.param.sv, "sv", "float");
    this._setUniform(this._programs[0], MY.param.noise, "useNoise", "int");
    this._setUniform(this._programs[0], [MY.param.colorR * 0.01, MY.param.colorG * 0.01, MY.param.colorB * 0.01], "offsetColor", "vec3");
    if (MY.param.line) {
      this._gl.drawArrays(this._gl.LINE_STRIP, 0, this._attVertex.length / 3);
    } else {
      this._gl.drawArrays(this._gl.POINTS, 0, this._attVertex.length / 3);
    }
    return this._gl.flush();
  };

  Canvas.prototype._getMatrix = function() {
    return MY.mat.identity(MY.mat.create());
  };

  Canvas.prototype._getProgram = function(vertexSource, fragmentSource) {
    var fragmentShader, programs, vertexShader;
    vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
    fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);
    programs = this._gl.createProgram();
    this._gl.shaderSource(vertexShader, vertexSource);
    this._gl.compileShader(vertexShader);
    this._gl.attachShader(programs, vertexShader);
    if (!this._gl.getShaderParameter(vertexShader, this._gl.COMPILE_STATUS)) {
      console.log("vertexShader error =====================");
      console.log(this._gl.getShaderInfoLog(vertexShader));
      console.log("========================================");
    }
    this._gl.shaderSource(fragmentShader, fragmentSource);
    this._gl.compileShader(fragmentShader);
    this._gl.attachShader(programs, fragmentShader);
    if (!this._gl.getShaderParameter(fragmentShader, this._gl.COMPILE_STATUS)) {
      console.log("fragmentShader error ===================");
      console.log(this._gl.getShaderInfoLog(fragmentShader));
      console.log("========================================");
    }
    this._gl.linkProgram(programs);
    if (!this._gl.getProgramParameter(programs, this._gl.LINK_STATUS)) {
      console.log("program error ==========================");
      console.log(this._gl.getProgramInfoLog(programs));
      console.log("========================================");
    }
    this._gl.useProgram(programs);
    return programs;
  };

  Canvas.prototype._setAttrib = function(programs, arr, name, num) {
    var buffer, loc;
    buffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(arr), this._gl.STATIC_DRAW);
    loc = this._gl.getAttribLocation(programs, name);
    this._gl.enableVertexAttribArray(loc);
    return this._gl.vertexAttribPointer(loc, num, this._gl.FLOAT, false, 0, 0);
  };

  Canvas.prototype._setUniform = function(programs, obj, name, type) {
    var uniLocation;
    uniLocation = this._gl.getUniformLocation(programs, name);
    switch (type) {
      case "mat4":
        return this._gl.uniformMatrix4fv(uniLocation, false, obj);
      case "vec3":
        return this._gl.uniform3fv(uniLocation, obj);
      case "vec4":
        return this._gl.uniform4fv(uniLocation, obj);
      case "int":
        return this._gl.uniform1i(uniLocation, obj);
      case "float":
        return this._gl.uniform1f(uniLocation, obj);
    }
  };

  Canvas.prototype._eKeydown = function(e) {
    var str;
    str = MY.conf.KEY_TABLE[String(e.keyCode)];
    if (str != null) {
      return this._setStr(str);
    }
  };

  Canvas.prototype._setStr = function(str) {
    this._attVertex = this._fontVertex.getVertex(str);
    this._makeParticle();
    this._update();
    if (this.onChange != null) {
      return this.onChange();
    }
  };

  Canvas.prototype._getRandStr = function() {
    var arr, key, ref, val;
    arr = [];
    ref = MY.conf.KEY_TABLE;
    for (key in ref) {
      val = ref[key];
      arr.push(val);
    }
    return MY.u.arrRand(arr);
  };

  return Canvas;

})();

module.exports = Canvas;


},{}],3:[function(require,module,exports){
var Conf;

Conf = (function() {
  function Conf() {
    var key, ref, val;
    this.RELEASE = false;
    this.FLG = {
      LOG: false,
      PARAM: true,
      STATS: false
    };
    if (this.RELEASE) {
      ref = this.FLG;
      for (key in ref) {
        val = ref[key];
        this.FLG[key] = false;
      }
    }
    this.KEY_TABLE = {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "65": "A",
      "66": "B",
      "67": "C",
      "68": "D",
      "69": "E",
      "70": "F",
      "71": "G",
      "72": "H",
      "73": "I",
      "74": "J",
      "75": "K",
      "76": "L",
      "77": "M",
      "78": "N",
      "79": "O",
      "80": "P",
      "81": "Q",
      "82": "R",
      "83": "S",
      "84": "T",
      "85": "U",
      "86": "V",
      "87": "W",
      "88": "X",
      "89": "Y",
      "90": "Z"
    };
  }

  return Conf;

})();

module.exports = Conf;


},{}],4:[function(require,module,exports){
var About, Canvas, Contents, FontVertexMgr, Loading, MakedImg,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Canvas = require('./Canvas');

FontVertexMgr = require('./FontVertexMgr');

MakedImg = require('./MakedImg');

About = require('./About');

Loading = require('./Loading');

Contents = (function() {
  function Contents() {
    this._eReset = bind(this._eReset, this);
    this._eSave = bind(this._eSave, this);
    this._eSelectedFont = bind(this._eSelectedFont, this);
    this._eChangeFont = bind(this._eChangeFont, this);
    this._eCompleteData = bind(this._eCompleteData, this);
    this._eProgressData = bind(this._eProgressData, this);
    this.init = bind(this.init, this);
    this._vertexData;
    this._loading;
    this._canvas;
    this._about;
    this._makedImg;
  }

  Contents.prototype.init = function() {
    if (MY.u.isSmt()) {
      $(".dg").css({
        display: "none"
      });
    }
    this._vertexData = new FontVertexMgr();
    this._vertexData.init();
    if (!MY.u.isSmt()) {
      this._loading = new Loading();
      this._loading.init();
      this._vertexData.onProgress = this._eProgressData;
      this._vertexData.onComplete = this._eCompleteData;
      return this._vertexData.load();
    } else {
      return this._eCompleteData();
    }
  };

  Contents.prototype._eProgressData = function(rate) {
    return this._loading.update(rate);
  };

  Contents.prototype._eCompleteData = function() {
    if (this._loading != null) {
      this._loading.dispose();
      this._loading = null;
    }
    this._canvas = new Canvas(this._vertexData);
    this._canvas.init();
    this._canvas.onChange = this._eChangeFont;
    this._canvas.onSelected = this._eSelectedFont;
    this._makedImg = new MakedImg();
    this._makedImg.init();
    this._about = new About();
    this._about.init();
    this._about.onClickSave = this._eSave;
    this._about.onClickReset = this._eReset;
    return this._about.btnVisible(false);
  };

  Contents.prototype._eChangeFont = function() {};

  Contents.prototype._eSelectedFont = function(url) {
    this._about.btnVisible(true);
    return this._makedImg.add(url);
  };

  Contents.prototype._eSave = function() {
    return this._makedImg.save();
  };

  Contents.prototype._eReset = function() {
    this._about.btnVisible(false);
    return this._makedImg.reset();
  };

  return Contents;

})();

module.exports = Contents;


},{"./About":1,"./Canvas":2,"./FontVertexMgr":5,"./Loading":7,"./MakedImg":9}],5:[function(require,module,exports){
var Animation, FontVertexMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Animation = require('./libs/animation/Animation');

FontVertexMgr = (function() {
  function FontVertexMgr() {
    this.getLinearPts = bind(this.getLinearPts, this);
    this.getVertex = bind(this.getVertex, this);
    this._update = bind(this._update, this);
    this.load = bind(this.load, this);
    this.init = bind(this.init, this);
    this._data = {};
    this._loadList = [];
    this._loadListNow = 0;
    this.onProgress;
    this.onComplete;
  }

  FontVertexMgr.prototype.init = function() {};

  FontVertexMgr.prototype.load = function() {
    var key, ref, val;
    ref = MY.conf.KEY_TABLE;
    for (key in ref) {
      val = ref[key];
      if (Number(key) > 89) {
        this._loadList.push(val);
      }
    }
    this._loadListNow = 0;
    return MY.update.add(this._update);
  };

  FontVertexMgr.prototype._update = function() {
    var arr;
    arr = this.getVertex(this._loadList[this._loadListNow]);
    this._loadListNow++;
    if (this._loadListNow >= this._loadList.length) {
      if (this.onComplete != null) {
        this.onComplete();
      }
      return MY.update.remove(this._update);
    } else {
      if (this.onProgress != null) {
        return this.onProgress((this._loadListNow + 1) / this._loadList.length);
      }
    }
  };

  FontVertexMgr.prototype.getVertex = function(str) {
    var a, arr, b, box, c, f, i, j, l, len, len1, line, lineA, lineB, lineC, lines, num, offsetX, offsetY, txtGeo, val, vertices;
    if (this._data[str] != null) {
      return this._data[str];
    }
    txtGeo = new THREE.TextGeometry(str, {
      size: 6,
      height: 0,
      curveSegments: 1,
      font: "helvetiker",
      weight: "bold"
    });
    txtGeo.computeBoundingBox();
    box = txtGeo.boundingBox;
    offsetX = -box.min.x - (box.max.x - box.min.x) * 0.5;
    offsetY = -box.min.y - (box.max.y - box.min.y) * 0.5;
    arr = [];
    i = 0;
    len = txtGeo.faces.length;
    num = 1700;
    vertices = txtGeo.vertices;
    lines = [];
    while (i < num) {
      f = txtGeo.faces[i % len];
      a = vertices[f.a];
      b = vertices[f.b];
      c = vertices[f.c];
      if (lines[i % len] != null) {
        line = lines[i % len];
      } else {
        lineA = this.getLinearPts(a, b);
        lineB = this.getLinearPts(b, c);
        lineC = this.getLinearPts(c, a);
        line = lineA.concat(lineB, lineC);
        lines[i % len] = line;
      }
      for (l = j = 0, len1 = line.length; j < len1; l = ++j) {
        val = line[l];
        arr.push(val.x + offsetX);
        arr.push(val.y + offsetY);
        arr.push(val.z + MY.u.range(100) * 0.005);
      }
      i++;
    }
    txtGeo.dispose();
    this._data[str] = arr;
    return arr;
  };

  FontVertexMgr.prototype.getLinearPts = function(a, b, div) {
    var anm, arr, r, vec3;
    div = div || 0.005;
    anm = new Animation();
    anm.set({
      x: {
        from: a.x,
        to: b.x
      },
      y: {
        from: a.y,
        to: b.y
      },
      z: {
        from: a.z,
        to: b.z
      },
      frame: 100,
      ease: "bounceOut"
    });
    arr = [];
    r = 0;
    while (r < 1) {
      anm.rate(r);
      vec3 = new THREE.Vector3(anm.get("x"), anm.get("y"), anm.get("z"));
      arr.push(vec3);
      r += div;
    }
    return arr;
  };

  return FontVertexMgr;

})();

module.exports = FontVertexMgr;


},{"./libs/animation/Animation":14}],6:[function(require,module,exports){
var Func,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

Func = (function() {
  function Func() {
    this.v = bind(this.v, this);
    this.log = bind(this.log, this);
    this.canvasSize = bind(this.canvasSize, this);
  }

  Func.prototype.canvasSize = function(canvas, w, h) {
    canvas.width = w;
    canvas.height = h;
    return $("#" + canvas.id).css({
      width: w,
      height: h
    });
  };

  Func.prototype.log = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (MY.conf.FLG.LOG) {
      if ((typeof console !== "undefined" && console !== null) && (console.log != null)) {
        return console.log.apply(console, params);
      }
    }
  };

  Func.prototype.v = function(valPC, valSMT) {
    if (MY.u.isSmt()) {
      return valSMT;
    } else {
      return valPC;
    }
  };

  return Func;

})();

module.exports = Func;


},{}],7:[function(require,module,exports){
var Display, Loading,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Display = require('./libs/display/Display');

Loading = (function(superClass) {
  extend(Loading, superClass);

  function Loading() {
    this.dispose = bind(this.dispose, this);
    this._resize = bind(this._resize, this);
    this.update = bind(this.update, this);
    this.init = bind(this.init, this);
    Loading.__super__.constructor.call(this);
    this._bar;
    this._rate = 0;
  }

  Loading.prototype.init = function() {
    Loading.__super__.init.call(this);
    this._bar = new Display();
    this._bar.init();
    this.add(this._bar);
    this._bar.bgColor("#FFF");
    this._bar.render();
    return MY.resize.add(this._resize, true);
  };

  Loading.prototype.update = function(rate) {
    this._rate = rate;
    return this._resize();
  };

  Loading.prototype._resize = function(w, h) {
    w = w || MY.resize.sw();
    h = h || MY.resize.sh();
    this._bar.size(w * this._rate, 10);
    this._bar.xy(0, ~~(h * 0.5 - this._bar.height() * 0.5));
    return this._bar.render();
  };

  Loading.prototype.dispose = function() {
    MY.resize.remove(this._resize);
    if (this._bar != null) {
      this._bar.dispose();
      this._bar = null;
    }
    return Loading.__super__.dispose.call(this);
  };

  return Loading;

})(Display);

module.exports = Loading;


},{"./libs/display/Display":16}],8:[function(require,module,exports){
var Conf, Contents, DelayMgr, Func, Main, Mouse, Param, Profiler, ResizeMgr, UpdateMgr, Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

UpdateMgr = require('./libs/mgr/UpdateMgr');

ResizeMgr = require('./libs/mgr/ResizeMgr');

DelayMgr = require('./libs/mgr/DelayMgr');

Utils = require('./libs/Utils');

Contents = require('./Contents');

Conf = require('./Conf');

Func = require('./Func');

Param = require('./Param');

Profiler = require('./Profiler');

Mouse = require('./Mouse');

Main = (function() {
  function Main() {
    this._update = bind(this._update, this);
    this.init = bind(this.init, this);
  }

  Main.prototype.init = function() {
    window.MY = {};
    MY.conf = new Conf();
    MY.u = new Utils();
    MY.update = new UpdateMgr();
    MY.update.add(this._update);
    MY.resize = new ResizeMgr();
    MY.delay = new DelayMgr();
    MY.f = new Func();
    MY.param = new Param();
    MY.profiler = new Profiler();
    MY.mouse = new Mouse();
    MY.mat = new matIV();
    MY.c = new Contents();
    return MY.c.init();
  };

  Main.prototype._update = function() {
    return MY.delay.update();
  };

  return Main;

})();

$(window).ready((function(_this) {
  return function() {
    var app;
    app = new Main();
    app.init();
    return window.MY.main = app;
  };
})(this));


},{"./Conf":3,"./Contents":4,"./Func":6,"./Mouse":10,"./Param":11,"./Profiler":12,"./libs/Utils":13,"./libs/mgr/DelayMgr":19,"./libs/mgr/ResizeMgr":20,"./libs/mgr/UpdateMgr":21}],9:[function(require,module,exports){
var DisplayTransform, MakedImg, Point, Rect,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

DisplayTransform = require('./libs/display/DisplayTransform');

Point = require('./libs/object/Point');

Rect = require('./libs/object/Rect');

MakedImg = (function() {
  function MakedImg() {
    this._update = bind(this._update, this);
    this._resize = bind(this._resize, this);
    this._getSize = bind(this._getSize, this);
    this.draw = bind(this.draw, this);
    this._eLoadedImg = bind(this._eLoadedImg, this);
    this.add = bind(this.add, this);
    this.save = bind(this.save, this);
    this.reset = bind(this.reset, this);
    this.init = bind(this.init, this);
    this._canvas;
    this._ctx;
    this._display;
    this._images = [];
    this._effect;
    this._effectParam = {
      tOpacity: 0,
      opacity: 0
    };
    this._opacity = 1;
    this._mouseBuffer = new Point();
    this._stopMouseCnt = 0;
    this._zure = 0.3;
  }

  MakedImg.prototype.init = function() {
    this._canvas = document.getElementById("xMakedImg");
    this._ctx = this._canvas.getContext("2d");
    this._display = new DisplayTransform({
      id: "xMakedImg"
    });
    this._display.init();
    this._effect = new DisplayTransform({
      id: "xMakedImgEffect"
    });
    this._effect.init();
    this._effect.bgColor("#FFF");
    MY.resize.add(this._resize, true);
    return MY.update.add(this._update);
  };

  MakedImg.prototype.reset = function() {
    this._images = null;
    this._images = [];
    return MY.f.canvasSize(this._canvas, 0, 0);
  };

  MakedImg.prototype.save = function() {
    var url;
    url = this._canvas.toDataURL();
    return window.open(url);
  };

  MakedImg.prototype.add = function(url) {
    var img;
    img = new Image();
    img.makedImgId = this._images.length;
    img.onload = this._eLoadedImg;
    this._images.push(img);
    return img.src = url;
  };

  MakedImg.prototype._eLoadedImg = function(e) {
    var img;
    img = this._images[e.path[0].makedImgId];
    if (img != null) {
      this._effectParam.opacity = 1;
      return this.draw();
    }
  };

  MakedImg.prototype.draw = function() {
    var h, i, j, last, len, ref, scale, size, val, w, x;
    size = this._getSize();
    MY.f.canvasSize(this._canvas, size.w, size.h);
    this._ctx.fillStyle = "rgb(0, 0, 0)";
    this._ctx.fillRect(0, 0, size.w, size.h);
    x = 0;
    last = new Rect();
    ref = this._images;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val.complete) {
        last.x = x;
        last.y = ~~(size.h * 0.5 - val.height * 0.5);
        last.w = val.width;
        last.h = val.height;
        this._ctx.drawImage(val, last.x, last.y, last.w, last.h);
        x += val.width - val.width * this._zure;
      }
    }
    w = MY.resize.sw();
    h = size.h * (w / size.w);
    if (h > MY.resize.sh()) {
      h = MY.resize.sh();
      w = size.w * (h / size.h);
    }
    scale = w / size.w;
    this._display.pivot("0px 0px");
    this._display.size(size.w, size.h);
    this._display.scale(scale, scale);
    this._display.xy(0, ~~(MY.resize.sh() * 0.5 - h * 0.5));
    this._display.render();
    this._effect.size(last.w * scale, last.h * scale);
    this._effect.xy(last.x * scale, this._display.y() + last.y * scale);
    return this._effect.render();
  };

  MakedImg.prototype._getSize = function() {
    var h, i, j, len, ref, val, w;
    w = 0;
    h = 0;
    ref = this._images;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val.complete) {
        w += val.width - val.width * this._zure;
        h = Math.max(h, val.height);
      }
    }
    if (val != null) {
      w += val.width * this._zure;
    }
    return {
      w: w,
      h: h
    };
  };

  MakedImg.prototype._resize = function(w, h) {
    w = w || MY.resize.sw();
    h = h || MY.resize.sh();
    return this.draw();
  };

  MakedImg.prototype._update = function() {
    var isAddOp, opSpeed;
    this._effectParam.opacity += (0 - this._effectParam.opacity) * 0.5;
    this._effect.opacity(this._effectParam.opacity);
    this._effect.render();
    opSpeed = 0.03;
    isAddOp = false;
    if (this._mouseBuffer.x === MY.mouse.x && this._mouseBuffer.y === MY.mouse.y) {
      if (++this._stopMouseCnt >= 30) {
        isAddOp = true;
      }
    } else {
      this._stopMouseCnt = 0;
    }
    if (isAddOp) {
      if ((this._opacity += opSpeed) >= 1) {
        this._opacity = 1;
      }
    } else {
      if ((this._opacity -= opSpeed) < 0.4) {
        this._opacity = 0.4;
      }
    }
    this._display.opacity(this._opacity);
    this._display.render();
    this._mouseBuffer.x = MY.mouse.x;
    return this._mouseBuffer.y = MY.mouse.y;
  };

  return MakedImg;

})();

module.exports = MakedImg;


},{"./libs/display/DisplayTransform":17,"./libs/object/Point":22,"./libs/object/Rect":23}],10:[function(require,module,exports){
var Mouse,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Mouse = (function() {
  function Mouse() {
    this.dist = bind(this.dist, this);
    this._eMouseMove = bind(this._eMouseMove, this);
    this._init = bind(this._init, this);
    this.x = 0;
    this.y = 0;
    this.oldX = 0;
    this.oldY = 0;
    this._init();
  }

  Mouse.prototype._init = function() {
    if (MY.u.isSmt()) {
      $(window).on("touchmove", this._eMouseMove);
      this.x = MY.resize.sw() * 0.5;
      this.y = MY.resize.sh() * 0.5;
      return $(window).on('touchmove.noScroll', (function(_this) {
        return function(e) {
          return e.preventDefault();
        };
      })(this));
    } else {
      return $(window).on("mousemove", this._eMouseMove);
    }
  };

  Mouse.prototype._eMouseMove = function(e) {
    var touches;
    this.oldX = this.x;
    this.oldY = this.y;
    if (MY.u.isSmt()) {
      touches = event.touches;
      event.preventDefault();
      if ((touches != null) && touches.length > 0) {
        this.x = touches[0].pageX;
        return this.y = touches[0].pageY;
      }
    } else {
      this.x = e.clientX;
      return this.y = e.clientY;
    }
  };

  Mouse.prototype.dist = function(tx, ty) {
    var dx, dy;
    dx = tx - this.x;
    dy = ty - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return Mouse;

})();

module.exports = Mouse;


},{}],11:[function(require,module,exports){
var Param,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Param = (function() {
  function Param() {
    this._init = bind(this._init, this);
    this._gui;
    this.div1 = 0.1;
    this.div2 = 0.1;
    this.radX = 0.2;
    this.radY = 0.2;
    this.radZ = 1;
    this.fl = 800;
    this.minSize = 0.3;
    this.maxSize = 1.5;
    this.pSize = 200;
    this.speed = 200;
    this.sv = 1;
    this.line = false;
    this.noise = false;
    this.a = 2000;
    this.b = 100;
    this.colorR = 100;
    this.colorG = 100;
    this.colorB = 100;
    this.particleNum = "0";
    this._init();
  }

  Param.prototype._init = function() {
    if (MY.conf.FLG.PARAM) {
      this._gui = new dat.GUI();
      this._gui.add(this, 'particleNum').listen();
      this._gui.add(this, 'noise');
      this._gui.add(this, 'colorR', 0, 200).step(1);
      this._gui.add(this, 'colorG', 0, 200).step(1);
      this._gui.add(this, 'colorB', 0, 200).step(1);
      return $(".dg").css({
        zIndex: 99999
      });
    }
  };

  return Param;

})();

module.exports = Param;


},{}],12:[function(require,module,exports){
var Profiler,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Profiler = (function() {
  function Profiler() {
    this._update = bind(this._update, this);
    this._init = bind(this._init, this);
    this._stats;
    this._init();
  }

  Profiler.prototype._init = function() {
    if (MY.conf.FLG.STATS) {
      this._stats = new Stats();
      this._stats.domElement.style.position = "fixed";
      this._stats.domElement.style.left = "0px";
      this._stats.domElement.style.bottom = "0px";
      document.body.appendChild(this._stats.domElement);
      return MY.update.add(this._update);
    }
  };

  Profiler.prototype._update = function() {
    if (this._stats != null) {
      return this._stats.update();
    }
  };

  return Profiler;

})();

module.exports = Profiler;


},{}],13:[function(require,module,exports){
var Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = (function() {
  function Utils() {
    this.price = bind(this.price, this);
    this.getHexColor = bind(this.getHexColor, this);
    this.scrollTop = bind(this.scrollTop, this);
    this.windowHeight = bind(this.windowHeight, this);
    this.numStr = bind(this.numStr, this);
    this._A = Math.PI / 180;
  }

  Utils.prototype.random = function(min, max) {
    if (min < 0) {
      min--;
    }
    return ~~(Math.random() * ((max + 1) - min) + min);
  };

  Utils.prototype.hit = function(range) {
    return this.random(0, range - 1) === 0;
  };

  Utils.prototype.range = function(val) {
    return this.random(-val, val);
  };

  Utils.prototype.arrRand = function(arr) {
    return arr[this.random(0, arr.length - 1)];
  };

  Utils.prototype.map = function(num, resMin, resMax, baseMin, baseMax) {
    var p;
    if (num < baseMin) {
      return resMin;
    }
    if (num > baseMax) {
      return resMax;
    }
    p = (resMax - resMin) / (baseMax - baseMin);
    return ((num - baseMin) * p) + resMin;
  };

  Utils.prototype.radian = function(degree) {
    return degree * this._A;
  };

  Utils.prototype.degree = function(radian) {
    return radian / this._A;
  };

  Utils.prototype.decimal = function(num, n) {
    var i, pos;
    num = String(num);
    pos = num.indexOf(".");
    if (n === 0) {
      return num.split(".")[0];
    }
    if (pos === -1) {
      num += ".";
      i = 0;
      while (i < n) {
        num += "0";
        i++;
      }
      return num;
    }
    num = num.substr(0, pos) + num.substr(pos, n + 1);
    return num;
  };

  Utils.prototype.floor = function(num, min, max) {
    return Math.min(max, Math.max(num, min));
  };

  Utils.prototype.strReverse = function(str) {
    var i, len, res;
    res = "";
    len = str.length;
    i = 1;
    while (i <= len) {
      res += str.substr(-i, 1);
      i++;
    }
    return res;
  };

  Utils.prototype.shuffle = function(arr) {
    var i, j, k, results;
    i = arr.length;
    results = [];
    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      if (i === j) {
        continue;
      }
      k = arr[i];
      arr[i] = arr[j];
      results.push(arr[j] = k);
    }
    return results;
  };

  Utils.prototype.sliceNull = function(arr) {
    var i, l, len1, newArr, val;
    newArr = [];
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      val = arr[i];
      if (val !== null) {
        newArr.push(val);
      }
    }
    return newArr;
  };

  Utils.prototype.replaceAll = function(val, org, dest) {
    return val.split(org).join(dest);
  };

  Utils.prototype.sort = function(arr, para, desc) {
    if (desc === void 0) {
      desc = false;
    }
    if (desc) {
      return arr.sort(function(a, b) {
        return b[para] - a[para];
      });
    } else {
      return arr.sort(function(a, b) {
        return a[para] - b[para];
      });
    }
  };

  Utils.prototype.unique = function() {
    return new Date().getTime();
  };

  Utils.prototype.numStr = function(num, keta) {
    var i, len, str;
    str = String(num);
    if (str.length >= keta) {
      return str;
    }
    len = keta - str.length;
    i = 0;
    while (i < len) {
      str = "0" + str;
      i++;
    }
    return str;
  };

  Utils.prototype.buttonMode = function(flg) {
    if (flg) {
      return $("body").css("cursor", "pointer");
    } else {
      return $("body").css("cursor", "default");
    }
  };

  Utils.prototype.getQuery = function(key) {
    var qs, regex;
    key = key.replace(/[€[]/, "€€€[").replace(/[€]]/, "€€€]");
    regex = new RegExp("[€€?&]" + key + "=([^&#]*)");
    qs = regex.exec(window.location.href);
    if (qs === null) {
      return "";
    } else {
      return qs[1];
    }
  };

  Utils.prototype.hash = function() {
    return location.hash.replace("#", "");
  };

  Utils.prototype.isSmt = function() {
    return navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0;
  };

  Utils.prototype.isAndroid = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('BlackBerry') > 0 || u.indexOf('Android') > 0 || u.indexOf('Windows Phone') > 0;
  };

  Utils.prototype.isIos = function() {
    return navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0;
  };

  Utils.prototype.isPs3 = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('PLAYSTATION 3') > 0;
  };

  Utils.prototype.isVita = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('PlayStation Vita') > 0;
  };

  Utils.prototype.isIe8Under = function() {
    var msie;
    msie = navigator.appVersion.toLowerCase();
    msie = msie.indexOf('msie') > -1 ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
    return msie <= 8 && msie !== 0;
  };

  Utils.prototype.isIe9Under = function() {
    var msie;
    msie = navigator.appVersion.toLowerCase();
    msie = msie.indexOf('msie') > -1 ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
    return msie <= 9 && msie !== 0;
  };

  Utils.prototype.isIe = function() {
    var ua;
    ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('msie') !== -1 || ua.indexOf('trident/7') !== -1;
  };

  Utils.prototype.isIpad = function() {
    return navigator.userAgent.indexOf('iPad') > 0;
  };

  Utils.prototype.isTablet = function() {
    return this.isIpad() || (this.isAndroid() && navigator.userAgent.indexOf('Mobile') === -1);
  };

  Utils.prototype.isWin = function() {
    return navigator.platform.indexOf("Win") !== -1;
  };

  Utils.prototype.isChrome = function() {
    return navigator.userAgent.indexOf('Chrome') > 0;
  };

  Utils.prototype.isFF = function() {
    return window.navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  };

  Utils.prototype.isIOSUiView = function() {
    var a;
    a = window.navigator.userAgent.toLowerCase();
    return (this.isIos() && a.indexOf('safari') === -1) || (this.isIos() && a.indexOf('crios') > 0) || (this.isIos() && a.indexOf('gsa') > 0);
  };

  Utils.prototype.getCookie = function(key) {
    var a, arr, i, l, len1, val;
    if (document.cookie === void 0 || document.cookie === null) {
      return null;
    }
    arr = document.cookie.split("; ");
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      val = arr[i];
      a = val.split("=");
      if (a[0] === key) {
        return a[1];
      }
    }
    return null;
  };

  Utils.prototype.setCookie = function(key, val) {
    return document.cookie = key + "=" + val;
  };

  Utils.prototype.windowHeight = function() {
    return $(document).height();
  };

  Utils.prototype.scrollTop = function() {
    return Math.max($(window).scrollTop(), $(document).scrollTop());
  };

  Utils.prototype.getHexColor = function(r, g, b) {
    var str;
    str = (r << 16 | g << 8 | b).toString(16);
    return "#" + new Array(7 - str.length).join("0") + str;
  };

  Utils.prototype.price = function(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  return Utils;

})();

module.exports = Utils;


},{}],14:[function(require,module,exports){
var Animation, Easing,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Easing = require('./Easing');

Animation = (function() {
  function Animation() {
    this.to = bind(this.to, this);
    this.get = bind(this.get, this);
    this.rate = bind(this.rate, this);
    this.finish = bind(this.finish, this);
    this.update = bind(this.update, this);
    this.isCompleted = bind(this.isCompleted, this);
    this.isSet = bind(this.isSet, this);
    this.isComplete = bind(this.isComplete, this);
    this.isStart = bind(this.isStart, this);
    this.start = bind(this.start, this);
    this.set = bind(this.set, this);
    this.reset = bind(this.reset, this);
    this.dispose = bind(this.dispose, this);
    this._init = bind(this._init, this);
    this._cnt = 0;
    this._delay = 0;
    this._frame = 0;
    this._param;
    this._onStart;
    this._onComplete;
    this._isUpdate = false;
    this._isStart = false;
    this._isComplete = false;
    this._isSet = false;
    this._isCompleted = false;
    this._init();
  }

  Animation.prototype._init = function() {};

  Animation.prototype.dispose = function() {
    return this.reset();
  };

  Animation.prototype.reset = function() {
    this._isUpdate = false;
    this._isStart = false;
    this._isComplete = false;
    this._isSet = false;
    this._isCompleted = false;
    this._param = null;
    this._onStart = null;
    return this._onComplete = null;
  };

  Animation.prototype.set = function(param) {
    var key, results, val;
    this.reset();
    if (param.ease == null) {
      param.ease = "linear";
    }
    this._isSet = true;
    this._cnt = 0;
    this._delay = param.delay == null ? 0 : param.delay;
    this._frame = param.frame == null ? 0 : param.frame;
    this._onStart = param.onStart;
    this._onComplete = param.onComplete;
    this._param = {};
    results = [];
    for (key in param) {
      val = param[key];
      if (key !== "delay" && key !== "frame" && key !== "onStart" && key !== "onComplete" && key !== "ease") {
        val.val = val.from;
        val.easing = new Easing();
        val.easeMethod = val.easing[param.ease];
        val.easeSpeed = 1 / this._frame;
        results.push(this._param[key] = val);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Animation.prototype.start = function() {
    return this._isUpdate = true;
  };

  Animation.prototype.isStart = function() {
    return this._isStart;
  };

  Animation.prototype.isComplete = function() {
    return this._isComplete;
  };

  Animation.prototype.isSet = function() {
    return this._isSet;
  };

  Animation.prototype.isCompleted = function() {
    return this._isCompleted;
  };

  Animation.prototype.update = function() {
    var key, rate, ref, val;
    if (!this._isUpdate) {
      return;
    }
    if (!this._isComplete && ++this._cnt > this._delay) {
      if (!this._isStart) {
        if (this._onStart != null) {
          this._onStart();
        }
        this._isStart = true;
      }
      ref = this._param;
      for (key in ref) {
        val = ref[key];
        val.easing.val += val.easeSpeed;
        val.easing.val = this._floor(val.easing.val, 0, 1);
        val.easing.t = val.easing.val;
        rate = val.easing.val >= 1 ? 1 : val.easeMethod();
        val.val = (val.from * (1 - rate)) + (val.to * rate);
        if (rate >= 1) {
          this._isComplete = true;
        }
      }
      if (this._isComplete) {
        if (this._onComplete != null) {
          return this._onComplete();
        }
      }
    }
  };

  Animation.prototype.finish = function() {
    var key, rate, ref, val;
    ref = this._param;
    for (key in ref) {
      val = ref[key];
      val.easing.val = 1;
      val.easing.t = val.easing.val;
      rate = val.easing.val >= 1 ? 1 : val.easeMethod();
      val.val = (val.from * (1 - rate)) + (val.to * rate);
      if (rate >= 1) {
        this._isComplete = true;
      }
    }
    if (this._isComplete) {
      if (this._onComplete != null) {
        return this._onComplete();
      }
    }
  };

  Animation.prototype.rate = function(r) {
    var key, rate, ref, results, val;
    r = this._floor(r, 0, 1);
    ref = this._param;
    results = [];
    for (key in ref) {
      val = ref[key];
      val.easing.val = r;
      val.easing.t = val.easing.val;
      rate = val.easing.val >= 1 ? 1 : val.easeMethod();
      results.push(val.val = (val.from * (1 - rate)) + (val.to * rate));
    }
    return results;
  };

  Animation.prototype.get = function(key) {
    if (this._isComplete) {
      this._isCompleted = true;
    }
    if ((this._param != null) && (this._param[key] != null)) {
      return this._param[key].val;
    } else {
      return 0;
    }
  };

  Animation.prototype.to = function(key) {
    if ((this._param != null) && (this._param[key] != null)) {
      return this._param[key].to;
    } else {
      return null;
    }
  };

  Animation.prototype._floor = function(num, min, max) {
    return Math.min(max, Math.max(num, min));
  };

  return Animation;

})();

module.exports = Animation;


},{"./Easing":15}],15:[function(require,module,exports){
var Easing,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Easing = (function() {
  function Easing() {
    this.bounceOut = bind(this.bounceOut, this);
    this.elasticOut = bind(this.elasticOut, this);
    this.circInOut = bind(this.circInOut, this);
    this.circOut = bind(this.circOut, this);
    this.circIn = bind(this.circIn, this);
    this.expoInOut = bind(this.expoInOut, this);
    this.expoOut = bind(this.expoOut, this);
    this.expoIn = bind(this.expoIn, this);
    this.sineInOut = bind(this.sineInOut, this);
    this.sineOut = bind(this.sineOut, this);
    this.sineIn = bind(this.sineIn, this);
    this.quintInOut = bind(this.quintInOut, this);
    this.quintOut = bind(this.quintOut, this);
    this.quintIn = bind(this.quintIn, this);
    this.quartInOut = bind(this.quartInOut, this);
    this.quartOut = bind(this.quartOut, this);
    this.quartIn = bind(this.quartIn, this);
    this.cubicInOut = bind(this.cubicInOut, this);
    this.cubicOut = bind(this.cubicOut, this);
    this.cubicIn = bind(this.cubicIn, this);
    this.quadInOut = bind(this.quadInOut, this);
    this.quadOut = bind(this.quadOut, this);
    this.quadIn = bind(this.quadIn, this);
    this.linear = bind(this.linear, this);
    this.reset = bind(this.reset, this);
    this.dispose = bind(this.dispose, this);
    this._init = bind(this._init, this);
    this.t = 0;
    this.b = 0;
    this.c = 1;
    this.d = 1;
    this.s = 1.70158;
    this.p = 0;
    this.a = this.c;
    this.val = 0;
    this._init();
  }

  Easing.prototype._init = function() {};

  Easing.prototype.dispose = function() {};

  Easing.prototype.reset = function() {
    this.t = 0;
    this.val = 0;
    this.s = 1.70158;
    this.p = 0;
    return this.a = this.c;
  };

  Easing.prototype.linear = function() {
    return this.c * this.t / this.d + this.b;
  };

  Easing.prototype.quadIn = function() {
    this.t /= this.d;
    return this.c * this.t * this.t + this.b;
  };

  Easing.prototype.quadOut = function() {
    this.t /= this.d;
    return -this.c * this.t * (this.t - 2) + this.b;
  };

  Easing.prototype.quadInOut = function() {
    this.t /= this.d / 2;
    if (this.t < 1) {
      return this.c / 2 * this.t * this.t + this.b;
    }
    this.t--;
    return -this.c / 2 * (this.t * (this.t - 2) - 1) + this.b;
  };

  Easing.prototype.cubicIn = function() {
    this.t /= this.d;
    return this.c * this.t * this.t * this.t + this.b;
  };

  Easing.prototype.cubicOut = function() {
    this.t /= this.d;
    this.t--;
    return this.c * (this.t * this.t * this.t + 1) + this.b;
  };

  Easing.prototype.cubicInOut = function() {
    this.t /= this.d / 2;
    if (this.t < 1) {
      return this.c / 2 * this.t * this.t * this.t + this.b;
    }
    this.t -= 2;
    return this.c / 2 * (this.t * this.t * this.t + 2) + this.b;
  };

  Easing.prototype.quartIn = function() {
    this.t /= this.d;
    return this.c * this.t * this.t * this.t * this.t + this.b;
  };

  Easing.prototype.quartOut = function() {
    this.t /= this.d;
    this.t--;
    return -this.c * (this.t * this.t * this.t * this.t - 1) + this.b;
  };

  Easing.prototype.quartInOut = function() {
    this.t /= this.d / 2;
    if (this.t < 1) {
      return this.c / 2 * this.t * this.t * this.t * this.t + this.b;
    }
    this.t -= 2;
    return -this.c / 2 * (this.t * this.t * this.t * this.t - 2) + this.b;
  };

  Easing.prototype.quintIn = function() {
    this.t /= this.d;
    return this.c * this.t * this.t * this.t * this.t * this.t + this.b;
  };

  Easing.prototype.quintOut = function() {
    this.t /= this.d;
    this.t--;
    return this.c * (this.t * this.t * this.t * this.t * this.t + 1) + this.b;
  };

  Easing.prototype.quintInOut = function() {
    this.t /= this.d / 2.0;
    if (this.t < 1) {
      return this.c / 2.0 * this.t * this.t * this.t * this.t * this.t + this.b;
    }
    this.t = this.t - 2;
    return this.c / 2.0 * (this.t * this.t * this.t * this.t * this.t + 2) + this.b;
  };

  Easing.prototype.sineIn = function() {
    return -this.c * Math.cos(this.t / this.d * (Math.PI / 2)) + this.c + this.b;
  };

  Easing.prototype.sineOut = function() {
    return this.c * Math.sin(this.t / this.d * (Math.PI / 2)) + this.b;
  };

  Easing.prototype.sineInOut = function() {
    return -this.c / 2 * (Math.cos(Math.PI * this.t / this.d) - 1) + this.b;
  };

  Easing.prototype.expoIn = function() {
    return this.c * Math.pow(2, 10 * (this.t / this.d - 1)) + this.b;
  };

  Easing.prototype.expoOut = function() {
    return this.c * (-Math.pow(2, -10 * this.t / this.d) + 1) + this.b;
  };

  Easing.prototype.expoInOut = function() {
    this.t /= this.d / 2;
    if (this.t < 1) {
      return this.c / 2 * Math.pow(2, 10 * (this.t - 1)) + this.b;
    }
    this.t--;
    return this.c / 2 * (-Math.pow(2, -10 * this.t) + 2) + this.b;
  };

  Easing.prototype.circIn = function() {
    this.t /= this.d;
    return -this.c * (Math.sqrt(1 - this.t * this.t) - 1) + this.b;
  };

  Easing.prototype.circOut = function() {
    this.t /= this.d;
    this.t--;
    return this.c * Math.sqrt(1 - this.t * this.t) + this.b;
  };

  Easing.prototype.circInOut = function() {
    this.t /= this.d / 2;
    if (this.t < 1) {
      return -this.c / 2 * (Math.sqrt(1 - this.t * this.t) - 1) + this.b;
    }
    this.t -= 2;
    return this.c / 2 * (Math.sqrt(1 - this.t * this.t) + 1) + this.b;
  };

  Easing.prototype.elasticOut = function() {
    if (this.t === 0) {
      return this.b;
    }
    if ((this.t /= this.d) === 1) {
      return this.b + this.c;
    }
    if (!this.p) {
      this.p = this.d * 0.3;
    }
    if (this.a < Math.abs(this.c)) {
      this.a = this.c;
      this.s = this.p / 4;
    } else {
      this.s = this.p / (2 * Math.PI) * Math.asin(this.c / this.a);
    }
    return this.a * Math.pow(2, -10 * this.t) * Math.sin((this.t * this.d - this.s) * (2 * Math.PI) / this.p) + this.c + this.b;
  };

  Easing.prototype.bounceOut = function() {
    if ((this.t /= this.d) < (1 / 2.75)) {
      return this.c * (7.5625 * this.t * this.t) + this.b;
    }
    if (this.t < (2 / 2.75)) {
      return this.c * (7.5625 * (this.t -= 1.5 / 2.75) * this.t + 0.75) + this.b;
    }
    if (this.t < (2.5 / 2.75)) {
      return this.c * (7.5625 * (this.t -= 2.25 / 2.75) * this.t + 0.9375) + this.b;
    } else {
      return this.c * (7.5625 * (this.t -= 2.625 / 2.75) * this.t + 0.984375) + this.b;
    }
  };

  return Easing;

})();

module.exports = Easing;


},{}],16:[function(require,module,exports){
var Display,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Display = (function() {
  function Display(option) {
    this.text = bind(this.text, this);
    this.elm = bind(this.elm, this);
    this.id = bind(this.id, this);
    this.dispose = bind(this.dispose, this);
    this._isUpdateCss = bind(this._isUpdateCss, this);
    this.css = bind(this.css, this);
    this.isVisible = bind(this.isVisible, this);
    this.brightness = bind(this.brightness, this);
    this.visible = bind(this.visible, this);
    this.mask = bind(this.mask, this);
    this.opacity = bind(this.opacity, this);
    this.bgColor = bind(this.bgColor, this);
    this.right = bind(this.right, this);
    this.bottom = bind(this.bottom, this);
    this.y = bind(this.y, this);
    this.x = bind(this.x, this);
    this.xy = bind(this.xy, this);
    this.height = bind(this.height, this);
    this.width = bind(this.width, this);
    this.size = bind(this.size, this);
    this.render = bind(this.render, this);
    this.unshift = bind(this.unshift, this);
    this.add = bind(this.add, this);
    this.init = bind(this.init, this);
    this._option = option || {};
    this._id = this._option.id || "";
    this._elm;
    this._elmName = this._option.elmName || "div";
    this._css = {
      position: this._option.position || "absolute",
      top: 0,
      left: 0,
      width: this._option.width || -1,
      height: this._option.height || -1
    };
    this._oldCss = {};
    this._etc = {};
  }

  Display.prototype.init = function() {
    if (window.MY_DISPLAY_ID == null) {
      window.MY_DISPLAY_ID = 0;
    }
    if (this._id === "") {
      this._id = "display" + String(window.MY_DISPLAY_ID++);
    }
    if ($("#" + this._id).length > 0) {
      this._elm = $("#" + this._id);
    } else {
      $("body").append("<" + this._elmName + " id='" + this._id + "'></" + this._elmName + ">");
      this._elm = $("#" + this._id);
    }
    if (this._css.width === -1) {
      this._css.width = this._elm.width();
    }
    if (this._css.height === -1) {
      this._css.height = this._elm.height();
    }
    return this.render();
  };

  Display.prototype.add = function(display) {
    return display.elm().appendTo("#" + this.id());
  };

  Display.prototype.unshift = function(display) {
    return display.elm().prependTo("#" + this.id());
  };

  Display.prototype.render = function() {
    var key, ref, results, value;
    if (this._isUpdateCss()) {
      this._elm.css(this._css);
    }
    ref = this._css;
    results = [];
    for (key in ref) {
      value = ref[key];
      results.push(this._oldCss[key] = value);
    }
    return results;
  };

  Display.prototype.size = function(width, height) {
    this._css.width = width;
    return this._css.height = height;
  };

  Display.prototype.width = function(width) {
    if (width != null) {
      return this._css.width = width;
    } else {
      if (this._css.width === "auto") {
        return this._elm.width();
      } else {
        return this._css.width;
      }
    }
  };

  Display.prototype.height = function(height) {
    if (height != null) {
      return this._css.height = height;
    } else {
      if (this._css.height === "auto") {
        return this._elm.height();
      } else {
        return this._css.height;
      }
    }
  };

  Display.prototype.xy = function(x, y) {
    this._css.top = y;
    return this._css.left = x;
  };

  Display.prototype.x = function(x) {
    if (x != null) {
      return this._css.left = x;
    } else {
      return this._css.left;
    }
  };

  Display.prototype.y = function(y) {
    if (y != null) {
      return this._css.top = y;
    } else {
      return this._css.top;
    }
  };

  Display.prototype.bottom = function() {
    return this.y() + this.height();
  };

  Display.prototype.right = function() {
    return this.x() + this.width();
  };

  Display.prototype.bgColor = function(color) {
    if (color != null) {
      return this._css.backgroundColor = color;
    } else {
      return this._css.backgroundColor;
    }
  };

  Display.prototype.opacity = function(val) {
    if (val != null) {
      return this._css.opacity = val;
    } else {
      return this._css.opacity;
    }
  };

  Display.prototype.mask = function(val) {
    return this._css.overflow = val ? "hidden" : "visible";
  };

  Display.prototype.visible = function(bool) {
    if (bool) {
      return this._css.display = "block";
    } else {
      return this._css.display = "none";
    }
  };

  Display.prototype.brightness = function(val) {
    if (val != null) {
      this._etc.brightness = val;
      if (val === 1) {
        this._css["-webkit-filter"] = "none";
        this._css["-moz-filter"] = "none";
        this._css["-o-filter"] = "none";
        this._css["-ms-filter"] = "none";
        return this._css["filter"] = "none";
      } else {
        this._css["-webkit-filter"] = "contrast(" + val + "%)";
        this._css["-moz-filter"] = "contrast(" + val + "%)";
        this._css["-o-filter"] = "contrast(" + val + "%)";
        this._css["-ms-filter"] = "contrast(" + val + "%)";
        return this._css["filter"] = "contrast(" + val + "%)";
      }
    } else {
      if (this._etc.brightness == null) {
        this._etc.brightness = 1;
      }
      return this._etc.brightness;
    }
  };

  Display.prototype.isVisible = function() {
    if (this._css.display === "none") {
      return false;
    } else {
      return true;
    }
  };

  Display.prototype.css = function() {
    return this._css;
  };

  Display.prototype._isUpdateCss = function() {
    var key, ref, value;
    ref = this._css;
    for (key in ref) {
      value = ref[key];
      if (value !== this._oldCss[key]) {
        return true;
      }
    }
    return false;
  };

  Display.prototype.dispose = function() {
    var i, len;
    if ((this._elm != null) && this._elm.length > 0) {
      i = 0;
      len = this._elm.queue().length;
      while (i < len) {
        this._elm.stop();
        i++;
      }
    }
    if (this._elm != null) {
      this._elm.off();
      if ((this._option.isRemove == null) || this._option.isRemove) {
        this._elm.remove();
      } else {
        this._elm.removeAttr('style');
      }
      this._elm = null;
    }
    this._css = null;
    this._option = null;
    this._oldCss = null;
    return this.ap = null;
  };

  Display.prototype.id = function() {
    return this._id;
  };

  Display.prototype.elm = function() {
    return this._elm;
  };

  Display.prototype.text = function(val) {
    this._elm.css({
      width: "auto",
      height: "auto"
    });
    if (val != null) {
      this._elm.html(val);
    } else {
      this._elm.html(this._elm.html());
    }
    this._css.width = "auto";
    this._css.height = "auto";
    return this.render();
  };

  return Display;

})();

module.exports = Display;


},{}],17:[function(require,module,exports){
var Display, DisplayTransform,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Display = require('./Display');

DisplayTransform = (function(superClass) {
  extend(DisplayTransform, superClass);

  function DisplayTransform(option) {
    this._isUpdateTransform = bind(this._isUpdateTransform, this);
    this._isInit = bind(this._isInit, this);
    this.perspective = bind(this.perspective, this);
    this.pivot = bind(this.pivot, this);
    this.render = bind(this.render, this);
    this.useTransform = bind(this.useTransform, this);
    this.rotate = bind(this.rotate, this);
    this.scale = bind(this.scale, this);
    this.translate = bind(this.translate, this);
    this.dispose = bind(this.dispose, this);
    this.init = bind(this.init, this);
    DisplayTransform.__super__.constructor.call(this, option);
    if (this._option.isDefault3d == null) {
      this._option.isDefault3d = true;
    }
    this._transform = {
      dx: 0,
      dy: 0,
      dz: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      rotX: 0,
      rotY: 0,
      rotZ: 0
    };
    this._isNone = false;
    this._oldTransform = {};
  }

  DisplayTransform.prototype.init = function() {
    DisplayTransform.__super__.init.call(this);
    if (this._option.isDefault3d) {
      this.perspective();
      return this.pivot();
    }
  };

  DisplayTransform.prototype.dispose = function() {
    this._oldTransform = null;
    this._transform = null;
    return DisplayTransform.__super__.dispose.call(this);
  };

  DisplayTransform.prototype.translate = function(x, y, z) {
    if ((x == null) && (y == null) && (z == null)) {
      return this._transform;
    } else {
      x = x || 0;
      y = y || 0;
      z = z || 0;
      this._transform.dx = x;
      this._transform.dy = y;
      return this._transform.dz = z;
    }
  };

  DisplayTransform.prototype.scale = function(x, y, z) {
    if ((x == null) && (y == null) && (z == null)) {
      return this._transform;
    } else {
      x = x || 1;
      y = y || 1;
      z = z || 1;
      this._transform.scaleX = x;
      this._transform.scaleY = y;
      return this._transform.scaleZ = z;
    }
  };

  DisplayTransform.prototype.rotate = function(x, y, z) {
    if ((x == null) && (y == null) && (z == null)) {
      return this._transform;
    } else {
      x = x || 0;
      y = y || 0;
      z = z || 0;
      this._transform.rotX = x;
      this._transform.rotY = y;
      return this._transform.rotZ = z;
    }
  };

  DisplayTransform.prototype.useTransform = function(bool) {
    return this._isNone = !bool;
  };

  DisplayTransform.prototype.render = function() {
    var key, ref, results, value;
    DisplayTransform.__super__.render.call(this);
    if (this._isUpdateTransform()) {
      this._elm.css(this._getVendorCss("transform", this._translate3d(this._transform.dx, this._transform.dy, this._transform.dz) + " " + this._rotateX(this._transform.rotX) + " " + this._rotateY(this._transform.rotY) + " " + this._rotateZ(this._transform.rotZ) + " " + this._scale3d(this._transform.scaleX, this._transform.scaleY, this._transform.scaleZ)));
    }
    if (this._isInit()) {
      this._elm.css(this._getVendorCss("transform", "none"));
    }
    ref = this._transform;
    results = [];
    for (key in ref) {
      value = ref[key];
      results.push(this._oldTransform[key] = value);
    }
    return results;
  };

  DisplayTransform.prototype.pivot = function(val) {
    val = val || "50% 50%";
    return this.elm().css(this._getVendorCss("transform-origin", val));
  };

  DisplayTransform.prototype.perspective = function(val) {
    val = val || 800;
    return this.elm().css(this._getVendorCss("transform-style", "preserve-3d")).css(this._getVendorCss("perspective", val)).css(this._getVendorCss("backface-visibility", "hidden"));
  };

  DisplayTransform.prototype._isInit = function() {
    if (this._transform.dx === 0 && this._transform.dy === 0 && this._transform.dz === 0 && this._transform.scaleX === 1 && this._transform.scaleY === 1 && this._transform.scaleZ === 1 && this._transform.rotX === 0 && this._transform.rotY === 0 && this._transform.rotZ === 0) {
      return true;
    } else {
      return false;
    }
  };

  DisplayTransform.prototype._isUpdateTransform = function() {
    var key, ref, value;
    ref = this._transform;
    for (key in ref) {
      value = ref[key];
      if (value !== this._oldTransform[key]) {
        return true;
      }
    }
    return false;
  };

  DisplayTransform.prototype._getVendorCss = function(prop, val) {
    var res;
    res = {};
    res["-webkit-" + prop] = val;
    res["-o-" + prop] = val;
    res["-khtml-" + prop] = val;
    res["-ms-" + prop] = val;
    res[prop] = val;
    return res;
  };

  DisplayTransform.prototype._translate3d = function(x, y, z) {
    y = y || 0;
    z = z || 0;
    return 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)';
  };

  DisplayTransform.prototype._rotateX = function(val) {
    if (val === void 0) {
      val = 0;
    }
    return 'rotate3d(1,0,0,' + val + 'deg)';
  };

  DisplayTransform.prototype._rotateY = function(val) {
    if (val === void 0) {
      val = 0;
    }
    return 'rotate3d(0,1,0,' + val + 'deg)';
  };

  DisplayTransform.prototype._rotateZ = function(val) {
    if (val === void 0) {
      val = 0;
    }
    return 'rotate3d(0,0,1,' + val + 'deg)';
  };

  DisplayTransform.prototype._scale3d = function(x, y, z) {
    if (x === void 0) {
      x = 1;
    }
    if (y === void 0) {
      y = 1;
    }
    if (z === void 0) {
      z = 1;
    }
    return 'scale3d(' + x + ',' + y + ',' + z + ')';
  };

  return DisplayTransform;

})(Display);

module.exports = DisplayTransform;


},{"./Display":16}],18:[function(require,module,exports){
var BaseMgr, Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = require('../Utils');

BaseMgr = (function() {
  function BaseMgr() {
    this._init = bind(this._init, this);
    this._u = new Utils();
  }

  BaseMgr.prototype._init = function() {};

  return BaseMgr;

})();

module.exports = BaseMgr;


},{"../Utils":13}],19:[function(require,module,exports){
var BaseMgr, DelayMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

DelayMgr = (function(superClass) {
  extend(DelayMgr, superClass);

  function DelayMgr() {
    this.update = bind(this.update, this);
    this._init = bind(this._init, this);
    DelayMgr.__super__.constructor.call(this);
    this._registFunc = [];
    this._init();
  }

  DelayMgr.prototype._init = function() {
    return DelayMgr.__super__._init.call(this);
  };

  DelayMgr.prototype.add = function(func, delay) {
    this._registFunc = this._sliceNull(this._registFunc);
    return this._registFunc.push({
      f: func,
      d: delay
    });
  };

  DelayMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._registFunc;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val.f !== func) {
        arr.push(val);
      }
    }
    return this._registFunc = arr;
  };

  DelayMgr.prototype.update = function() {
    var i, j, len, ref, results, val;
    ref = this._registFunc;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if ((val != null) && --val.d <= 0) {
        val.f();
        results.push(this._registFunc[i] = null);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  DelayMgr.prototype._sliceNull = function(arr) {
    var i, j, len, newArr, val;
    newArr = [];
    for (i = j = 0, len = arr.length; j < len; i = ++j) {
      val = arr[i];
      if (val !== null) {
        newArr.push(val);
      }
    }
    return newArr;
  };

  return DelayMgr;

})(BaseMgr);

module.exports = DelayMgr;


},{"./BaseMgr":18}],20:[function(require,module,exports){
var BaseMgr, ResizeMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

ResizeMgr = (function(superClass) {
  extend(ResizeMgr, superClass);

  function ResizeMgr() {
    this.sh = bind(this.sh, this);
    this.sw = bind(this.sw, this);
    this._setStageSize = bind(this._setStageSize, this);
    this._call = bind(this._call, this);
    this._eResize = bind(this._eResize, this);
    this.refresh = bind(this.refresh, this);
    this._init = bind(this._init, this);
    ResizeMgr.__super__.constructor.call(this);
    this._resizeList = [];
    this.ws = {
      w: 0,
      h: 0,
      oldW: -1,
      oldH: -1
    };
    this._t;
    this._init();
  }

  ResizeMgr.prototype._init = function() {
    ResizeMgr.__super__._init.call(this);
    $(window).bind("resize", this._eResize);
    return this._setStageSize();
  };

  ResizeMgr.prototype.add = function(func, isCall) {
    this._resizeList.push(func);
    if ((isCall != null) && isCall) {
      return func(this.ws.w, this.ws.h);
    }
  };

  ResizeMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._resizeList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val !== func) {
        arr.push(val);
      }
    }
    return this._resizeList = arr;
  };

  ResizeMgr.prototype.refresh = function() {
    return this._eResize();
  };

  ResizeMgr.prototype._eResize = function(e) {
    var i, j, len, ref, val;
    this._setStageSize();
    if (this._t != null) {
      ref = this._t;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        val = ref[i];
        clearInterval(val);
      }
      this._t = null;
    }
    this._t = [];
    return this._t[0] = setTimeout(this._call, 200);
  };

  ResizeMgr.prototype._call = function() {
    var i, j, len, ref, results, val;
    ref = this._resizeList;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      results.push(val(this.ws.w, this.ws.h));
    }
    return results;
  };

  ResizeMgr.prototype._setStageSize = function() {
    var h, w;
    if (this._u.isSmt()) {
      w = window.innerWidth;
      h = $(window).height();
    } else {
      if (this._u.isIe8Under()) {
        w = $(window).width();
        h = $(window).height();
      } else {
        w = window.innerWidth;
        h = window.innerHeight;
      }
    }
    this.ws.oldW = this.ws.w;
    this.ws.oldH = this.ws.h;
    this.ws.w = w;
    return this.ws.h = h;
  };

  ResizeMgr.prototype.sw = function() {
    return this.ws.w;
  };

  ResizeMgr.prototype.sh = function() {
    return this.ws.h;
  };

  return ResizeMgr;

})(BaseMgr);

module.exports = ResizeMgr;


},{"./BaseMgr":18}],21:[function(require,module,exports){
var BaseMgr, UpdateMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

UpdateMgr = (function(superClass) {
  extend(UpdateMgr, superClass);

  function UpdateMgr(isRAF) {
    this._update = bind(this._update, this);
    this._init = bind(this._init, this);
    UpdateMgr.__super__.constructor.call(this);
    this.cnt = 0;
    this._isRAF = isRAF || true;
    this._updateList = [];
    this._init();
  }

  UpdateMgr.prototype._init = function() {
    var requestAnimationFrame;
    UpdateMgr.__super__._init.call(this);
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    if (this._isRAF && (window.requestAnimationFrame != null)) {
      return window.requestAnimationFrame(this._update);
    } else {
      return setInterval(this._update, 1000 / 60);
    }
  };

  UpdateMgr.prototype.add = function(func) {
    return this._updateList.push(func);
  };

  UpdateMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._updateList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val !== func) {
        arr.push(val);
      }
    }
    return this._updateList = arr;
  };

  UpdateMgr.prototype._update = function() {
    var i, j, len, ref, t, val;
    this.cnt++;
    ref = this._updateList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val != null) {
        val();
      }
    }
    if (this._isRAF && (window.requestAnimationFrame != null)) {
      return t = window.requestAnimationFrame(this._update);
    }
  };

  return UpdateMgr;

})(BaseMgr);

module.exports = UpdateMgr;


},{"./BaseMgr":18}],22:[function(require,module,exports){
var Point,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Point = (function() {
  function Point(x, y) {
    this.subtract = bind(this.subtract, this);
    this.reset = bind(this.reset, this);
    this.x = x || 0;
    this.y = y || 0;
  }

  Point.prototype.reset = function() {
    return this.x = this.y = 0;
  };

  Point.prototype.subtract = function(pt) {
    return new Point(this.x - pt.x, this.y - pt.y);
  };

  return Point;

})();

module.exports = Point;


},{}],23:[function(require,module,exports){
var Rect,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Rect = (function() {
  function Rect(x, y, w, h) {
    this.center = bind(this.center, this);
    this.bottom = bind(this.bottom, this);
    this.right = bind(this.right, this);
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;
  }

  Rect.prototype.right = function() {
    return this.x + this.w;
  };

  Rect.prototype.bottom = function() {
    return this.y + this.h;
  };

  Rect.prototype.center = function() {
    return {
      x: ~~(this.x + this.w * 0.5),
      y: ~~(this.y + this.h * 0.5)
    };
  };

  return Rect;

})();

module.exports = Rect;


},{}]},{},[8]);
