var b_color = "rgba(87,186,255,";
var g_color = "rgba(251,132,176,";
var canvas = J.ct("canvas#bgCanvas");
var _w=J.width();
var _h=J.height();
var _n=30;
var ctx = canvas.getContext("2d"), canvas_width, canvas_height;
var circles=new Array();
(function () {
    canvas.width=_w;
    canvas.height=_h;
    var _cover = J.ct("div#bgCover").css({
        width:_w+"px",
        height:_h+"px"
    });
    J.body().append([canvas,_cover]);
    for(var i=0;i<_n;i++){
      circles.push(new Circle());
    }
    _draw();
})();
function _draw() {
    setInterval(function () {
        ctx.clearRect(0, 0, _w, _h);
        circles.each(function (item) {
            item.act();
        });
    },50)//
}
function _init() {
  this.x=J.random(0,_w);
  this.y=J.random(0,_h);
  this.r=0;
  this.max_r=J.random(10,50);
  this.speed=J.random(2,6)*0.1;
  this.alpha=J.random(2,9)*0.1;
  this.per_a=0;
  this.color_base=((J.random(0,1)==0)?g_color:b_color);
  this.color=this.color_base+this.alpha+")";
  this.stop=false;
}
function Circle() {
  _init.call(this);
};Circle.prototype.reinit=function(){
  _init.call(this);
};Circle.prototype.act=function(){
    if(!this.stop) {
        this.r += this.speed;
        if (this.r > this.max_r * 0.7) {
            if (this.r >= this.max_r) {
                this.stop = true;
                this.reinit();
                return;
            } else {
                if (this.alpha > 0) {
                    if (this.per_a == 0) {
                        this.per_a = (this.alpha) / ((this.max_r - this.r) / this.speed);
                    }
                    this.alpha -= this.per_a;
                    if (this.alpha <= 0) {
                        this.alpha=0;
                        this.stop = true;
                        this.reinit();
                        return;
                    }
                    this.color = this.color_base + this.alpha + ")";
                } else {
                    this.stop = true;
                    this.reinit();
                    return;
                }
            }
        }
        this.draw();
    }
};Circle.prototype.draw=function(){
    ctx.beginPath();
    ctx.arc(this.x , this.y ,this.r,0,2*Math.PI);
    ctx.fillStyle=this.color;
    ctx.fill();
    ctx.closePath();
};
window.onresize=function () {
  _w=J.width();
  _h=J.height();
  canvas.width=_w;
  canvas.height=_h;
  J.id("bgCover").css({
    width:_w+"px",
    height:_h+"px"
  });
}
