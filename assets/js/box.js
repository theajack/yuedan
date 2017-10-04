//弹出框
(function(){
  J.ready(function(){
    J.body().append(J.ct("div.box-cover"));
    J.attr("box-bind").each(function(item){
      item.attr("readonly","true");
      var type=item.attr("box-bind");
      if(type=="city"){
        item.clk(function(){
          Box.cascade.open({
            items:Box.data.province,
            subItems:Box.data.city,
            bind:item
          });
        });
      }else if(type=="date"||type=="datetime"){
        item.clk(function(){
          Box.date.open({
            type:type,
            bind:item
          });
        });
      }else{
        item.clk(function(){
          Box.cascade.open({
            items:Box.data[type],
            bind:item
          });
        });
      }
    });
  });
  window.Box={
    config:{
      fixBody:true
    },
    openQueue:[],
    cover:{
      open:function(){
        J.cls("box-cover").fadeIn(null,300,"ease");
      },close:function(){
        J.cls("box-cover").fadeOut(null,300,"ease");
      }
    },
    select:{
      ele:J.cls("selectbox-wrapper"),
      oncancel:function(){},
      onclose:function(){},
      open:function(opt){//items data onselect oncancel onclose autoClose bind
        var data=J.checkArg(opt.data,[]);
        this.oncancel=J.toFunc(opt.oncancel);
        this.onclose=J.toFunc(opt.onclose);
        if(!this.ele.exist()){
          _addSelectBox();
          this.ele=J.cls("selectbox-wrapper");
        }else{
          this.ele.child(0).empty();
        }
        opt.items.each(function(item,i,obj){
          var ele=J.ct("div.selectbox-item").txt(item).data(_checkData(data[i]));
          if(opt.onselect!=undefined){
            var fun;
            if(J.type(opt.onselect)=="array"){
              fun=opt.onselect[i];
            }else{
              fun=J.toFunc(opt.onselect);
            }
            ele.clk(fun);
          }
          if(opt.bind!=undefined){
            opt.bind.attr("readonly","true");
            var a=function(){
              opt.bind.content(this.txt());
            }
            ele.clk(a,true);
          }
          if(opt.autoClose!=false){
            ele.clk("Box.select.close()",true)
          }
          obj.ele.child(0).append(ele);
        },this);
        Box.open("selectbox");
        if(opt.items.length>10){
          this.ele.findClass("box-viewmore").show();
        }else{
          this.ele.findClass("box-viewmore").hide();
        }
      },close:function(){
        Box.close("selectbox");
        this.onclose();
      },cancel:function(){
        this.close();
        this.oncancel();
      }
    },
    multi:{
      ele:J.cls("multibox-wrapper"),
      onsubmit:function(){},
      oncancel:function(){},
      checkList:[],
      dataList:[],
      maxNum:0,
      bind:null,
      open:function(opt){//items data onsubmit oncancel maxNum bind
        var data=J.checkArg(opt.data,[]);
        this.onsubmit=J.toFunc(opt.onsubmit);
        this.oncancel=J.toFunc(opt.oncancel);
        this.maxNum=J.checkArg(opt.maxNum,opt.items.length);
        this.bind=J.checkArg(opt.bind,null);
        if(opt.bind!=null){
          opt.bind.attr("readonly","true");
        }
        this.checkList.empty();
        this.dataList.empty();
        if(!this.ele.exist()){
          _addMultiBox();
          this.ele=J.cls("multibox-wrapper");
        }else{
          this.ele.child(0).empty();
        }
        opt.items.each(function(item,i,obj){
          var ele=J.ct("div.multi-item").clk("Box.multi.check(this)").data(_checkData(data[i])).html('\
            <span>'+item+'</span>\
            <i class="icon icon-sign-blank"></i>');
          obj.ele.child(0).append(ele);
        },this);
        Box.open("multibox");
        if(opt.items.length>18){
          this.ele.findClass("box-viewmore").show();
        }else{
          this.ele.findClass("box-viewmore").hide();
        }
      },close:function(){
        Box.close("multibox");
      },cancel:function(){
        this.close();
        this.oncancel();
      },submit:function(){
        this.close();
        this.onsubmit(this.checkList,this.dataList);
        if(this.bind!=null){
          this.bind.content(this.checkList.join(";"));
        }
      },check:function(obj){
        if(obj.hasClass("mutli-checked")){
          obj.removeClass("mutli-checked");
          obj.child(1).replaceClass("icon-check-sign","icon-sign-blank");
          this.checkList.remove(obj.child(0).txt());
          this.dataList.remove(obj.data());
        }else{
          if(this.checkList.length>=this.maxNum){
            J.show("已达到选择上限","warn");
          }else{
            obj.addClass("mutli-checked");
            obj.child(1).replaceClass("icon-sign-blank","icon-check-sign");
            this.checkList.push(obj.child(0).txt());
            this.dataList.push(obj.data());
          }
        }
      }
    },
    text:{//title placeholder data onsubmit oncancel autoClose
      oncancel:function(){},
      onsubmit:function(){},
      autoClose:true,
      data:null,
      open:function(opt){
        if(opt!=undefined){
          this.autoClose=J.checkArg(opt.autoClose,true);
          this.oncancel=J.checkArg(opt.oncancel,function(){});
          this.onsubmit=J.checkArg(opt.onsubmit,function(){});
          this.data=opt.data;
        }else{
          opt={};
        }
        var ele=J.cls("textbox-wrapper");
        if(!ele.exist()){
          _addTextBox();
          ele=J.cls("textbox-wrapper");
        }
        ele.child(0).txt(J.checkArg(opt.title,"请输入"));
        ele.child(1).attr("placeholder",J.checkArg(opt.placeholder,""));
        Box.open("textbox");
      },submit:function(){
        this.onsubmit();
        if(this.autoClose){
          this.close();
        }
      },cancel:function(){
        this.oncancel();
        this.close();
      },close:function(){
        Box.close("textbox");
      }
    },
    confirm:{
      oncancel:function(){},
      onconfirm:function(){},
      autoClose:true,
      data:null,
      open:function(opt){//title placeholder data onconfirm oncancel autoClose
        if(opt!=undefined){
          this.autoClose=J.checkArg(opt.autoClose,true);
          this.oncancel=J.checkArg(opt.oncancel,function(){});
          this.onconfirm=J.checkArg(opt.onconfirm,function(){});
          this.data=opt.data;
        }else{
          opt={};
        }
        var ele=J.cls("confirmbox-wrapper");
        if(!ele.exist()){
          _addConfirmBox();
          ele=J.cls("confirmbox-wrapper");
        }
        ele.child(0).txt(J.checkArg(opt.title,"是否确认该操作？"))
                    .data(J.checkArg(opt.data,{}));
        Box.open("confirmbox");
      },confirm:function(){
        this.onconfirm();
        if(this.autoClose){
          this.close();
        }
      },cancel:function(){
        this.oncancel();
        this.close();
      },close:function(){
        Box.close("confirmbox");
      }
    },
    date:{
      ele:J.cls("datebox-wrapper"),
      onsubmit:function(){},
      oncancel:function(){},
      checkList:[],
      bind:null,
      open:function(opt){//onsubmit oncancel bind type
        this.onsubmit=J.toFunc(opt.onsubmit);
        this.oncancel=J.toFunc(opt.oncancel);
        this.bind=J.checkArg(opt.bind,null);
        var d = new Date();
        var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        if(opt.bind!=null){
          opt.bind.attr("readonly","true");
        }
        this.checkList.empty();
        if(!this.ele.exist()){
          _addDateBox();
          this.ele=J.cls("datebox-wrapper");
          this.ele.findClass("d-i").on("scroll","Box.date._onscroll(this)");
        }
        Box.open("datebox");
        this.init(J.checkArg(opt.type,"date"));
      },close:function(){
        Box.close("datebox");
      },cancel:function(){
        this.close();
        this.oncancel();
      },submit:function(){
        this.close();
        var data;
        if(this.checkList.length==3){
          data=this.checkList.join("-");
        }else{
          var arr=this.checkList.group(3);
          data=arr[0].join("-")+" "+arr[1].join(":");
        }
        this.onsubmit(data);
        if(this.bind!=null){
          this.bind.content(data);
        }
      },_onscroll:function(obj){
        if(obj._timer == null){
          obj._timer = setInterval(function(){
            if(obj.scrollTop == obj._topVal){
              var sh=50;
              clearInterval(obj._timer);  
              obj._timer = null;  
              var top=obj.scrollTop;
              var a=top%sh;
              if(a>=sh/2){
                top+=(sh-a);
              }else{
                top-=a;
              }
              obj.scrollTo(top,null,80);
              var i=Math.round(top/sh);
              Box.date.checkList[obj.index()]=obj.child(i).txt();
              Box.date._active(obj.child(i));
            }
          }, 100);  
        }
        obj._topVal = obj.scrollTop;  
      },init:function(type){
        var d = new Date();
        var yy=d.getFullYear();
        var mm=(d.getMonth()+1<10)?("0"+(d.getMonth()+1)):(d.getMonth()+1);
        var dd=(d.getDate()<10)?("0"+(d.getDate())):(d.getDate());
        var str = +"-"+(d.getMonth()+1)+"-"+d.getDate();
        var num=3;
        var list=J.cls("datebox-wrapper").findClass("d-i")
        if(type!="date"){
          num=5;
          list[3].removeClass("hide").scrollTop=0;
          list[4].removeClass("hide").scrollTop=0;
          this.checkList=[yy,mm,dd,"00","00"];
        }else{
          list[3].addClass("hide");
          list[4].addClass("hide");
          this.checkList=[yy,mm,dd];
        }
        list.css("width",(100/num)+"%");
        var sh=50;
        var i=yy-1950;
        list[0].scrollTop=i*50;
        this._active(list[0].child(i));
        i=d.getMonth();
        list[1].scrollTop=i*50;
        this._active(list[1].child(i));
        i=d.getDate()-1;
        list[2].scrollTop=i*50;
        this._active(list[2].child(i));
      },_active:function(obj,cls){
        obj.parent().findClass("active").removeClass("active");
        obj.addClass("active");
      }
    },
    cascade:{
      ele:J.cls("cascadebox-wrapper"),
      onsubmit:function(){},
      oncancel:function(){},
      checkList:[],
      bind:null,
      type:"",
      open:function(opt){//items onsubmit oncancel bind type
        this.onsubmit=J.toFunc(opt.onsubmit);
        this.oncancel=J.toFunc(opt.oncancel);
        this.bind=J.checkArg(opt.bind,null);
        if(opt.bind!=null){
          opt.bind.attr("readonly","true");
        }
        this.type=J.checkArg(opt.type,"");
        this.checkList[0]=opt.items[0];
        if(!this.ele.exist()){
          _addCascadeBox();
          this.ele=J.cls("cascadebox-wrapper");
        }else{
          this.ele.child(1).empty();
        }
        var ele1=J.ct("div.c-i.cc-i").on("scroll","Box.cascade._onscroll(this)");
        opt.items.each(function(item,i){
          var _sel=J.ct("div").txt(item);
          if(i==0){_sel.addClass("active");}
          ele1.append(_sel);
        });
        if(opt.subItems!=undefined){
          this.checkList[1]=opt.subItems[0][0];
          var ele2=J.ct("div.c-i").on("scroll","Box.cascade._onscroll(this)");
          opt.subItems.each(function(item,j){
            var _sub=J.ct("div.ci-w");
            if(j==0){_sub.addClass("active");}
            item.each(function(sel_item,k){
              var _sel=J.ct("div").txt(sel_item);
              if(k==0){_sel.addClass("active");}
              _sub.append(_sel);
            });
            ele2.append(_sub);
          });
          this.ele.child(1).append([ele1,ele2]);
          J.cls("c-i").css("width","50%");
        }else{
          this.ele.child(1).append(ele1);
          J.cls("c-i").css("width","100%");
        }
        Box.open("cascadebox");
      },close:function(){
        Box.close("cascadebox");
        this.checkList.empty();
      },cancel:function(){
        this.oncancel();
        this.close();
      },submit:function(){
        var data;
        if(this.type==""||this.type=="last"){
          data=this.checkList.last();
        }else{
          data=this.checkList;
        }
        this.onsubmit(data);
        if(this.bind!=null){
          if(J.type(data)=="array"){
            this.bind.content(data.join(this.type));
          }else{
            this.bind.content(data);
          }
        }
        this.close();
      },_onscroll:function(obj){
        if(obj._timer == null){
          obj._timer = setInterval(function(){
            if(obj.scrollTop == obj._topVal){
              var sh=50;
              clearInterval(obj._timer);  
              obj._timer = null;  
              var top=obj.scroll();
              var a=top%sh;
              if(a>=sh/2){
                top+=(sh-a);
              }else{
                top-=a;
              }
              obj.scrollTo(top,null,80);
              var index=obj.index();
              var i=Math.round(top/sh);
              if(index==0){
                if(Box.cascade.checkList[index]!=obj.child(i).txt()){
                  Box.cascade.checkList[index]=obj.child(i).txt();
                  Box.cascade._active(obj.child(i));//第一栏的item
                  if(Box.cascade.checkList.length==2){
                    Box.cascade._active(obj.next().child(i));//第二栏对应选择哪一个
                    Box.cascade._active(obj.next().child(i).child(0));//初始化第二栏的active
                    obj.next().scrollTop=0;//初始化第二栏的top
                  }
                }
              }else{
                var _active=obj.child().findClass("active").child(i);
                Box.cascade.checkList[index]=_active.txt();
                Box.cascade._active(_active);
              }
            }
          }, 100);  
        }
        obj._topVal = obj.scrollTop;  
      },_active:function(obj,cls){
        obj.bro().findClass("active").removeClass("active");
        obj.addClass("active");
      }
    },
    
    search:{
      onclose:function(){},
      onsearch:function(){},
      data:null,
      autoClose:true,
      types:["全部","约单","帖子","拍卖"],
      init:function(types){
        J.cls("open-search").clk("Box.search.open()");
        _addSearch(this.types[0]);
      },
      open:function(opt){
        if(opt!=undefined){
          this.types=J.checkArg(opt.types,["全部","约单","帖子","拍卖"]);
          J.cls("s-i-w select").child(0).val(opt.types[0]);
          this.autoClose=J.checkArg(opt.autoClose,true);
          this.data=J.checkArg(opt.data,null);
          this.onclose=J.checkArg(opt.onclose,function(){});
          this.onsearch=J.checkArg(opt.onsearch,function(){});
        }
        J.cls("search-wrapper").addClass("open");
      },
      search:function(){
        this.onsearch();
        if(this.autoClose){
          this.close();
        }
      },
      close:function(){
        J.cls("search-wrapper").removeClass("open");
        this.onclose();
      },
      openSelect:function(obj){
        Box.select.open({
          items:Box.search.types,
          bind:J.cls("search-wrapper").child(1).child(0)
        });
      }
      
    },
    open:function(type){
      if(!this.openQueue.has(type)){
        this.openQueue.push(type)
      }
      this.cover.open();
      if(Box.config.fixBody==true){
        var top=J.body().scroll();
        J.body().css("top",(-top)+"px").addClass("body-fixed").data("top",top);
      }
      J.cls(type+"-wrapper").css("display","block");
      J.delay(function(){
        J.cls(type+"-wrapper").addClass("open");
      },10);
    },close:function(type){
      if(this.openQueue.has(type)){
        this.openQueue.remove(type);
        J.cls(type+"-wrapper").removeClass("open");
        J.delay(function(){
          J.cls(type+"-wrapper").css("display","none");
          if(Box.config.fixBody==true){
            var top=J.body().css("top","inherit").removeClass("body-fixed").data("top");
            J.body().scrollTop=top;
          }
        },300);
        if(this.openQueue.length==0){
          this.cover.close();
        }
      }
    },
    navi:{
      pages:["main","center","mine","collect","config"],
      index:-1,
      init:function(cur){
        J.cls("open-navi").clk(this.open);
        this.index=this.pages.indexOf(cur);
        if(this.index!=-1){
          _addNavi(this.index);
        }
      },open:function(){
        J.id("header").addClass("offset");
        J.id("main").addClass("offset");
        J.cls("navi").addClass("offset");
        J.cls("navi-cover").fadeIn(null,300,"ease");
      },close:function(call){
        J.id("header").removeClass("offset");
        J.id("main").removeClass("offset");
        J.cls("navi").removeClass("offset");
        J.cls("navi-cover").fadeOut(J.toFunc(call),300,"ease");
      },to:function(index){
        active(J.cls("navi-item")[index],"active");
        this.close(function(){
          if(index!=Box.navi.index){
            J.jump(Box.navi.pages[index]+".html");
          }
        });
      }
    },
    data:{
      province:["北京","上海","重庆","天津","广东","江苏","湖北","陕西","四川","辽宁","吉林","山东","浙江","广西","安徽","河北","山西","内蒙","福建","江西","河南","湖南","海南","贵州","黑龙江","云南","西藏","甘肃","青海","宁夏","新疆","香港","澳门","台湾省","国外"],
      city:[
        ["东城","西城","海淀","朝阳","丰台","门头沟","石景山","房山","通州","顺义","昌平","大兴","怀柔","平谷","延庆","密云"]
        ,["黄浦","徐汇","长宁","静安","普陀","虹口","杨浦","闵行","宝山","嘉定","浦东","金山","松江","青浦","奉贤","崇明"]
        ,["万州区","涪陵区","渝中区","大渡口区","江北区","沙坪坝区","九龙坡区","南岸区","北碚区","万盛区","双桥区","渝北区","巴南区","黔江区","长寿区","江津区","合川区","永川区","南川区"]
        ,["和平区","河东区","河西区","河北区","南开区","红桥区","东丽区","津南区","西青区","北辰区","武清区","宁河区","静海区","宝坻区","滨海新区"]    
        ,["广州","韶关","深圳","珠海","汕头","佛山","江门","湛江","茂名","肇庆","惠州","梅州","汕尾","河源","阳江","清远","东莞","中山","潮州","揭阳","云浮","台山","普宁","南沙开发区","开平","龙川","鹤山"]
        ,["南京","苏州","常州","昆山","常熟","无锡","江阴","徐州","南通","淮安","盐城","扬州","镇江","泰州","靖江","宿迁","句容","宜兴","如皋","丹阳","扬中","高邮","启东","泰兴","溧阳","盱眙","通州","金湖","太仓市","张家港","连云港"]
        ,["武汉","黄石","十堰","宜昌","襄阳","鄂州","荆门","孝感","荆州","黄冈","咸宁","随州","恩施","公安","武穴","天门","仙桃","潜江","宜城","神农架"]
        ,["西安","铜川","宝鸡","咸阳","渭南","延安","汉中","榆林","安康","商洛","兴平","杨凌"]
        ,["成都","自贡","泸州","德阳","绵阳","广元","遂宁","内江","乐山","南充","眉山","宜宾","广安","达州","雅安","巴中","资阳","阿坝","甘孜","凉山","峨眉","西昌","简阳","攀枝花"]
        ,["大连","沈阳","鞍山","抚顺","本溪","丹东","锦州","营口","阜新","辽阳","盘锦","铁岭","朝阳","葫芦岛","兴城","海城","昌图","开原"]
        ,["长春","珲春","四平","辽源","通化","白山","松原","白城","延边","吉林市","公主岭"]
        ,["济南","青岛","淄博","枣庄","东营","烟台","潍坊","济宁","泰安","威海","日照","莱芜","临沂","德州","聊城","滨州","菏泽","荣成","黄岛","乳山","城阳","即墨","肥城","兖州","海阳","胶州","胶南","平度","莱西"]
        ,["杭州","宁波","温州","嘉兴","湖州","绍兴","金华","衢州","舟山","台州","丽水","龙泉","义乌","平湖","永康","东阳","嘉善","余姚","慈溪","乐清","永嘉","桐乡","瑞安","温岭","上虞","诸暨","海宁","宁海","三门","德清","象山","方家山","玉环县"]
        ,["南宁","柳州","桂林","梧州","北海","防城港","钦州","贵港","玉林","百色","贺州","河池","来宾","崇左"]
        ,["合肥","芜湖","蚌埠","淮南","马鞍山","淮北","铜陵","安庆","黄山","滁州","阜阳","宿州","巢湖","六安","亳州","池州","宣城","凤阳","广德","宿松"]
        ,["石家庄","唐山","秦皇岛","邯郸","邢台","保定","张家口","承德","沧州","廊坊","衡水","燕郊开发区","固安","遵化","香河","三河"]
        ,["太原","大同","阳泉","长治","晋城","朔州","晋中","运城","忻州","临汾","吕梁","和顺","永济市"]
        ,["呼和浩特","包头","乌海","赤峰","通辽","鄂尔多斯","呼伦贝尔","兴安盟","锡林郭勒盟","乌兰察布","巴彦淖尔","阿拉善盟","乌审旗","满洲里"]
        ,["福州","厦门","莆田","三明","泉州","漳州","南平","龙岩","宁德","福安","晋江","泉港区"]
        ,["南昌","萍乡","九江","新余","鹰潭","赣州","吉安","宜春","抚州","上饶","景德镇"]
        ,["郑州","开封","洛阳","平顶山","安阳","鹤壁","新乡","焦作","濮阳","许昌","漯河","三门峡","南阳","商丘","信阳","周口","驻马店","济源","西平","长葛"]
        ,["长沙","株洲","湘潭","衡阳","邵阳","岳阳","常德","张家界","益阳","郴州","永州","怀化","娄底","湘西"]
        ,["海口","三亚","洋浦市","琼海","儋州","五指山","文昌","万宁","东方","定安","屯昌","澄迈","临高","琼中","保亭","白沙","昌江","乐东","陵水"]
        ,["贵阳","六盘水","遵义","安顺","铜仁","黔西南","毕节","黔东南","黔南"]
        ,["哈尔滨","齐齐哈尔","鸡西","鹤岗","双鸭山","大庆","伊春","佳木斯","七台河","牡丹江","黑河","绥化","大兴安岭","安达","双城","尚志","绥芬河","肇东市"]
        ,["昆明","曲靖","玉溪","保山","昭通","楚雄","红河","文山","思茅","西双版纳","大理","德宏","丽江","怒江","迪庆","临沧","普洱"]
        ,["拉萨","昌都","山南","日喀则","那曲","阿里","林芝"]
        ,["兰州","嘉峪关","金昌","白银","天水","武威","张掖","平凉","酒泉","庆阳","定西","陇南","临夏","甘南"]
        ,["西宁","海东","海北","黄南","海南州","果洛","玉树","海西"]
        ,["银川","石嘴山","吴忠","固原","中卫"]
        ,["乌鲁木齐","克拉玛依","吐鲁番","哈密","昌吉","博尔塔拉","巴音郭楞","阿克苏","克孜勒苏","喀什","和田","伊犁","塔城","阿勒泰","石河子","奎屯市","乌苏","阿拉尔","图木舒克","五家渠"]
        ,["香港"]
        ,["澳门"]
        ,["台湾省"]
        ,["英国","美国","法国","德国","澳大利亚","白俄罗斯","比利时","巴西","加拿大","芬兰","爱尔兰","以色列","意大利","日本","韩国","新加坡","西班牙","瑞典","瑞士","泰国","越南","其他"] 
      ],
      sex:["男","女"],
      school:["同济大学"],
      schoolYear:[2008,2009,2010,2012,2013,2014,2015,2016,2017],
      schoolPart:["四平路校区","嘉定校区","沪北校区","沪西校区"],
      education:["本科","硕士研究生","博士研究生","专科","高职","教职人员"],
      identity:["学生","老师","教职人员"],
      hobby:["K歌","电影","追剧","明星","体育","健身","学术","交友","美食","旅游","上网","游戏","摄影","艺术","其他"],
      orderType:["K歌","电影","体育","学习","交友","美食","旅游","上网","游戏","考试","看病","摄影","其他"],
      pay:["受邀者请我","我请受邀者","各自买单","AA制","免费项目","面议"],
      inviteSex:["男","女","不限"],
      topic:["明星娱乐","学习考试","电竞游戏","拜师求艺","体育健身","旅游探险","美图美照","电子产品","其他"],
      auction:["电子产品","生活用品","学习用品","体育用品","票券类物品","虚拟物品","游戏相关","其他"],
      bool:["是","否"]
    }
  }
  function _addTextBox(){
    J.body().append(J.ct("div.textbox-wrapper.box-w.theme").html('\
      <div class="textbox-title">请输入</div>\
      <textarea class="textbox input"></textarea>\
      <div class="textbox-btnw">\
        <span class="textbox-btn btn" onclick="Box.text.confirm()">确认</span>\
        <span class="textbox-btn btn" onclick="Box.text.cancel()">取消</span>\
      </div>')
    );
  }
  function _addSelectBox(){
    J.body().append(J.ct("div.selectbox-wrapper.box-w.theme").html('\
    <div class="box-max-height"></div>\
    <div class="selectbox-item select-cancel" onclick="Box.select.cancel()">\
        <span class="box-viewmore">上下滑动浏览更多</span>\取消</div>'));
  }
  function _addMultiBox(){
    J.body().append(J.ct("div.multibox-wrapper.box-w.theme").html('\
      <div class="multi-list clearfix box-max-height">\
      </div>\
      <div class="multibox-btnw">\
        <span class="box-viewmore">上下滑动浏览更多</span>\
        <span class="multibox-btn btn" onclick="Box.multi.submit()">确认</span>\
        <span class="multibox-btn btn" onclick="Box.multi.cancel()">取消</span>\
      </div>'));
  }
  function _addCascadeBox(){
    J.body().append(J.ct("div.cascadebox-wrapper.box-w.theme").html('\
        <div class="cascade-center"></div>\
        <div class="cascadebox-list clearfix"></div>\
        <div class="cascadebox-btnw">\
        <span class="cascadebox-btn btn" onclick="Box.cascade.submit()">确认</span>\
        <span class="cascadebox-btn btn" onclick="Box.cascade.cancel()">取消</span>\
      </div>'));
  }
  function _addDateBox(){
    J.body().append(J.ct("div.datebox-wrapper.box-w.theme").html('\
        <div class="cascade-center"></div>\
        <div class="cascadebox-list date clearfix">\
          <div class="d-i">\
            <div>1950</div><div>1951</div><div>1952</div><div>1953</div><div>1954</div><div>1955</div><div>1956</div><div>1957</div><div>1958</div><div>1959</div><div>1960</div><div>1961</div><div>1962</div><div>1963</div><div>1964</div><div>1965</div><div>1966</div><div>1967</div><div>1968</div><div>1969</div><div>1970</div><div>1971</div><div>1972</div><div>1973</div><div>1974</div><div>1975</div><div>1976</div><div>1977</div><div>1978</div><div>1979</div><div>1980</div><div>1981</div><div>1982</div><div>1983</div><div>1984</div><div>1985</div><div>1986</div><div>1987</div><div>1988</div><div>1989</div><div>1990</div><div>1991</div><div>1992</div><div>1993</div><div>1994</div><div>1995</div><div>1996</div><div>1997</div><div>1998</div><div>1999</div><div>2000</div><div>2001</div><div>2002</div><div>2003</div><div>2004</div><div>2005</div><div>2006</div><div>2007</div><div>2008</div><div>2009</div><div>2010</div><div>2011</div><div>2012</div><div>2013</div><div>2014</div><div>2015</div><div>2016</div><div>2017</div><div>2018</div><div>2019</div><div>2020</div><div>2021</div><div>2022</div><div>2023</div><div>2024</div><div>2025</div><div>2026</div><div>2027</div><div>2028</div><div>2029</div><div>2030</div><div>2031</div><div>2032</div><div>2033</div><div>2034</div><div>2035</div><div>2036</div><div>2037</div><div>2038</div><div>2039</div><div>2040</div><div>2041</div><div>2042</div><div>2043</div><div>2044</div><div>2045</div><div>2046</div><div>2047</div><div>2048</div><div>2049</div><div>2050</div>\
          </div>\
          <div class="d-i">\
            <div>01</div><div>02</div><div>03</div><div>04</div><div>05</div><div>06</div><div>07</div><div>08</div><div>09</div><div>10</div><div>11</div><div>12</div>\
          </div>\
          <div class="d-i">\
            <div>01</div><div>02</div><div>03</div><div>04</div><div>05</div><div>06</div><div>07</div><div>08</div><div>09</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div><div>19</div><div>20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div><div>26</div><div>27</div><div>28</div><div>29</div><div>30</div><div>31</div>\
          </div>\
          <div class="d-i hide">\
            <div class="active">00</div><div>01</div><div>02</div><div>03</div><div>04</div><div>05</div><div>06</div><div>07</div><div>08</div><div>09</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div><div>19</div><div>20</div><div>21</div><div>22</div><div>23</div>\
          </div>\
          <div class="d-i hide">\
            <div class="active">00</div><div>01</div><div>02</div><div>03</div><div>04</div><div>05</div><div>06</div><div>07</div><div>08</div><div>09</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div><div>19</div><div>20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div><div>26</div><div>27</div><div>28</div><div>29</div><div>30</div><div>31</div><div>32</div><div>33</div><div>34</div><div>35</div><div>36</div><div>37</div><div>38</div><div>39</div><div>40</div><div>41</div><div>42</div><div>43</div><div>44</div><div>45</div><div>46</div><div>47</div><div>48</div><div>49</div><div>50</div><div>51</div><div>52</div><div>53</div><div>54</div><div>55</div><div>56</div><div>57</div><div>58</div><div>59</div>\
          </div>\
        </div>\
        <div class="cascadebox-btnw">\
        <span class="cascadebox-btn btn" onclick="Box.date.submit()">确认</span>\
        <span class="cascadebox-btn btn" onclick="Box.date.cancel()">取消</span>\
      </div>'));
  }
    
  function _addConfirmBox(){
    J.body().append(J.ct("div.confirmbox-wrapper.box-w.theme").html('\
      <div class="confirmbox-text">是否确认？</div>\
      <div class="confirmbox-btnw">\
        <div class="confirmbox-btn" onclick="Box.confirm.confirm()">确认</div>\
        <div class="confirmbox-btn" onclick="Box.confirm.cancel()">取消</div>\
      </div>')
    );
  }
  function _addSearch(def){
    J.body().append(J.ct("div.search-wrapper.theme").html('\
      <div class="s-i-w search"><input type="text" class="input theme-text theme-border"/></div>\
      <div class="s-i-w select">\
        <input type="text" class="input theme-text theme-border" readonly="true" value="'+def+'" onclick="Box.search.openSelect(this)"/>\
        <i class="icon icon-sort-down theme-text"></i>\
      </div>\
      <i class="icon icon-search search-img search" onclick="Box.search.search()"></i>\
      <i class="icon icon-times search-img close" onclick="Box.search.close()"></i>'));
  }
  function _addNavi(cur){
    var cls=['home','user','heart','star','cog'];
    var text=['我的校区','个人主页','我的动态','我的收藏','设置中心'];
    var _cover=J.ct("div.navi-cover").clk(Box.navi.close);
    var _navi=J.ct("div.navi.theme");
      var _items=[];
      _items.push(J.ct("i.navi-close.icon.icon-times").clk(Box.navi.close));
      cls.each(function(c,i){
        var _item=J.ct('div.navi-item')
          .clk("Box.navi.to("+i+")")
          .html('<i class="icon icon-'+cls[i]+'"></i>'+text[i]);
        if(i==cur){
          _item.addClass('active');
        }
        _items.push(_item);
      });
    _navi.append(_items);
    J.body().append([_cover,_navi]);
  }
  function _checkData(data){
    var d={data:""};
    if(data!=undefined){
      if(J.type(data)=="json"){
        d;
      }else{
        d.data=data;
      }
    }
    return d;
  }
})()
