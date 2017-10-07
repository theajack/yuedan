
J.ready(function(){
  J.cls("editor").each(function(item){
    var title=item.attr("e-title");
    var name=item.hasAttr("e-name")?item.attr("e-name"):null;
    var valid=item.hasAttr("e-valid")?item.attr("e-valid"):null;
    var _title=J.ct("div.editor-title");
      var _span=J.ct("span").txt(title);
      var _picture=J.ct("i.icon.icon-picture").clk(Editor.uploadImg);//(Editor.openFile);
      var _file=J.ct("input.editor-file[type=file][name=file][accept=image/*]").on("change",Editor.uploadImg);
      var _link=J.ct("i.icon.icon-link").clk(Editor.toggleLink);
      var _link_box=J.ct("div.link-box").html('\
            <div class="input-w">\
              <span class="create-title theme-text">链接名称</span>\
              <input class="input" l-name="name" type="text" placeholder="默认为链接地址"/>\
            </div>\
            <div class="input-w">\
              <span class="create-title theme-text">链接地址</span>\
              <input class="input" type="text" l-name="url" l-valid="notnull"/>\
              <span class="valid"></span>\
            </div>\
            <div class="create-btnw">\
              <div class="create-btn btn theme" onclick="Editor.insertLink(this)">插入链接</div>\
            </div>');
      var _face=J.ct("i.icon.icon-smile").clk(Editor.toggleFace);
      var _face_box=J.ct("div.face-box");
      for(var i=1;i<=40;i++){
        _face_box.append(J.ct("img.face-item[src=assets/images/rabbit/rabbit ("+i+").gif][rt="+i+"]").clk(function(){
          this.parent(2).next().append(J.ct("img.rabbit[src="+this.attr("src")+"][rt="+this.attr("rt")+"]"));
          this.parent().fadeOut(null,'fast');
        }));
      }
    _title.append([_span,_picture,_file,_link,_link_box,_face,_face_box])
    var _editor=J.ct("div.editor-box.input[contenteditable=true]");
    if(name!=null){_editor.attr("j-name",name).attr("j-get","html")}
    if(valid!=null){_editor.attr("j-valid",valid).attr("j-get","html")}
    item.append([_title,_editor]);
    J.initValid(item);
    initOneValid(J.attr("l-name=url"));
    initOneValid(J.cls("editor-box"));
  });
});
var Editor={
  toggleFace:function(){
    this.next().fadeToggle();
  },
  toggleLink:function(){
    this.next().fadeToggle();
  },
  openFile:function(){
    this.next().click();
  },
  uploadImg:function(){
    J.show("test upload");
    var box=this.parent().next();
    box.append(J.ct("img.editor-img").attr("src","assets/images/404.png"));
    box.append(J.ct("br"));
  },
  insertLink:function(obj){
    if(J.validInput(obj.parent().prev().child(1),"l-valid")=="true"){
      var data=obj.parent(2).get("json","l-name");
      if(data.name==""){
        data.name=data.url;
      }
      var box=obj.parent(3).next();
      box.append(J.ct("span.editor-link[contenteditable=false][onclick=J.jump('"+data.url+"')]").txt(data.name)).html(box.html()+"&nbsp;");
      obj.parent(2).fadeOut(function(aa){
        aa.set({
          name:'',
          url:'http://'
        },null,"l-name");
      },"fast");
    }else{
      J.show("链接有误","error")
    }
  }
  
}

function addFace(obj){
  obj.parent(2).next().append(J.new("img.rabbit[src="+obj.attr("src")+"][rt="+obj.attr("rt")+"]"));
  obj.parent().fadeOut(null,'fast').prev().attr("data-show","false");
}

function initFaceBox(){
  J.class("face-box").each(function(box){
    box.prev().clk(function(){
      if(this.attr("data-show")=="true"){
        this.attr("data-show","false");
        this.next().fadeOut(null,'fast');
      }else{
        this.attr("data-show","true");
        this.next().fadeIn(null,'fast');
      }
    });
    for(var i=1;i<=40;i++){
      box.append(J.new("img.face-item[src=assets/images/rabbit/rabbit ("+i+").gif][rt="+i+"][onclick=addFace(this)]"));
    }
  });
}