(this["webpackJsonpreact-webaudio-5150"]=this["webpackJsonpreact-webaudio-5150"]||[]).push([[0],{37:function(e,t,n){},39:function(e,t,n){},53:function(e,t){},55:function(e,t){},67:function(e,t,n){},68:function(e,t,n){"use strict";n.r(t);var a,c=n(0),r=n(1),i=n.n(r),o=n(30),u=n.n(o),s=(n(37),n(20)),l=n.n(s),d=n(22),f=n(2),b=n(31),p=n(3),j=(n(39),n(4)),m=function(e){var t,n=e.index,a=e.sourceUrl,i=e.context,o=e.factory,u=e.compiler,s=e.onPluginReady,l=Object(r.useState)(),d=Object(p.a)(l,2),f=d[0],b=d[1],m=Object(r.useRef)(!1);if(Object(r.useEffect)((function(){o&&i&&u&&!f&&!m.current&&fetch(a).then((function(e){return e.text()})).then((function(e){m.current=!0,o.compileNode(i,"Pedal"+n,u,e,"-ftz 2",!1,128).then((function(e){b(e),s([e],n)}))}))}),[a,i,o,u,s,n,f,m]),!f)return null;var v=f.fDescriptor.filter((function(e){var t=e.type;return"vslider"===t||"hslider"===t}));return Object(c.jsxs)("div",{className:"plugin pedal",children:[Object(c.jsx)("div",{className:"plugin-title",children:null===f||void 0===f||null===(t=f.fJSONDsp)||void 0===t?void 0:t.name}),Object(c.jsx)("div",{className:"knobs-wrapper",children:v.map((function(e){var t=e.address,n=e.init,a=e.label,r=e.min,i=e.max;e.step;return Object(c.jsxs)("div",{className:"knob",children:[Object(c.jsx)("label",{htmlFor:t,children:a.toUpperCase()}),Object(c.jsxs)(j.Knob,{size:50,angleOffset:220,angleRange:280,min:r,max:i,value:n||.01,onChange:function(e){return function(e,t){f.setParamValue(e,t)}(t,e)},children:[Object(c.jsx)(j.Arc,{arcWidth:2.5,color:"#FC5A96",radius:18.75}),Object(c.jsx)(j.Pointer,{width:2.5,radius:20,type:"circle",color:"#180094"}),Object(c.jsx)(j.Value,{marginBottom:20,className:"value"})]})]},t)}))})]})},v=n(14),h=n(21),O=n.n(h);!function(e){e[e.signature=0]="signature",e[e.version=1]="version",e[e.preamp_level=2]="preamp_level",e[e.preamp_bias=3]="preamp_bias",e[e.preamp_Kreg=4]="preamp_Kreg",e[e.preamp_Upor=5]="preamp_Upor",e[e.tonestack_low_freq=6]="tonestack_low_freq",e[e.tonestack_low_band=7]="tonestack_low_band",e[e.tonestack_middle_freq=8]="tonestack_middle_freq",e[e.tonestack_middle_band=9]="tonestack_middle_band",e[e.tonestack_high_freq=10]="tonestack_high_freq",e[e.tonestack_high_band=11]="tonestack_high_band",e[e.amp_level=12]="amp_level",e[e.amp_bias=13]="amp_bias",e[e.amp_Kreg=14]="amp_Kreg",e[e.amp_Upor=15]="amp_Upor",e[e.sag_time=16]="sag_time",e[e.sag_coeff=17]="sag_coeff",e[e.output_level=18]="output_level"}(a||(a={}));var g,x=function(e,t){return e?e.fDescriptor.filter((function(e){return e.type===t})):[]},C=function(e){var t,n=e.index,i=e.context,o=e.factory,u=e.compiler,s=e.onPluginReady,l=Object(r.useState)(),d=Object(p.a)(l,2),f=d[0],b=d[1],m=Object(r.useState)(),h=Object(p.a)(m,2),g=h[0],C=h[1],_=Object(r.useState)(!1),y=Object(p.a)(_,2),k=y[0],S=y[1],w=Object(r.useRef)(!1);if(Object(r.useEffect)((function(){!f&&o&&i&&u&&!w.current&&(w.current=!0,fetch("/kpp_tubeamp.dsp").then((function(e){return e.text()})).then((function(e){o.compileNode(i,"kpp_tubeamp",u,e,"-ftz 2",!1,128).then((function(e){e&&b(e)}))})))}),[i,o,u,f,w]),Object(r.useEffect)((function(){O.a.initPromise.then((function(){S(!0)}))}),[]),Object(r.useEffect)((function(){i&&f&&!g&&k&&fetch("/tubeAmp_Profiles/v1.0/Modern Metal.tapf").then((function(e){return e.arrayBuffer()})).then((function(e){var t=0,c=e.slice(0,76);t=76;for(var r=new Uint8Array(c.slice(0,4)),o="TaPf",u=0;u<o.length;u++)if(o.charCodeAt(u)!==r[u])return;var l,d=new Uint32Array(c.slice(4,8))[0];(l=new Float32Array(c).reduce((function(e,t,n){return Object.assign(e,Object(v.a)({},a[n],t))}),{})).signature=o,l.version=d,C(l);var b=e.slice(t,t+12);t+=12;var p=new Int32Array(b),j=p[0],m=4*p[2],h=e.slice(t,t+m);if(t+=m,h.byteLength===m){for(var g=new ConvolverNode(i),x=new O.a(1,j,i.sampleRate,10),_=new Int16Array(h),y=x.processChunk(_),k=new Float32Array(y),S=i.createBuffer(1,y.byteLength/2,i.sampleRate),w=S.getChannelData(0),N=0;N<S.length;N++)w[N]=k[N];g.buffer=S,s([g,f],n)}}))}),[i,f,g,s,n,k]),Object(r.useEffect)((function(){var e=x(f,"nentry");g&&e.forEach((function(e){null===f||void 0===f||f.setParamValue(e.address,g[e.label])}))}),[f,g]),!f)return null;var N=x(f,"vslider");return Object(c.jsxs)("div",{className:"plugin amp-head",children:[Object(c.jsx)("div",{className:"plugin-title",children:null===f||void 0===f||null===(t=f.fJSONDsp)||void 0===t?void 0:t.name}),Object(c.jsx)("div",{className:"knobs-wrapper",children:N.map((function(e){var t=e.address,n=e.init,a=e.label,r=e.min,i=e.max;e.step;return Object(c.jsxs)("div",{className:"knob",children:[Object(c.jsx)("label",{htmlFor:t,children:a}),Object(c.jsxs)(j.Knob,{size:50,angleOffset:220,angleRange:280,min:r,max:i,className:"styledKnob",value:n||.01,onChange:function(e){return function(e,t){f.setParamValue(e,t)}(t,e)},children:[Object(c.jsx)(j.Arc,{arcWidth:.75}),Object(c.jsx)("circle",{r:"20",cx:"25",cy:"25"}),Object(c.jsx)(j.Pointer,{width:1,height:17.5,radius:5,type:"rect",color:"#fff"})]})]},t)}))})]})},_=(n(67),["center","cone","edge"]),y=["1on-preshigh","1on-pres8","1on-pres5"],k=function(e){var t=e.audioContext,n=e.onCabReady,a=Object(r.useState)(0),i=Object(p.a)(a,2),o=i[0],u=i[1];return Object(r.useEffect)((function(){t&&fetch("/ir/".concat(y[o],".wav")).then((function(e){return e.arrayBuffer()})).then((function(e){t.decodeAudioData(e,(function(e){var a=new ConvolverNode(t);a.buffer=e,n(a)}))}))}),[o,t,n]),Object(c.jsxs)("div",{className:"cabinet",onClick:function(){u((function(e){return e===_.length-1?0:e+1}))},children:[Object(c.jsx)("img",{className:"speaker",alt:"Guitar Speaker",src:"/speaker.png"}),Object(c.jsx)("img",{className:"mic mic--".concat(_[o]),alt:"Microphone",src:"/shure_sm57.png"})]})};!function(e){e[e.DI=0]="DI",e[e.MIC=1]="MIC"}(g||(g={}));var S={audioContext:null,lineInStreamSource:null,diTrackStreamSource:null,inputMode:null,cabConvolver:null,plugins:[],allPluginsTailNode:null,faustCompiler:null,faustFactory:null,faustCode:""};var w=function(){var e,t=Object(r.useState)(S),n=Object(p.a)(t,2),a=n[0],i=n[1],o=a.audioContext,u=a.lineInStreamSource,s=a.diTrackStreamSource,j=Object(r.useRef)(new Audio);function v(e){return"suspended"===e.state||"running"!==e.state?e.resume():Promise.resolve()}function h(){return(h=Object(b.a)(l.a.mark((function e(){var t,n,c;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a.audioContext||new AudioContext({latencyHint:"interactive"}),e.next=3,navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,autoGainControl:!1,noiseSuppression:!1,latency:0}});case 3:return n=e.sent,e.next=6,v(t);case 6:c=t.createMediaStreamSource(n),i((function(e){return Object(f.a)(Object(f.a)({},e),{},{audioContext:t,lineInStreamSource:c,diTrackStreamSource:s,inputMode:g.MIC})}));case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}switch(Object(r.useEffect)((function(){FaustModule().then((function(e){var t=Faust.createCompiler(Faust.createLibFaust(e)),n=Faust.createMonoFactory();i((function(e){return Object(f.a)(Object(f.a)({},e),{},{faustFactory:n,faustCompiler:t})}))}))}),[]),a.inputMode){case g.DI:e=s;break;case g.MIC:e=u;break;default:e=s||u}var O=Object(r.useCallback)((function(e,t){i((function(n){var a=Object(d.a)(n.plugins);return a[t]=e,Object(f.a)(Object(f.a)({},n),{},{plugins:a})}))}),[]),x=Object(r.useCallback)((function(e){i((function(t){return t.cabConvolver&&t.audioContext&&t.allPluginsTailNode&&(t.allPluginsTailNode.disconnect(t.cabConvolver),t.cabConvolver.disconnect(t.audioContext.destination)),Object(f.a)(Object(f.a)({},t),{},{cabConvolver:e})}))}),[]),_=Object(r.useMemo)((function(){return[Object(c.jsx)(m,{index:0,sourceUrl:"kpp_distruction.dsp",compiler:a.faustCompiler,factory:a.faustFactory,context:a.audioContext,onPluginReady:O},0),Object(c.jsx)(C,{index:1,compiler:a.faustCompiler,factory:a.faustFactory,context:a.audioContext,onPluginReady:O},1)]}),[a.faustFactory,a.faustCompiler,a.audioContext,O]);return Object(r.useEffect)((function(){a.cabConvolver&&a.allPluginsTailNode&&Object.keys(a.allPluginsTailNode).length&&a.audioContext&&a.allPluginsTailNode.connect(a.cabConvolver).connect(a.audioContext.destination)}),[a.cabConvolver,a.allPluginsTailNode,a.audioContext]),Object(r.useEffect)((function(){e&&o&&a.plugins.length===_.length&&a.plugins.filter((function(e){return!!e})).length===_.length&&v(o).then((function(){var t=Object(d.a)(a.plugins).reverse().reduce((function(e,t,n){var a=t.reduce((function(e,t,n){return 0!==n?e.connect(t):t}),{});return 0===n?a:a.connect(e)}),{}),n=a.plugins[0][0];e.connect(n),i((function(e){return Object(f.a)(Object(f.a)({},e),{},{allPluginsTailNode:t})}))}))}),[a.plugins,_.length,e,o]),Object(c.jsxs)("div",{className:"App",children:[Object(c.jsxs)("div",{children:["Click ",Object(c.jsx)("button",{disabled:!!u,onClick:function(){return h.apply(this,arguments)},children:"here"})," to turn on your guitar input."]}),Object(c.jsx)("div",{className:"plugins-wrapper",children:_}),Object(c.jsx)(k,{audioContext:a.audioContext,onCabReady:x}),Object(c.jsx)("div",{children:Object(c.jsx)("audio",{controls:!0,ref:j,onPlay:function(){if(!s){var e=a.audioContext||new AudioContext({latencyHint:"interactive"}),t=j.current;v(e).then((function(){var n=e.createMediaElementSource(t);i((function(t){return Object(f.a)(Object(f.a)({},t),{},{audioContext:e,lineInStreamSource:u,diTrackStreamSource:n,inputMode:g.DI})}))}))}},children:Object(c.jsx)("source",{src:"di/LasseMagoDI.mp3",type:"audio/mpeg"})})})]})},N=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,69)).then((function(t){var n=t.getCLS,a=t.getFID,c=t.getFCP,r=t.getLCP,i=t.getTTFB;n(e),a(e),c(e),r(e),i(e)}))};u.a.render(Object(c.jsx)(i.a.StrictMode,{children:Object(c.jsx)(w,{})}),document.getElementById("root")),N()}},[[68,1,2]]]);
//# sourceMappingURL=main.e7c20f7e.chunk.js.map