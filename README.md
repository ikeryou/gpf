# GLSL PARTICLE FONT
####http://ikeryou.jp/works/g/####
<img src="http://ikeryou.jp/works/g/assets/img/ogp/ogp.png">


##やりたいこと→100万個以上のパーティクルをアニメーションさせたい
だけど、、  
Javascriptで100万個のパーティクルに別々の動きをつけるのは負荷的に無理


```javascript

i = 0;
while i < 1000000
  
  // パーティクルを動かす処理
  
  i++;

```


こんな感じなのをfps60で毎フレーム実行とかやるとか、、  
狂ってる！！  


##どうするか？？

GPUでパーティクルを動かす計算をする



##GPU？
クッッソ計算が早い！！  
普段JavascriptでごにょごにょやってるのはCPUで計算してる  
20~100倍違う！！



##なんで皆やらないのか？？

GPUの処理速度の恩恵を受けるにはGLSL書かないといけない   
GLSLクッッソむずい！！  
そもそもGPUは画像処理専門  
アニメーション計算とかは向いてない  
だけどアニメーション計算しようぜ！！  
**GPGPU**っていう考え方がある


##GPGPU？
[wiki](https://ja.wikipedia.org/wiki/GPGPU "wiki")  
画像処理専門だけどそれ以外のことにもGPU使おうぜ！  
っていうウルトラC  
エクセルでイラスト描くようなもの


(例)  
テクスチャをアニメーションデータとして利用する(変態)  
https://wgld.org/d/webgl/w083.html



今回僕がやったのは、  
js側(CPU側)で頂点データを随時更新すると負荷が高いので更新せず、  
GPU側に**サイト開いてから経過した時間**を送り、  
GPU側はそれをもとに移動後の座標を計算してアニメーションさせてます  
(簡単にいうと、x=0の頂点に経過時間timeを足していくとtime=10のときにはx=10になる。という考え方)





##まとめ

###GPGPUクッッソやばい！！



