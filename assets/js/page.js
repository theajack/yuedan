var _page=0;
J.ready(function(){
  
});
function Page(ele,w,btn,navi){
  var _bar=ele;
  var _pageNum=ele.child().length;
  var _pageIndex=0;
  var _pageWidth=w;
  var _totalWidth=w*_pageNum;
  var _navi=null;
  var _prevCall=null;
  var _nextCall=null;
  window["_page"+_page]=this;
  this.prevCall=function(func){
    _prevCall=func;
  };
  this.nextCall=function(func){
    _nextCall=func;
  };
  this.left=function(){
    if(_pageIndex>0){
      _pageIndex--;
      this.move();
    }else{
      if(_prevCall==null){
        J.show("已是第一页","warn");
      }else{
        _prevCall(this);
      }
    }
    this.inactive();
  };
  this.right=function(){
    if(_pageIndex<_pageNum-1){
      _pageIndex++;
      this.move();
    }else{
      if(_nextCall==null){
        J.show("已是最后一页","warn");
      }else{
        _nextCall(this);
      }
    }
    this.inactive();
  };
  this.jump=function(i){
    if(i<0||i>=_pageNum){
      J.show("超过页数范围");
      return;
    }
    _pageIndex=i;
    this.move();
    this.inactive();
  };
  this.move=function(left){
    if(left==undefined){
      left=(-_pageWidth*_pageIndex)+"px";
    }
    _bar.css("left",left);
    var a=parseInt(_bar.css("left").substring(0,_bar.css("left").length-2));
    if(a>0){
      _bar.css("left","0px");
    }else if(a<-(_bar.wid()-_pageWidth)){
      _bar.css("left",(-(_bar.wid()-_pageWidth))+"px");
    }
  };
  this.inactive=function(){
    if(_navi!=null){
      _navi.findClass("pi-active").removeClass("pi-active");
      _navi.child(_pageIndex).addClass("pi-active");
    }
  };
  this.reinit=function(){
    if(_pageNum!=_bar.child().length){
      _pageNum=_bar.child().length;
      _initEvent();
    }
    _totalWidth=w*_pageNum;
    this.jump(0);
    _navi=null;
    _init();
  }
  _init(true);
  _initEvent();
  function _init(first){
    var par=ele.parent();
    ele.css("width",(_totalWidth)+"px");
    ele.child().css("width",(w)+"px");
    par.css("height",ele.css("height"));
    if(first==true){
      par.varname="_page"+_page;
      _page++;
    }
    J.cls("page-arrow").remove();
    J.cls("page-navi").remove();
    if(_pageNum>1){
      if(btn!=false){
        var _top=(ele.hei()/2-20)+"px";
        ["left","right"].each(function(item){
          par.append(J.ct("img.page-arrow.pa-"+item).attr("src","assets/images/"+item+".png").clk(new Function(par.varname+"."+item+"()")).css("top",_top));
        });
      }
      if(navi!=false){
        _navi=J.ct("div.page-navi");
        for(var i=0;i<_pageNum;i++){
          var ni=J.ct("span.page-navi-i").clk(function(){
            window[this.parent(2).varname].jump(this.index());
          });
          if(i==0){
            ni.addClass("pi-active");
          }
          _navi.append(ni)
        }
        par.prepend(_navi);
      }
    }
  }
  function _initEvent(){
    if(_pageNum>1){
      ele.parent().ontouchstart=function(event){
        this.lastX=event.touches[0].clientX;
      };
      ele.parent().isMove=false;
      ele.parent().ontouchmove=function(event){
        if(this.isMove==false){
          var x=event.touches[0].clientX;
          if(x-this.lastX>40){
            new Function(this.varname+".left()")();
            this.isMove=true;
            var obj=this;
            setTimeout(function(){obj.isMove=false},300);
          }else if(x-this.lastX<-40){
            new Function(this.varname+".right()")();
            this.isMove=true;
            var obj=this;
            setTimeout(function(){obj.isMove=false},300);
          }
        }
      };
    }else{
      ele.parent().ontouchstart=null;
      ele.parent().ontouchmove=null;
    }
  }
}