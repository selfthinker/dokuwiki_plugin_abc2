// abc2svg - ABC to SVG translator
// @source: https://chiselapp.com/user/moinejf/repository/abc2svg
// Copyright (C) 2014-2019 Jean-Francois Moine - LGPL3+
//soloffs.js-module to set the X offset of some elements at start of music line
abc2svg.soloffs={set_fmt:function(of,cmd,parm){if(cmd=="soloffs"){var i,v,C=abc2svg.C,soloffs=this.cfmt().soloffs={}
parm=parm.split(/\s+/)
while(parm.length){i=parm.shift().split('=')
v=Number(i[1])
if(isNaN(v))
continue
switch(i[0]){case'part':soloffs[C.PART]=v+10
break
case'tempo':soloffs[C.TEMPO]=v+16
break
case'space':soloffs[C.SPACE]=v
break}}
return}
of(cmd,parm)},set_sym_glue:function(of,width){var s,C=abc2svg.C,tsfirst=this.get_tsfirst(),soloffs=this.cfmt().soloffs;of(width)
if(!soloffs)
return
for(s=tsfirst;s;s=s.ts_next){if(s.dur)
break
if(soloffs[s.type]!=undefined)
s.x=soloffs[s.type]}},set_hooks:function(abc){abc.set_sym_glue=abc2svg.soloffs.set_sym_glue.bind(abc,abc.set_sym_glue);abc.set_format=abc2svg.soloffs.set_fmt.bind(abc,abc.set_format)}}
abc2svg.modules.hooks.push(abc2svg.soloffs.set_hooks);abc2svg.modules.soloffs.loaded=true
