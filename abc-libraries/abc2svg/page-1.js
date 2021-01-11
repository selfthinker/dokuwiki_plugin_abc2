// abc2svg - ABC to SVG translator
// @source: https://chiselapp.com/user/moinejf/repository/abc2svg
// Copyright (C) 2014-2020 Jean-Francois Moine - LGPL3+
//page.js-module to generate pages
abc2svg.page={img_out:function(page,p){var cur_img_out=user.img_out;page.user_out(p)
if(user.img_out!=cur_img_out){page.user_out=user.img_out
user.img_out=cur_img_out}},abc_end:function(of){var page=this.page
if(page&&page.in_page){abc2svg.page.close_page(page)
if(user.img_out==page.img_out_sav)
user.img_out=page.user_out}
of()},gen_hf:function(page,ty){var a,i,j,k,x,y,y0,s,font=page.abc.get_font(ty),str=page[ty],cfmt=page.abc.cfmt(),fh=font.size*1.1,pos=['">','" text-anchor="middle">','" text-anchor="end">']
function header_footer(o_font,str){var c,i,k,t,n_font,c_font=o_font,nl=1,j=0,r=["","",""]
if(str[0]=='"')
str=str.slice(1,-1)
if(str.indexOf('\t')<0)
str='\t'+str
for(i=0;i<str.length;i++){c=str[i]
switch(c){case'>':r[j]+="&gt;"
continue
case'<':r[j]+="&lt;"
continue
case'&':for(k=i+1;k<i+8;k++){if(!str[k]||str[k]=='&'||str[k]==';')
break}
r[j]+=str[k]==';'?"&":"&amp;"
continue
case'\t':if(j<2)
j++
continue
case'\\':if(c_font!=o_font){r[j]+="</tspan>"}
for(j=0;j<3;j++)
r[j]+='\n';nl++;j=0;i++
continue
default:r[j]+=c
continue
case'$':break}
c=str[++i]
switch(c){case'd':if(!abc2svg.get_mtime)
break
t=abc2svg.get_mtime(page.abc.parse.fname)
case'D':if(c=='D')
t=new Date()
if(cfmt.dateformat[0]=='"')
cfmt.dateformat=cfmt.dateformat.slice(1,-1)
r[j]+=strftime(cfmt.dateformat,t)
break
case'F':r[j]+=page.abc.parse.fname
break
case'I':c=str[++i]
case'T':t=page.abc.info()[c]
if(t)
r[j]+=t.split('\n',1)[0]
break
case'P':case'Q':t=c=='P'?page.pn:page.pna
switch(str[i+1]){case'0':i++
if(!(t&1))
r[j]+=t
break
case'1':i++
if(t&1)
r[j]+=t
break
default:r[j]+=t
break}
break
case'V':r[j]+="abc2svg-"+abc2svg.version
break
default:if(c=='0')
n_font=o_font
else if(c>='1'&&c<'9')
n_font=page.abc.get_font("u"+c)
else
break
if(n_font==c_font)
break
if(c_font!=o_font)
r[j]+="</tspan>";c_font=n_font
if(c_font==o_font)
break
r[j]+='<tspan class="'+
font_class(n_font)+'">'
break}}
if(c_font!=o_font)
r[j]+="</tspan>";r[4]=nl
return r}
function font_class(font){if(font.class)
return'f'+font.fid+cfmt.fullsvg+' '+font.class
return'f'+font.fid+cfmt.fullsvg}
if(str[0]=='-'){if(page.pn==1)
return 0
str=str.slice(1)}
a=header_footer(font,str)
y0=font.size*.8
for(i=0;i<3;i++){str=a[i]
if(!str)
continue
if(i==0)
x=cfmt.leftmargin
else if(i==1)
x=cfmt.pagewidth/2
else
x=cfmt.pagewidth-cfmt.rightmargin
y=y0
k=0
while(1){j=str.indexOf('\n',k)
if(j>=0)
s=str.slice(k,j)
else
s=str.slice(k)
if(s)
page.hf+='<text class="'+
font_class(font)+'" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+
pos[i]+
s+'</text>\n'
if(j<0)
break
k=j+1
y+=fh}}
return fh*a[4]},open_page:function(page,ht){var h,l,abc=page.abc,cfmt=abc.cfmt(),sty='<div style="line-height:0'
page.pn++
page.pna++
if(page.first)
page.first=false
else
sty+=";page-break-before:always"
if(page.gutter)
sty+=";margin-left:"+
((page.pn&1)?page.gutter:-page.gutter).toFixed(1)+"px"
abc2svg.page.img_out(page,sty+'">')
page.in_page=true
ht+=page.topmargin
page.hmax=cfmt.pageheight-page.botmargin-ht
page.hf=''
if(page.header){l=abc.get_font_style().length
h=abc2svg.page.gen_hf(page,"header")
sty=abc.get_font_style().slice(l)
if(cfmt.fullsvg||sty!=page.hsty){page.hsty=sty
sty='<style>'+sty+'\n</style>\n'}else{sty=''}
abc2svg.page.img_out(page,'<svg xmlns="http://www.w3.org/2000/svg" version="1.1"\n\
 xmlns:xlink="http://www.w3.org/1999/xlink"\n\
 width="'+cfmt.pagewidth.toFixed(0)+'px" height="'+(ht+h).toFixed(0)+'px">\n'+sty+'<g transform="translate(0,'+
page.topmargin.toFixed(1)+')">'+
page.hf+'</g>\n</svg>')
page.hmax-=h;page.hf=''}else{abc2svg.page.img_out(page,'<svg xmlns="http://www.w3.org/2000/svg" version="1.1"\n\
 xmlns:xlink="http://www.w3.org/1999/xlink"\n\
 width="'+cfmt.pagewidth.toFixed(0)+'px" height="'+ht.toFixed(0)+'px">\n</svg>')}
if(page.footer){l=abc.get_font_style().length
page.fh=abc2svg.page.gen_hf(page,"footer")
sty=abc.get_font_style().slice(l)
if(cfmt.fullsvg||sty!=page.fsty){page.fsty=sty
page.ffsty='<style>'+sty+'\n</style>\n'}else{page.ffsty=''}
page.hmax-=page.fh}
page.h=0},close_page:function(page){var h,cfmt=page.abc.cfmt()
page.in_page=false
if(page.footer){h=page.hmax+page.fh-page.h
abc2svg.page.img_out(page,'<svg xmlns="http://www.w3.org/2000/svg" version="1.1"\n\
 xmlns:xlink="http://www.w3.org/1999/xlink"\n\
 width="'+cfmt.pagewidth.toFixed(0)+'px" height="'+h.toFixed(0)+'px">\n'+page.ffsty+'<g transform="translate(0,'+
(h-page.fh).toFixed(1)+')">'+
page.hf+'</g>\n</svg>')}
abc2svg.page.img_out(page,'</div>')
page.h=0},img_in:function(p){var h,ht,nh,page=this.page
function blkcpy(page){while(page.blk.length)
abc2svg.page.img_out(page,page.blk.shift())
page.blk=null}
switch(p.slice(0,4)){case"<div":if(p.indexOf('newpage')>0||(page.oneperpage&&this.info().X)||!page.h){if(page.in_page)
abc2svg.page.close_page(page)
abc2svg.page.open_page(page,0)}
page.blk=[]
page.hb=page.h
break
case"<svg":h=Number(p.match(/height="(\d+)px"/)[1])
while(h+page.h>=page.hmax){ht=page.blk?0:this.cfmt().topspace
if(page.blk){if(!page.hb){blkcpy(page)
nh=0}else{nh=page.h-page.hb
page.h=page.hb}}
abc2svg.page.close_page(page)
abc2svg.page.open_page(page,ht)
if(page.blk){blkcpy(page)
page.h=nh}
if(h>page.hmax)
break}
if(page.blk)
page.blk.push(p)
else
abc2svg.page.img_out(page,p)
page.h+=h
break
case"</di":if(page.blk)
blkcpy(page)
break}},set_fmt:function(of,cmd,parm){var v,cfmt=this.cfmt(),page=this.page
if(cmd=="pageheight"){v=this.get_unit(parm)
if(isNaN(v)){this.syntax(1,this.errs.bad_val,'%%'+cmd)
return}
cfmt.pageheight=v
if(!page&&user.img_out&&abc2svg.abc_end){this.page=page={abc:this,topmargin:38,botmargin:38,h:0,pn:0,pna:0,first:true,user_out:user.img_out}
if(cfmt.header){page.header=cfmt.header;cfmt.header=null}
if(cfmt.footer){page.footer=cfmt.footer;cfmt.footer=null}
if(cfmt.botmargin!=undefined){v=this.get_unit(cfmt.botmargin)
if(!isNaN(v))
page.botmargin=v}
if(cfmt.topmargin!=undefined){v=this.get_unit(cfmt.topmargin)
if(!isNaN(v))
page.topmargin=v}
if(cfmt.gutter!=undefined){v=this.get_unit(cfmt.gutter)
if(!isNaN(v))
page.gutter=v}
if(cfmt.oneperpage)
page.oneperpage=this.get_bool(cfmt.oneperpage)
if(!cfmt.dateformat)
cfmt.dateformat="%b %e, %Y %H:%M"
user.img_out=abc2svg.page.img_in.bind(this);page.img_out_sav=user.img_out;abc2svg.abc_end=abc2svg.page.abc_end.bind(this,abc2svg.abc_end)}
return}
if(page){switch(cmd){case"header":case"footer":page[cmd]=parm
return
case"newpage":if(!parm)
break
v=Number(parm)
if(isNaN(v)){this.syntax(1,this.errs.bad_val,'%%'+cmd)
return}
page.pn=v-1
return
case"gutter":case"botmargin":case"topmargin":v=this.get_unit(parm)
if(isNaN(v)){this.syntax(1,this.errs.bad_val,'%%'+cmd)
return}
page[cmd]=v
return
case"oneperpage":page[cmd]=this.get_bool(parm)
return}}
of(cmd,parm)},set_hooks:function(abc){abc.set_format=abc2svg.page.set_fmt.bind(abc,abc.set_format)
user.page_format=true
abc.set_pagef()}}
abc2svg.modules.hooks.push(abc2svg.page.set_hooks);abc2svg.modules.pageheight.loaded=true
function strftime(sFormat,date){if(!(date instanceof Date))date=new Date();var nDay=date.getDay(),nDate=date.getDate(),nMonth=date.getMonth(),nYear=date.getFullYear(),nHour=date.getHours(),aDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],aMonths=['January','February','March','April','May','June','July','August','September','October','November','December'],aDayCount=[0,31,59,90,120,151,181,212,243,273,304,334],isLeapYear=function(){return(nYear%4===0&&nYear%100!==0)||nYear%400===0},getThursday=function(){var target=new Date(date);target.setDate(nDate-((nDay+6)%7)+3);return target},zeroPad=function(nNum,nPad){return((Math.pow(10,nPad)+nNum)+'').slice(1)};return sFormat.replace(/%[a-z]/gi,function(sMatch){return(({'%a':aDays[nDay].slice(0,3),'%A':aDays[nDay],'%b':aMonths[nMonth].slice(0,3),'%B':aMonths[nMonth],'%c':date.toUTCString(),'%C':Math.floor(nYear/100),'%d':zeroPad(nDate,2),'%e':nDate,'%F':date.toISOString().slice(0,10),'%G':getThursday().getFullYear(),'%g':(getThursday().getFullYear()+'').slice(2),'%H':zeroPad(nHour,2),'%I':zeroPad((nHour+11)%12+1,2),'%j':zeroPad(aDayCount[nMonth]+nDate+((nMonth>1&&isLeapYear())?1:0),3),'%k':nHour,'%l':(nHour+11)%12+1,'%m':zeroPad(nMonth+1,2),'%n':nMonth+1,'%M':zeroPad(date.getMinutes(),2),'%p':(nHour<12)?'AM':'PM','%P':(nHour<12)?'am':'pm','%s':Math.round(date.getTime()/1000),'%S':zeroPad(date.getSeconds(),2),'%u':nDay||7,'%V':(function(){var target=getThursday(),n1stThu=target.valueOf();target.setMonth(0,1);var nJan1=target.getDay();if(nJan1!==4)target.setMonth(0,1+((4-nJan1)+7)%7);return zeroPad(1+Math.ceil((n1stThu-target)/604800000),2)})(),'%w':nDay,'%x':date.toLocaleDateString(),'%X':date.toLocaleTimeString(),'%y':(nYear+'').slice(2),'%Y':nYear,'%z':date.toTimeString().replace(/.+GMT([+-]\d+).+/,'$1'),'%Z':date.toTimeString().replace(/.+\((.+?)\)$/,'$1')}[sMatch]||'')+'')||sMatch})}
