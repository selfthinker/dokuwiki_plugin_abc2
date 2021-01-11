// abc2svg - ABC to SVG translator
// @source: https://chiselapp.com/user/moinejf/repository/abc2svg
// Copyright (C) 2014-2020 Jean-Francois Moine - LGPL3+
//#javascript
window.onerror=function(msg,url,line){if(typeof msg=='string')
alert("window error: "+msg+"\nURL: "+url+"\nLine: "+line)
else if(typeof msg=='object')
alert("window error: "+msg.type+' '+msg.target.src)
else
alert("window error: "+msg)
return false}
var user
if(typeof abc2svg=="undefined")
var abc2svg={}
function dom_loaded(){var abc,new_page,src,a_inc={},errtxt='',app="abcweb",playing,abcplay,playconf={onend:function(){playing=false}},page,tune_lst,jsdir=document.currentScript?document.currentScript.src.match(/.*\//):(function(){var s_a=document.getElementsByTagName('script')
for(var k=0;k<s_a.length;k++){if(s_a[k].src.indexOf(app)>=0)
return s_a[k].src.match(/.*\//)||''}
return""})()
user={read_file:function(fn){return a_inc[fn]},errmsg:function(msg,l,c){errtxt+=clean_txt(msg)+'\n'},img_out:function(str){new_page+=str}}
function clean_txt(txt){return txt.replace(/<|>|&.*?;|&/g,function(c){switch(c){case'<':return"&lt;"
case'>':return"&gt;"
case'&':return"&amp;"}
return c})}
abc2svg.playseq=function(evt){var i,j,svg=evt.target,e=svg
while(svg.tagName!='svg'){svg=svg.parentNode
if(!svg)
return}
i=svg.getAttribute('class')
if(!i)
return
i=i.match(/tune(\d+)/)
if(!i)
return
i=i[1]
if(!abcplay){if(typeof AbcPlay=="undefined"){abc2svg.playseq=function(){}
return}
abcplay=AbcPlay(playconf)}
if(!tune_lst){tune_lst=abc.tunes
for(j=0;j<tune_lst.length;j++)
abcplay.add(tune_lst[j][0],tune_lst[j][1],tune_lst[j][3])}
s=tune_lst[i][0]
i=e.getAttribute('class')
if(i)
i=i.match(/abcr _(\d+)_/)
if(playing){abcplay.stop();if(!i)
return}
if(i){i=i[1]
while(s&&s.istart!=i)
s=s.ts_next
if(!s){alert("play bug: no such symbol in the tune")
return}}
playing=true
abcplay.play(s,null)}
function toabc(s){return s.replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&').replace(/[ \t]+(%%|.:)/g,'$1')}
abc2svg.loadjs=function(fn,relay,onerror){var s=document.createElement('script');if(/:\/\//.test(fn))
s.src=fn
else
s.src=jsdir+fn;if(relay)
s.onload=relay;s.onerror=onerror||function(){alert('error loading '+fn)}
document.head.appendChild(s)}
function render(){var i=0,j,k,res,re=/<script type="text\/vnd.abc"|<[^>]* class="abc"|%abc-\d|X:\d/g,re_stop=/\n<|\n%.begin[^\s]+/g
if(typeof follow=="function")
user.anno_stop=function(){};abc=new abc2svg.Abc(user)
new_page=''
if(typeof follow=="function")
follow(abc,user,playconf)
j=page.indexOf("<mei ")
if(j>=0){k=page.indexOf("</mei>")+6
abc.mei2mus(page.slice(j,k))
document.body.innerHTML=new_page
return}
src='%%beginml\n'
for(;;){res=re.exec(page)
if(!res){src+=page.slice(i).replace(/\n%%/g,"\n%%%%")+"\n%%endml\n"
break}
j=re.lastIndex-res[0].length;src+=page.slice(i,j).replace(/\n%%/g,"\n%%%%")
switch(res[0][0]){default:res=res[0].match(/<([^\s]*)/)[1]
if(res=='script'){j=page.indexOf('>',j)+2
i=page.indexOf('</'+res,j)
src+="%%endml\n"+
page.slice(j,i)
i+=10}else{i=page.indexOf('>',j)+1
src+=page.slice(j,i)+"\n%%endml\n"
i=page.indexOf('\n',i)
j=page.indexOf('</'+res,i)
src+=toabc(page.slice(i,j))
i=j}
break
case'%':case'X':if(j!=0&&page[j-1]!='\n'){src+=res[0]
i=re.lastIndex
continue}
re_stop.lastIndex=j
while(1){res=re_stop.exec(page)
if(!res||res[0]=="\n<")
break
k=page.indexOf(res[0].replace("begin","end"),re_stop.lastIndex)
if(k<0)
break
re_stop.lastIndex=k}
if(!res||k<0)
i=page.length
else
i=re_stop.lastIndex-1
src+="%%endml\n"+page.slice(j,i)
break}
if(i<0)
break
re.lastIndex=i
src+='%%beginml\n'}
k=location.search.substr(1).split("&")
for(i=0;i<k.length;i++){if(k[i]){j=k[i].split('=')
if(j[0])
abc.tosvg(app,"%%"+j[0]+" "+
decodeURIComponent(j[1]))}}
try{abc.tosvg(app,src)}catch(e){alert("abc2svg javascript error: "+e.message+"\nStack:\n"+e.stack)}
abc2svg.abc_end()
if(errtxt){new_page+='<pre class="nop" style="background:#ff8080">'+
errtxt+"</pre>\n"
errtxt=""}
try{document.body.innerHTML=new_page}catch(e){alert("abc2svg bad generated SVG: "+e.message+"\nStack:\n"+e.stack)}
window.onclick=abc2svg.playseq}
function include(){var i,j,fn,r,k=0
while(1){i=page.indexOf('%%abc-include ',k)
if(i<0){render()
return}
i+=14
j=page.indexOf('\n',i)
fn=page.slice(i,j).trim()
if(!a_inc[fn])
break
k=j}
r=new XMLHttpRequest()
r.open('GET',fn,true)
r.onload=function(){if(r.status===200){a_inc[fn]=r.responseText
if(abc2svg.modules.load(a_inc[fn],include))
include()}else{a_inc[fn]='%\n'
alert('Error getting '+fn+'\n'+r.statusText)
include()}}
r.onerror=function(){a_inc[fn]='%\n'
alert('Error getting '+fn+'\n'+r.statusText)
include()}
r.send()}
page=document.body.innerHTML
if(!abc2svg.Abc){abc2svg.loadjs(page.indexOf("<mei ")>=0?"mei2svg-1.js":"abc2svg-1.js",dom_loaded)
return}
abc2svg.abc_end=function(){}
if(abc2svg.modules.load(page,include))
include()}
window.addEventListener("load",dom_loaded)
