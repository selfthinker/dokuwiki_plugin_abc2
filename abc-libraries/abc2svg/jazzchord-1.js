// abc2svg - ABC to SVG translator
// @source: https://chiselapp.com/user/moinejf/repository/abc2svg
// Copyright (C) 2014-2020 Jean-Francois Moine - LGPL3+
//abc2svg-jazzchord.js-Adds jazz chord styling to chord symbols
abc2svg.jazzchord={gch_build:function(of,s){var gch,i,ix,t
if(!this.cfmt().jazzchord){of(s)
return}
for(ix=0;ix<s.a_gch.length;ix++){gch=s.a_gch[ix]
t=gch.text
if(gch.type!='g'||t.indexOf('$')>=0)
continue
switch(t){case"/":gch.text="&#x1d10d;";continue
case"%":gch.text="&#x1d10e;";continue
case"%%":gch.text="&#x1d10e;";continue}
if(abc2svg.jazzchord.rep){t=t.replace(abc2svg.jazzchord.reg,function(x){return abc2svg.jazzchord.rep[x]})}
t=t.replace(/-|°|º|ᵒ|0|6\/9|\^/g,function(x){switch(x){case'-':return"–"
case'0':return"ø"
case'6/9':return"⁶⁄₉"
case'^':return"∆"
default:return"o"}})
if(t[0]=='(')
t=t.slice(1,-1)
i=1
switch(t[1]){case"\u266f":case"\u266d":i++
break}
a=t.match(/([A-G])([#♯b♭]?)([^/]*)\/?(.*)/)
if(!a)
continue
if(!a[2])
t=a[1]
else
t="$6"+a[1]+"$7"+a[2]+"$0"
if(a[3])
t+="$8"+a[3]+"$0"
if(a[4])
t+="/$9"+a[4]+"$0"
if(gch.text[0]=='(')
gch.text='('+t+')'
else
gch.text=t}
of(s)},set_fmt:function(of,cmd,parm){var r,k
if(cmd=="jazzchord"){this.cfmt().jazzchord=this.get_bool(parm)
if(parm&&parm.indexOf('=')>0){parm=parm.split(/[\s]+/)
abc2svg.jazzchord.rep={}
r=[]
for(cmd=0;cmd<parm.length;cmd++){k=parm[cmd].split('=')
if(k.length==2){abc2svg.jazzchord.rep[k[0]]=k[1]
r.push(k[0])}}
abc2svg.jazzchord.reg=new RegExp(r.join('|'))}
return}
of(cmd,parm)},set_hooks:function(abc){abc.gch_build=abc2svg.jazzchord.gch_build.bind(abc,abc.gch_build)
abc.set_format=abc2svg.jazzchord.set_fmt.bind(abc,abc.set_format)
abc.add_style("\n.jc6{letter-spacing:-0.05em}\
\n.jc7{baseline-shift:30%;font-size:75%}\
\n.jc8{baseline-shift:25%;font-size:75%;letter-spacing:-0.05em}\
\n.jc9{font-size:75%;letter-spacing:-0.05em}\
")
abc.param_set_font("setfont-6","* * class=jc6")
abc.param_set_font("setfont-7","* * class=jc7")
abc.param_set_font("setfont-8","* * class=jc8")
abc.param_set_font("setfont-9","* * class=jc9")}}
abc2svg.modules.hooks.push(abc2svg.jazzchord.set_hooks)
abc2svg.modules.jazzchord.loaded=true
