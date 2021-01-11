// abc2svg - ABC to SVG translator
// @source: https://chiselapp.com/user/moinejf/repository/abc2svg
// Copyright (C) 2014-2020 Jean-Francois Moine - LGPL3+
//perc.js-module to handle%%percmap
abc2svg.perc={do_perc:function(parm){var pits=new Int8Array([0,0,1,2,2,3,3,4,5,5,6,6]),accs=new Int8Array([3,1,3,-1,3,3,1,3,-1,3,-1,3])
var prn={"a-b-d":35,"a-s":38,"b-d-1":36,"ca":69,"cl":75,"co":56,"c-c":52,"c-c-1":49,"c-c-2":57,"c-h-h":42,"e-s":40,"h-a":67,"h-b":60,"h-c":39,"h-f-t":43,"h-m-t":48,"h-ti":65,"h-to":50,"h-w-b":76,"l-a":68,"l-b":61,"l-c":64,"l-f-t":41,"l-g":74,"l-m-t":47,"l-ti":66,"l-to":45,"l-w":72,"l-w-b":77,"m":70,"m-c":78,"m-h-c":62,"m-t":80,"o-c":79,"o-h-c":63,"o-h-h":46,"o-t":81,"p-h-h":44,"r-b":53,"r-c-1":51,"r-c-2":59,"s-c":55,"s-g":73,"s-s":37,"s-w":71,"t":54,"v":58}
function abc_b40(p){var pit,acc=0,i=0
switch(p[0]){case'^':if(p[++i]=='^'){acc=2
i++}else{acc=1}
break
case'=':i++
break
case'_':if(p[++i]=='_'){acc=-2
i++}else{acc=-1}
break}
pit='CDEFGABcdefgab'.indexOf(p[i++])+16
if(pit<16)
return
while(p[i]=="'"){pit+=7
i++}
while(p[i]==","){pit-=7
i++}
if(p[i])
return
return abc2svg.pab40(pit,acc)}
function topit(p){var i,j,s,b40,pit=Number(p)
if(isNaN(pit)){b40=abc_b40(p)
if(!b40){p=p.toLowerCase(p);s=p[0];i=0
while(1){j=p.indexOf('-',i)
if(j<0)
break
i=j+1;s+='-'+p[i]}
pit=prn[s]
if(!pit){switch(p[0]){case'c':switch(p[1]){case'a':pit=prn.ca;break
case'l':pit=prn.cl;break
case'o':pit=prn.co;break}
break
case'h':case'l':i=p.indexOf('-')
if(p[i+1]!='t')
break
switch(p[1]){case'i':case'o':pit=prn[s+p[1]]
break}
break}
if(!pit)
return}}}
if(!b40){p=(pit/12)|0
pit=pit%12;b40=p*40+abc2svg.isb40[pit]+2}
return{pit:abc2svg.b40p(b40),acc:abc2svg.b40a(b40)}}
var vpr,vpl,maps=this.get_maps(),a=parm.split(/\s+/),n=abc_b40(a[1])
if(!n){this.syntax(1,this.errs.bad_val,"%%percmap")
return}
vpr={pit:abc2svg.b40p(n),acc:0}
vpl=topit(a[2])
if(!vpl.pit){this.syntax(1,this.errs.bad_val,"%%percmap")
return}
a=a[3]?[a[3]]:null
if(!maps.MIDIdrum)
maps.MIDIdrum={}
n=n.toString()
if(!maps.MIDIdrum[n]){maps.MIDIdrum[n]=[a,vpr,null,vpl]}else{if(a)
maps.MIDIdrum[n][0]=a
if(!maps.MIDIdrum[n][1])
maps.MIDIdrum[n][1]=vpr
maps.MIDIdrum[n][3]=vpl}
this.set_v_param("perc","MIDIdrum")},set_perc:function(a){var i,item,curvoice=this.get_curvoice()
for(i=0;i<a.length;i++){switch(a[i]){case"perc=":if(!curvoice.map)
curvoice.map={}
curvoice.map=a[i+1];if(!curvoice.midictl)
curvoice.midictl=[]
curvoice.midictl[0]=1
break}}},do_pscom:function(of,text){if(text.slice(0,8)=="percmap ")
abc2svg.perc.do_perc.call(this,text)
else
of(text)},set_vp:function(of,a){abc2svg.perc.set_perc.call(this,a);of(a)},set_hooks:function(abc){abc.do_pscom=abc2svg.perc.do_pscom.bind(abc,abc.do_pscom);abc.set_vp=abc2svg.perc.set_vp.bind(abc,abc.set_vp)}}
abc2svg.modules.hooks.push(abc2svg.perc.set_hooks);abc2svg.modules.percmap.loaded=true
