(this["webpackJsonpreact-webaudio-5150"]=this["webpackJsonpreact-webaudio-5150"]||[]).push([[0],{255:function(e,t,n){},257:function(e,t,n){},265:function(e,t){},267:function(e,t){},278:function(e,t,n){},502:function(e,t,n){},503:function(e,t,n){"use strict";n.r(t);var a,r=n(0),o=n.n(r),c=n(248),i=n.n(c),u=(n(255),n(100)),s=n.n(u),l=n(40),d=n(14),f=n(249),p=n(21),b=(n(257),n(34)),g=function(e){e.stopPropagation()},j=n(5),v=function(e){var t,n=e.index,a=e.sourceUrl,o=e.context,c=e.factory,i=e.compiler,u=e.onPluginReady,s=Object(r.useState)(),l=Object(p.a)(s,2),d=l[0],f=l[1],v=Object(r.useRef)(!1);if(Object(r.useEffect)((function(){c&&o&&i&&!d&&!v.current&&fetch("/react-webaudio-5150/"+a).then((function(e){return e.text()})).then((function(e){v.current=!0,c.compileNode(o,"Pedal"+n,i,e,"-ftz 2",!1,128).then((function(e){f(e),u([e],n)}))}))}),[a,o,c,i,u,n,d,v]),!d)return Object(j.jsx)("div",{children:"Start audio to load the plugin"});var O=d.fDescriptor.filter((function(e){var t=e.type;return"vslider"===t||"hslider"===t}));return Object(j.jsxs)("div",{className:"plugin pedal",children:[Object(j.jsx)("div",{className:"plugin-title",children:null===d||void 0===d||null===(t=d.fJSONDsp)||void 0===t?void 0:t.name}),Object(j.jsx)("div",{className:"knobs-wrapper",onMouseDown:g,children:O.map((function(e){var t=e.address,n=e.init,a=e.label,r=e.min,o=e.max;e.step;return Object(j.jsxs)("div",{className:"knob",children:[Object(j.jsx)("label",{htmlFor:t,children:a.toUpperCase()}),Object(j.jsxs)(b.Knob,{size:50,angleOffset:220,angleRange:280,min:r,max:o,value:n||.01,onChange:function(e){return function(e,t){d.setParamValue(e,t)}(t,e)},children:[Object(j.jsx)(b.Arc,{arcWidth:2.5,color:"#FC5A96",radius:18.75}),Object(j.jsx)(b.Pointer,{width:2.5,radius:20,type:"circle",color:"#180094"}),Object(j.jsx)(b.Value,{marginBottom:20,className:"value"})]})]},t)}))})]})},O=n(102),h=n(143),m=n.n(h);!function(e){e[e.signature=0]="signature",e[e.version=1]="version",e[e.preamp_level=2]="preamp_level",e[e.preamp_bias=3]="preamp_bias",e[e.preamp_Kreg=4]="preamp_Kreg",e[e.preamp_Upor=5]="preamp_Upor",e[e.tonestack_low_freq=6]="tonestack_low_freq",e[e.tonestack_low_band=7]="tonestack_low_band",e[e.tonestack_middle_freq=8]="tonestack_middle_freq",e[e.tonestack_middle_band=9]="tonestack_middle_band",e[e.tonestack_high_freq=10]="tonestack_high_freq",e[e.tonestack_high_band=11]="tonestack_high_band",e[e.amp_level=12]="amp_level",e[e.amp_bias=13]="amp_bias",e[e.amp_Kreg=14]="amp_Kreg",e[e.amp_Upor=15]="amp_Upor",e[e.sag_time=16]="sag_time",e[e.sag_coeff=17]="sag_coeff",e[e.output_level=18]="output_level"}(a||(a={}));var x,C,k=function(e,t){return e?e.fDescriptor.filter((function(e){return e.type===t})):[]},y=function(e){var t,n=e.index,o=e.context,c=e.factory,i=e.compiler,u=e.onPluginReady,s=Object(r.useState)(),l=Object(p.a)(s,2),d=l[0],f=l[1],v=Object(r.useState)(),h=Object(p.a)(v,2),x=h[0],C=h[1],y=Object(r.useState)(!1),P=Object(p.a)(y,2),w=P[0],_=P[1],N=Object(r.useRef)(!1);if(Object(r.useEffect)((function(){!d&&c&&o&&i&&!N.current&&(N.current=!0,fetch("/react-webaudio-5150/kpp_tubeamp.dsp").then((function(e){return e.text()})).then((function(e){c.compileNode(o,"kpp_tubeamp",i,e,"-ftz 2",!1,128).then((function(e){e&&f(e)}))})))}),[o,c,i,d,N]),Object(r.useEffect)((function(){m.a.initPromise.then((function(){_(!0)}))}),[]),Object(r.useEffect)((function(){o&&d&&!x&&w&&fetch("".concat("/react-webaudio-5150","/tubeAmp_Profiles/v1.0/Modern Metal.tapf")).then((function(e){return e.arrayBuffer()})).then((function(e){var t=0,r=e.slice(0,76);t=76;for(var c=new Uint8Array(r.slice(0,4)),i="TaPf",s=0;s<i.length;s++)if(i.charCodeAt(s)!==c[s])return;var l,f=new Uint32Array(r.slice(4,8))[0];(l=new Float32Array(r).reduce((function(e,t,n){return Object.assign(e,Object(O.a)({},a[n],t))}),{})).signature=i,l.version=f,C(l);var p=e.slice(t,t+12);t+=12;var b=new Int32Array(p),g=b[0],j=4*b[2],v=e.slice(t,t+j);if(t+=j,v.byteLength===j){for(var h=new ConvolverNode(o),x=new m.a(1,g,o.sampleRate,10),k=new Int16Array(v),y=x.processChunk(k),P=new Float32Array(y),w=o.createBuffer(1,y.byteLength/2,o.sampleRate),_=w.getChannelData(0),N=0;N<w.length;N++)_[N]=P[N];h.buffer=w,u([h,d],n)}}))}),[o,d,x,u,n,w]),Object(r.useEffect)((function(){var e=k(d,"nentry");x&&e.forEach((function(e){null===d||void 0===d||d.setParamValue(e.address,x[e.label])}))}),[d,x]),!d)return Object(j.jsx)("div",{children:"Start audio to load the plugin"});var S=k(d,"vslider");return Object(j.jsxs)("div",{className:"plugin amp-head",children:[Object(j.jsx)("div",{className:"plugin-title",children:null===d||void 0===d||null===(t=d.fJSONDsp)||void 0===t?void 0:t.name}),Object(j.jsx)("div",{className:"knobs-wrapper",onMouseDown:g,children:S.map((function(e){var t=e.address,n=e.init,a=e.label,r=e.min,o=e.max;e.step;return Object(j.jsxs)("div",{className:"knob",children:[Object(j.jsx)("label",{htmlFor:t,children:a}),Object(j.jsxs)(b.Knob,{size:50,angleOffset:220,angleRange:280,min:r,max:o,className:"styledKnob",value:n||.01,onChange:function(e){return function(e,t){d.setParamValue(e,t)}(t,e)},children:[Object(j.jsx)(b.Arc,{arcWidth:.75}),Object(j.jsx)("circle",{r:"20",cx:"25",cy:"25"}),Object(j.jsx)(b.Pointer,{width:1,height:17.5,radius:5,type:"rect",color:"#fff"})]})]},t)}))})]})},P=(n(278),["center","cone","edge"]),w=["1on-preshigh","1on-pres8","1on-pres5"],_=function(e){var t=e.audioContext,n=e.onCabReady,a=Object(r.useState)(0),o=Object(p.a)(a,2),c=o[0],i=o[1];return Object(r.useEffect)((function(){t&&fetch("".concat("/react-webaudio-5150","/ir/").concat(w[c],".wav")).then((function(e){return e.arrayBuffer()})).then((function(e){t.decodeAudioData(e,(function(e){var a=new ConvolverNode(t);a.buffer=e,n(a)}))}))}),[c,t,n]),Object(j.jsxs)("div",{className:"cabinet",onClick:function(){i((function(e){return e===P.length-1?0:e+1}))},children:[Object(j.jsx)("img",{className:"speaker",alt:"Guitar Speaker",src:"".concat("/react-webaudio-5150","/speaker.png")}),Object(j.jsx)("img",{className:"mic mic--".concat(P[c]),alt:"Microphone",src:"".concat("/react-webaudio-5150","/shure_sm57.png")})]})},N=n(13),S=n.n(N),F=n(6),M=(n(502),n(37)),D=n(54),I=n(39),A=n(38),E=n(250),L=n(16).default.div(x||(x=Object(E.a)(["\n    .plugin-port {\n        width: 16px;\n        height: 16px;\n        z-index: 10;\n        background: rgba(0, 0, 0, 0.5);\n        border-radius: 8px;\n        cursor: pointer;\n        &:hover {\n            background: rgba(0, 0, 0, 1);\n        }\n        position: absolute;\n        top: 50%;\n\n        &.port-in {\n            left: 0%;\n        }\n        &.port-out {\n            right: 0%;\n        }\n    }\n"]))),R=function(e){Object(I.a)(n,e);var t=Object(A.a)(n);function n(){return Object(M.a)(this,n),t.apply(this,arguments)}return Object(D.a)(n,[{key:"render",value:function(){var e=this.props.node.getPort("In"),t=this.props.node.getPort("Out");return Object(j.jsxs)(L,{children:[this.props.node.plugin,e&&Object(j.jsx)(N.PortWidget,{className:"plugin-port port-in",port:e,engine:this.props.engine}),t&&Object(j.jsx)(N.PortWidget,{className:"plugin-port port-out",port:t,engine:this.props.engine})]})}}]),n}(o.a.Component),T=n(99),U=function(e){Object(I.a)(n,e);var t=Object(A.a)(n);function n(){return Object(M.a)(this,n),t.apply(this,arguments)}return Object(D.a)(n,[{key:"createLinkModel",value:function(){return new T.PathFindingLinkModel}}]),n}(n(28).DefaultPortModel),K=function(e){Object(I.a)(n,e);var t=Object(A.a)(n);function n(e,a){var r;return Object(M.a)(this,n),(r=t.call(this,{type:"plugin"})).plugin=e,r.pluginIndex=a,r.addPort(new U(!0,"In","")),r.addPort(new U(!1,"Out","")),r}return n}(N.NodeModel),W=function(e){Object(I.a)(n,e);var t=Object(A.a)(n);function n(){return Object(M.a)(this,n),t.call(this,"plugin")}return Object(D.a)(n,[{key:"generateReactWidget",value:function(e){return Object(j.jsx)(R,{engine:this.engine,node:e.model})}},{key:"generateModel",value:function(e){return new K(Object(j.jsx)(j.Fragment,{}),0)}}]),n}(F.AbstractReactFactory),q=function(e,t){var n=e.getLinks();Object.keys(n).length>1&&Object.entries(n).forEach((function(e){var n=e[1];n!==t&&n.remove()}))},B=function(e){var t=e.plugins,n=e.setPluginOrder,a=Object(r.useState)(),o=Object(p.a)(a,2),c=o[0],i=o[1];return Object(r.useEffect)((function(){var e=S()({registerDefaultZoomCanvasAction:!1});e.getNodeFactories().registerFactory(new W),i(e)}),[]),Object(r.useEffect)((function(){if(c){var e,a=[],r=[],o=c.getLinkFactories().getFactory(N.PathFindingLinkFactory.NAME);t.forEach((function(t,n){e=new K(t,n),a.push(e),n>0&&r.push(a[n-1].getPort("Out").link(a[n].getPort("In"),o))})),(a=[new N.DefaultNodeModel({name:"Input"})].concat(Object(l.a)(a))).push(new N.DefaultNodeModel({name:"Output"}));var i={eventWillFire:function(e){"entityRemoved"===e.function&&e.stopPropagation()}};a[0].registerListener(i),a[a.length-1].registerListener(i),a.length>2&&(r=[a[0].addPort(new N.DefaultPortModel({name:"Out"})).link(a[1].getPort("In"),o)].concat(Object(l.a)(r))).push(a[a.length-2].getPort("Out").link(a[a.length-1].addPort(new N.DefaultPortModel({name:"In"})),o));var u=new N.DiagramModel;u.addAll.apply(u,Object(l.a)(a).concat(Object(l.a)(r))),c.setModel(u);var s={eventDidFire:function(e){if("linksUpdated"===e.function){var t=e.link,r=t.getSourcePort();q(r,t),e.isCreated&&t.registerListener({targetPortChanged:function(e){e.port.getParent()===r.getParent()?t.remove():q(e.port,t),n(function(e,t){for(var n,a,r=[],o=e.getNode(t),c=e.getNodes(),i=0;i<c.length-1;i++){var u;if(!(n=null===(u=o.getPort("Out"))||void 0===u?void 0:u.getLinks())||!Object.keys(n).length)return null;(o=(a=Object.entries(n)[0][1]).getSourcePort().getNode()===o?a.getTargetPort().getNode():a.getSourcePort().getNode())instanceof K&&r.push(o.pluginIndex)}return r}(u,a[0].getID()))}})}}};u.registerListener(s);var d=c.getStateMachine().getCurrentState();d&&(d.dragCanvas.config.allowDrag=!1),setTimeout((function(){new N.DagreEngine({graph:{rankdir:"LR",ranker:"longest-path",marginx:25,marginy:25},includeLinks:!0}).redistribute(u),c.getLinkFactories().getFactory(N.PathFindingLinkFactory.NAME).calculateRoutingMatrix(),c.repaintCanvas()}),1e3)}}),[t,c,n]),c&&c.getModel()?Object(j.jsx)(F.CanvasWidget,{className:"canvas",engine:c}):null};!function(e){e[e.DI=0]="DI",e[e.MIC=1]="MIC"}(C||(C={}));var z={audioContext:null,lineInStreamSource:null,diTrackStreamSource:null,inputMode:null,cabConvolver:null,plugins:[],pluginOrder:null,allPluginsTailNode:null,faustCompiler:null,faustFactory:null,faustCode:""};var J=function(){var e,t=Object(r.useState)(z),n=Object(p.a)(t,2),a=n[0],o=n[1],c=a.audioContext,i=a.lineInStreamSource,u=a.diTrackStreamSource,b=Object(r.useRef)(new Audio);function g(e){return"suspended"===e.state||"running"!==e.state?e.resume():Promise.resolve()}function O(){return(O=Object(f.a)(s.a.mark((function e(){var t,n,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a.audioContext||new AudioContext({latencyHint:"interactive"}),e.next=3,navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,autoGainControl:!1,noiseSuppression:!1,latency:0}});case 3:return n=e.sent,e.next=6,g(t);case 6:r=t.createMediaStreamSource(n),o((function(e){return Object(d.a)(Object(d.a)({},e),{},{audioContext:t,lineInStreamSource:r,diTrackStreamSource:u,inputMode:C.MIC})}));case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}switch(Object(r.useEffect)((function(){FaustModule().then((function(e){var t=Faust.createCompiler(Faust.createLibFaust(e)),n=Faust.createMonoFactory();o((function(e){return Object(d.a)(Object(d.a)({},e),{},{faustFactory:n,faustCompiler:t})}))}))}),[]),a.inputMode){case C.DI:e=u;break;case C.MIC:e=i;break;default:e=u||i}var h=Object(r.useCallback)((function(e,t){o((function(n){var a=Object(l.a)(n.plugins);return a[t]=e,Object(d.a)(Object(d.a)({},n),{},{plugins:a})}))}),[]),m=Object(r.useCallback)((function(e){o((function(t){var n;return t.cabConvolver&&t.audioContext&&(null===(n=t.allPluginsTailNode)||void 0===n?void 0:n.node)&&(t.allPluginsTailNode.node.disconnect(t.cabConvolver),t.cabConvolver.disconnect(t.audioContext.destination)),Object(d.a)(Object(d.a)({},t),{},{cabConvolver:e})}))}),[]),x=Object(r.useMemo)((function(){return[Object(j.jsx)(v,{index:0,sourceUrl:"kpp_distruction.dsp",compiler:a.faustCompiler,factory:a.faustFactory,context:a.audioContext,onPluginReady:h},0),Object(j.jsx)(y,{index:1,compiler:a.faustCompiler,factory:a.faustFactory,context:a.audioContext,onPluginReady:h},1),Object(j.jsx)(v,{index:2,sourceUrl:"kpp_octaver.dsp",compiler:a.faustCompiler,factory:a.faustFactory,context:a.audioContext,onPluginReady:h},2)]}),[a.faustFactory,a.faustCompiler,a.audioContext,h]);Object(r.useEffect)((function(){a.cabConvolver&&a.allPluginsTailNode&&Object.keys(a.allPluginsTailNode).length&&a.audioContext&&(a.cabConvolver.disconnect(),a.allPluginsTailNode.node.connect(a.cabConvolver).connect(a.audioContext.destination))}),[a.cabConvolver,a.allPluginsTailNode,a.audioContext]),Object(r.useEffect)((function(){e&&c&&a.plugins.length===x.length&&a.plugins.filter((function(e){return!!e})).length===x.length&&(!function(e){e.forEach((function(e){e&&e.forEach((function(e){return null===e||void 0===e?void 0:e.disconnect()}))}))}(a.plugins),g(c).then((function(){var t=a.pluginOrder?a.pluginOrder.map((function(e){return a.plugins[e]})):a.plugins,n=Object(l.a)(t).reverse().reduce((function(e,t,n){var a=t.reduce((function(e,t,n){return 0!==n?e.connect(t):t}),{});return 0===n?a:a.connect(e)}),{}),r=t[0][0];e.connect(r),o((function(e){return Object(d.a)(Object(d.a)({},e),{},{allPluginsTailNode:{node:n}})}))})))}),[a.plugins,x.length,a.pluginOrder,e,c]);var k=Object(r.useCallback)((function(e){o((function(t){return Object(d.a)(Object(d.a)({},t),{},{pluginOrder:e})}))}),[]);return Object(j.jsxs)("div",{className:"App",children:[Object(j.jsxs)("div",{children:["Click ",Object(j.jsx)("button",{disabled:!!i,onClick:function(){return O.apply(this,arguments)},children:"here"})," to turn on your guitar input."]}),Object(j.jsx)("div",{className:"plugins-wrapper",children:Object(j.jsx)(B,{plugins:x,setPluginOrder:k})}),Object(j.jsx)(_,{audioContext:a.audioContext,onCabReady:m}),Object(j.jsx)("div",{children:Object(j.jsx)("audio",{controls:!0,ref:b,onPlay:function(){if(!u){var e=a.audioContext||new AudioContext({latencyHint:"interactive"}),t=b.current;g(e).then((function(){var n=e.createMediaElementSource(t);o((function(t){return Object(d.a)(Object(d.a)({},t),{},{audioContext:e,lineInStreamSource:i,diTrackStreamSource:n,inputMode:C.DI})}))}))}},children:Object(j.jsx)("source",{src:"".concat("/react-webaudio-5150","/di/LasseMagoDI.mp3"),type:"audio/mpeg"})})})]})},V=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,504)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,o=t.getLCP,c=t.getTTFB;n(e),a(e),r(e),o(e),c(e)}))};i.a.render(Object(j.jsx)(J,{}),document.getElementById("root")),V()}},[[503,1,2]]]);
//# sourceMappingURL=main.e46f5dfe.chunk.js.map