(this["webpackJsonpreact-webaudio-5150"]=this["webpackJsonpreact-webaudio-5150"]||[]).push([[0],{256:function(e,t,n){},258:function(e,t,n){},266:function(e,t){},268:function(e,t){},279:function(e,t,n){},503:function(e,t,n){},504:function(e,t,n){"use strict";n.r(t);var r,a=n(0),c=n.n(a),o=n(248),i=n.n(o),u=(n(256),n(100)),l=n.n(u),s=n(22),d=n(12),p=n(249),f=n(21),g=(n(258),n(35)),b=function(e){e.stopPropagation()},j=n(5),O=function(e){var t,n=e.index,r=e.sourceUrl,c=e.context,o=e.factory,i=e.compiler,u=e.onPluginReady,l=Object(a.useState)(),s=Object(f.a)(l,2),d=s[0],p=s[1],O=Object(a.useRef)(!1);if(Object(a.useEffect)((function(){o&&c&&i&&!d&&!O.current&&fetch("/react-webaudio-5150/"+r).then((function(e){return e.text()})).then((function(e){O.current=!0,o.compileNode(c,"Pedal"+n,i,e,"-ftz 2",!1,128).then((function(e){p(e),u([e],n)}))}))}),[r,c,o,i,u,n,d,O]),!d)return Object(j.jsx)("div",{children:"Start audio to load the plugin"});var v=d.fDescriptor.filter((function(e){var t=e.type;return"vslider"===t||"hslider"===t}));return Object(j.jsxs)("div",{className:"plugin pedal",children:[Object(j.jsx)("div",{className:"plugin-title",children:null===d||void 0===d||null===(t=d.fJSONDsp)||void 0===t?void 0:t.name}),Object(j.jsx)("div",{className:"knobs-wrapper",onMouseDown:b,children:v.map((function(e){var t=e.address,n=e.init,r=e.label,a=e.min,c=e.max;e.step;return Object(j.jsxs)("div",{className:"knob",children:[Object(j.jsx)("label",{htmlFor:t,children:r.toUpperCase()}),Object(j.jsxs)(g.Knob,{size:50,angleOffset:220,angleRange:280,min:a,max:c,value:n||.01,onChange:function(e){return function(e,t){d.setParamValue(e,t)}(t,e)},children:[Object(j.jsx)(g.Arc,{arcWidth:2.5,color:"#FC5A96",radius:18.75}),Object(j.jsx)(g.Pointer,{width:2.5,radius:20,type:"circle",color:"#180094"}),Object(j.jsx)(g.Value,{marginBottom:20,className:"value"})]})]},t)}))})]})},v=n(102),h=n(144),m=n.n(h);!function(e){e[e.signature=0]="signature",e[e.version=1]="version",e[e.preamp_level=2]="preamp_level",e[e.preamp_bias=3]="preamp_bias",e[e.preamp_Kreg=4]="preamp_Kreg",e[e.preamp_Upor=5]="preamp_Upor",e[e.tonestack_low_freq=6]="tonestack_low_freq",e[e.tonestack_low_band=7]="tonestack_low_band",e[e.tonestack_middle_freq=8]="tonestack_middle_freq",e[e.tonestack_middle_band=9]="tonestack_middle_band",e[e.tonestack_high_freq=10]="tonestack_high_freq",e[e.tonestack_high_band=11]="tonestack_high_band",e[e.amp_level=12]="amp_level",e[e.amp_bias=13]="amp_bias",e[e.amp_Kreg=14]="amp_Kreg",e[e.amp_Upor=15]="amp_Upor",e[e.sag_time=16]="sag_time",e[e.sag_coeff=17]="sag_coeff",e[e.output_level=18]="output_level"}(r||(r={}));var x,k,C=function(e,t){return e?e.fDescriptor.filter((function(e){return e.type===t})):[]},y=function(e){var t,n=e.index,c=e.context,o=e.factory,i=e.compiler,u=e.onPluginReady,l=Object(a.useState)(),s=Object(f.a)(l,2),d=s[0],p=s[1],O=Object(a.useState)(),h=Object(f.a)(O,2),x=h[0],k=h[1],y=Object(a.useState)(!1),P=Object(f.a)(y,2),_=P[0],w=P[1],N=Object(a.useRef)(!1);if(Object(a.useEffect)((function(){!d&&o&&c&&i&&!N.current&&(N.current=!0,fetch("/react-webaudio-5150/kpp_tubeamp.dsp").then((function(e){return e.text()})).then((function(e){o.compileNode(c,"kpp_tubeamp",i,e,"-ftz 2",!1,128).then((function(e){e&&p(e)}))})))}),[c,o,i,d,N]),Object(a.useEffect)((function(){m.a.initPromise.then((function(){w(!0)}))}),[]),Object(a.useEffect)((function(){c&&d&&!x&&_&&fetch("".concat("/react-webaudio-5150","/tubeAmp_Profiles/v1.0/Modern Metal.tapf")).then((function(e){return e.arrayBuffer()})).then((function(e){var t=0,a=e.slice(0,76);t=76;for(var o=new Uint8Array(a.slice(0,4)),i="TaPf",l=0;l<i.length;l++)if(i.charCodeAt(l)!==o[l])return;var s,p=new Uint32Array(a.slice(4,8))[0];(s=new Float32Array(a).reduce((function(e,t,n){return Object.assign(e,Object(v.a)({},r[n],t))}),{})).signature=i,s.version=p,k(s);var f=e.slice(t,t+12);t+=12;var g=new Int32Array(f),b=g[0],j=4*g[2],O=e.slice(t,t+j);if(t+=j,O.byteLength===j){for(var h=new ConvolverNode(c),x=new m.a(1,b,c.sampleRate,10),C=new Int16Array(O),y=x.processChunk(C),P=new Float32Array(y),_=c.createBuffer(1,y.byteLength/2,c.sampleRate),w=_.getChannelData(0),N=0;N<_.length;N++)w[N]=P[N];h.buffer=_,u([h,d],n)}}))}),[c,d,x,u,n,_]),Object(a.useEffect)((function(){var e=C(d,"nentry");x&&e.forEach((function(e){null===d||void 0===d||d.setParamValue(e.address,x[e.label])}))}),[d,x]),!d)return Object(j.jsx)("div",{children:"Start audio to load the plugin"});var S=C(d,"vslider");return Object(j.jsxs)("div",{className:"plugin amp-head",children:[Object(j.jsx)("div",{className:"plugin-title",children:null===d||void 0===d||null===(t=d.fJSONDsp)||void 0===t?void 0:t.name}),Object(j.jsx)("div",{className:"knobs-wrapper",onMouseDown:b,children:S.map((function(e){var t=e.address,n=e.init,r=e.label,a=e.min,c=e.max;e.step;return Object(j.jsxs)("div",{className:"knob",children:[Object(j.jsx)("label",{htmlFor:t,children:r}),Object(j.jsxs)(g.Knob,{size:50,angleOffset:220,angleRange:280,min:a,max:c,className:"styledKnob",value:n||.01,onChange:function(e){return function(e,t){d.setParamValue(e,t)}(t,e)},children:[Object(j.jsx)(g.Arc,{arcWidth:.75}),Object(j.jsx)("circle",{r:"20",cx:"25",cy:"25"}),Object(j.jsx)(g.Pointer,{width:1,height:17.5,radius:5,type:"rect",color:"#fff"})]})]},t)}))})]})},P=(n(279),["center","cone","edge"]),_=["1on-preshigh","1on-pres8","1on-pres5"],w=function(e){var t=e.audioContext,n=e.onCabReady,r=Object(a.useState)(0),c=Object(f.a)(r,2),o=c[0],i=c[1];return Object(a.useEffect)((function(){t&&fetch("".concat("/react-webaudio-5150","/ir/").concat(_[o],".wav")).then((function(e){return e.arrayBuffer()})).then((function(e){t.decodeAudioData(e,(function(e){var r=new ConvolverNode(t);r.buffer=e,n(r)}))}))}),[o,t,n]),Object(j.jsxs)("div",{className:"cabinet",onClick:function(){i((function(e){return e===P.length-1?0:e+1}))},children:[Object(j.jsx)("img",{className:"speaker",alt:"Guitar Speaker",src:"".concat("/react-webaudio-5150","/speaker.png")}),Object(j.jsx)("img",{className:"mic mic--".concat(P[o]),alt:"Microphone",src:"".concat("/react-webaudio-5150","/shure_sm57.png")})]})},N=n(14),S=n.n(N),M=n(6),F=n(250),D=n.n(F),I=(n(503),n(38)),T=n(54),R=n(40),A=n(39),L=n(251),E=n(16).default.div(x||(x=Object(L.a)(["\n    .plugin-port {\n        width: 16px;\n        height: 16px;\n        z-index: 10;\n        background: rgba(0, 0, 0, 0.5);\n        border-radius: 8px;\n        cursor: pointer;\n        &:hover {\n            background: rgba(0, 0, 0, 1);\n        }\n        position: absolute;\n        top: 50%;\n\n        &.port-in {\n            left: 0%;\n        }\n        &.port-out {\n            right: 0%;\n        }\n    }\n"]))),U=function(e){Object(R.a)(n,e);var t=Object(A.a)(n);function n(){return Object(I.a)(this,n),t.apply(this,arguments)}return Object(T.a)(n,[{key:"render",value:function(){var e=this.props.node.getPort("In"),t=this.props.node.getPort("Out");return Object(j.jsxs)(E,{children:[this.props.node.plugin,e&&Object(j.jsx)(N.PortWidget,{className:"plugin-port port-in",port:e,engine:this.props.engine}),t&&Object(j.jsx)(N.PortWidget,{className:"plugin-port port-out",port:t,engine:this.props.engine})]})}}]),n}(c.a.Component),z=n(99),K=function(e){Object(R.a)(n,e);var t=Object(A.a)(n);function n(){return Object(I.a)(this,n),t.apply(this,arguments)}return Object(T.a)(n,[{key:"createLinkModel",value:function(){return new z.PathFindingLinkModel}}]),n}(n(29).DefaultPortModel),W=function(e){Object(R.a)(n,e);var t=Object(A.a)(n);function n(e,r){var a;return Object(I.a)(this,n),(a=t.call(this,{type:"plugin"})).plugin=e,a.pluginIndex=r,a.addPort(new K(!0,"In","")),a.addPort(new K(!1,"Out","")),a}return n}(N.NodeModel),q=function(e){Object(R.a)(n,e);var t=Object(A.a)(n);function n(){return Object(I.a)(this,n),t.call(this,"plugin")}return Object(T.a)(n,[{key:"generateReactWidget",value:function(e){return Object(j.jsx)(U,{engine:this.engine,node:e.model})}},{key:"generateModel",value:function(e){return new W(Object(j.jsx)(j.Fragment,{}),0)}}]),n}(M.AbstractReactFactory),B=function(e,t){var n=e.getLinks();Object.keys(n).length>(t?1:0)&&Object.entries(n).forEach((function(e){var n=e[1];n!==t&&n.remove()}))},J=function(e){var t=e.plugins,n=e.setPluginOrder,r=e.pluginOrder,c=e.addPlugin,o=Object(a.useState)(),i=Object(f.a)(o,2),u=i[0],l=i[1],d=Object(a.useRef)([]),p=Object(a.useRef)([]);return Object(a.useEffect)((function(){var e=S()({registerDefaultZoomCanvasAction:!1});e.getNodeFactories().registerFactory(new q),l(e)}),[]),Object(a.useEffect)((function(){var e=!D()(p.current,r);if(u&&(e||!r)&&d.current!==t){var a,c=u.getModel(),o=[],i=r?r.length:t.length;if(c&&c.getNodes().length-2<i){var l;a=new W(t[t.length-1],i-1);var f=c.getNodes().filter((function(e){return e instanceof N.DefaultNodeModel&&"Output"===e.getOptions().name}))[0],g=f.getPort("In"),b=Object.keys(g.getLinks()).length&&Object.entries(g.getLinks())[0][1];b&&B(g);var j=b&&(b.getTargetPort().getNode()===f?b.getSourcePort():b.getTargetPort());o=[a.getPort("Out").link(g)],b&&o.push(j.link(a.getPort("In"))),(l=c).addAll.apply(l,[a].concat(Object(s.a)(o)))}else{var O,v=[],h=u.getLinkFactories().getFactory(N.PathFindingLinkFactory.NAME);t.forEach((function(e,t){a=new W(e,t),v.push(a),t>0&&o.push(v[t-1].getPort("Out").link(v[t].getPort("In"),h))})),(v=[new N.DefaultNodeModel({name:"Input"})].concat(Object(s.a)(v))).push(new N.DefaultNodeModel({name:"Output"}));var m={eventWillFire:function(e){"entityRemoved"===e.function&&e.stopPropagation()}};v[0].registerListener(m),v[v.length-1].registerListener(m),v.length>2&&(o=[v[0].addPort(new N.DefaultPortModel({name:"Out"})).link(v[1].getPort("In"),h)].concat(Object(s.a)(o))).push(v[v.length-2].getPort("Out").link(v[v.length-1].addPort(new N.DefaultPortModel({name:"In"})),h)),(O=c=new N.DiagramModel).addAll.apply(O,Object(s.a)(v).concat(Object(s.a)(o))),u.setModel(c);var x={eventDidFire:function(e){if("linksUpdated"===e.function){var t=e.link,r=t.getSourcePort();B(r,t),e.isCreated&&t.registerListener({targetPortChanged:function(e){e.port.getParent()===r.getParent()?t.remove():B(e.port,t);var a=function(e,t){for(var n,r,a=[],c=e.getNode(t),o=e.getNodes(),i=0;i<o.length-1;i++){var u;if(!(n=null===(u=c.getPort("Out"))||void 0===u?void 0:u.getLinks())||!Object.keys(n).length)return null;(c=(r=Object.entries(n)[0][1]).getSourcePort().getNode()===c?r.getTargetPort().getNode():r.getSourcePort().getNode())instanceof W&&a.push(c.pluginIndex)}return a}(c,v[0].getID());a&&n(a)}})}}};c.registerListener(x);var k=u.getStateMachine().getCurrentState();k&&(k.dragCanvas.config.allowDrag=!1)}setTimeout((function(){new N.DagreEngine({graph:{rankdir:"LR",ranker:"longest-path",marginx:25,marginy:25},includeLinks:!0}).redistribute(c),u.getLinkFactories().getFactory(N.PathFindingLinkFactory.NAME).calculateRoutingMatrix(),u.repaintCanvas()}),1e3),d.current=t}e&&(p.current=r)}),[t,u,r,n,d]),u&&u.getModel()?Object(j.jsx)("div",{onDrop:function(e){var t=e.dataTransfer.getData("plugin");c(t)},className:"canvas",onDragOver:function(e){return e.preventDefault()},children:Object(j.jsx)(M.CanvasWidget,{className:"canvas",engine:u})}):null},V=function(e){var t=e.plugins;return Object(j.jsx)("div",{children:t.map((function(e,t){return Object(j.jsx)("div",{draggable:!0,onDragStart:function(t){return t.dataTransfer.setData("plugin",e)},children:e},t)}))})};function G(e){e.forEach((function(e){e&&e.forEach((function(e){return null===e||void 0===e?void 0:e.disconnect()}))}))}!function(e){e[e.DI=0]="DI",e[e.MIC=1]="MIC"}(k||(k={}));var H=["kpp_distruction.dsp","kpp_octaver.dsp","kpp_tubeamp.dsp","kpp_fuzz.dsp","kpp_bluedream.dsp"],Z={audioContext:null,lineInStreamSource:null,diTrackStreamSource:null,inputMode:null,cabConvolver:null,pluginsToRender:["kpp_distruction.dsp"],plugins:[],pluginOrder:null,allPluginsTailNode:null,faustCompiler:null,faustFactory:null,faustCode:""};var Q=function(){var e,t=Object(a.useState)(Z),n=Object(f.a)(t,2),r=n[0],c=n[1],o=r.audioContext,i=r.lineInStreamSource,u=r.diTrackStreamSource,g=Object(a.useRef)(new Audio);function b(e){return"suspended"===e.state||"running"!==e.state?e.resume():Promise.resolve()}function v(){return(v=Object(p.a)(l.a.mark((function e(){var t,n,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=r.audioContext||new AudioContext({latencyHint:"interactive"}),e.next=3,navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,autoGainControl:!1,noiseSuppression:!1,latency:0}});case 3:return n=e.sent,e.next=6,b(t);case 6:a=t.createMediaStreamSource(n),c((function(e){return Object(d.a)(Object(d.a)({},e),{},{audioContext:t,lineInStreamSource:a,diTrackStreamSource:u,inputMode:k.MIC})}));case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}switch(Object(a.useEffect)((function(){FaustModule().then((function(e){var t=Faust.createCompiler(Faust.createLibFaust(e)),n=Faust.createMonoFactory();c((function(e){return Object(d.a)(Object(d.a)({},e),{},{faustFactory:n,faustCompiler:t})}))}))}),[]),r.inputMode){case k.DI:e=u;break;case k.MIC:e=i;break;default:e=u||i}var h=Object(a.useCallback)((function(e,t){c((function(n){var r=Object(s.a)(n.plugins);return r[t]=e,Object(d.a)(Object(d.a)({},n),{},{plugins:r})}))}),[]),m=Object(a.useCallback)((function(e){c((function(t){var n;return t.cabConvolver&&t.audioContext&&(null===(n=t.allPluginsTailNode)||void 0===n?void 0:n.node)&&(t.allPluginsTailNode.node.disconnect(t.cabConvolver),t.cabConvolver.disconnect(t.audioContext.destination)),Object(d.a)(Object(d.a)({},t),{},{cabConvolver:e})}))}),[]),x=Object(a.useCallback)((function(e,t){return"kpp_tubeamp.dsp"===e?Object(j.jsx)(y,{index:t,compiler:r.faustCompiler,factory:r.faustFactory,context:r.audioContext,onPluginReady:h},t):Object(j.jsx)(O,{index:t,sourceUrl:e,compiler:r.faustCompiler,factory:r.faustFactory,context:r.audioContext,onPluginReady:h},t)}),[r.faustFactory,r.faustCompiler,r.audioContext,h]),C=Object(a.useMemo)((function(){return r.pluginsToRender.map((function(e,t){return x(e,t)}))}),[x,r.pluginsToRender]);Object(a.useEffect)((function(){r.cabConvolver&&r.allPluginsTailNode&&Object.keys(r.allPluginsTailNode).length&&r.audioContext&&(r.cabConvolver.disconnect(),r.allPluginsTailNode.node.connect(r.cabConvolver).connect(r.audioContext.destination))}),[r.cabConvolver,r.allPluginsTailNode,r.audioContext]),Object(a.useEffect)((function(){e&&o&&r.plugins.length===C.length&&r.plugins.filter((function(e){return!!e})).length===C.length&&(G(r.plugins),b(o).then((function(){var t=r.pluginOrder?r.pluginOrder.map((function(e){return r.plugins[e]})):r.plugins,n=Object(s.a)(t).reverse().reduce((function(e,t,n){var r=t.reduce((function(e,t,n){return 0!==n?e.connect(t):t}),{});return 0===n?r:r.connect(e)}),{}),a=t[0][0];e.connect(a),c((function(e){return Object(d.a)(Object(d.a)({},e),{},{allPluginsTailNode:{node:n}})}))})))}),[r.plugins,C.length,r.pluginOrder,e,o]);var P=Object(a.useCallback)((function(e){c((function(t){return Object(d.a)(Object(d.a)({},t),{},{pluginOrder:e})}))}),[]),_=Object(a.useCallback)((function(e){c((function(t){return G(t.plugins),Object(d.a)(Object(d.a)({},t),{},{pluginsToRender:[].concat(Object(s.a)(t.pluginsToRender),[e]),pluginOrder:t.pluginOrder?[].concat(Object(s.a)(t.pluginOrder),[t.plugins.length]):[].concat(Object(s.a)(t.plugins.map((function(e,t){return t}))),[t.plugins.length])})}))}),[]);return Object(j.jsxs)("div",{className:"App",children:[Object(j.jsxs)("div",{children:["Click ",Object(j.jsx)("button",{disabled:!!i,onClick:function(){return v.apply(this,arguments)},children:"here"})," to turn on your guitar input."]}),Object(j.jsxs)("div",{className:"plugins-wrapper",children:[Object(j.jsx)(V,{plugins:H}),Object(j.jsx)(J,{plugins:C,pluginOrder:r.pluginOrder,setPluginOrder:P,addPlugin:_})]}),Object(j.jsx)(w,{audioContext:r.audioContext,onCabReady:m}),Object(j.jsx)("div",{children:Object(j.jsx)("audio",{controls:!0,ref:g,onPlay:function(){if(!u){var e=r.audioContext||new AudioContext({latencyHint:"interactive"}),t=g.current;b(e).then((function(){var n=e.createMediaElementSource(t);c((function(t){return Object(d.a)(Object(d.a)({},t),{},{audioContext:e,lineInStreamSource:i,diTrackStreamSource:n,inputMode:k.DI})}))}))}},children:Object(j.jsx)("source",{src:"".concat("/react-webaudio-5150","/di/LasseMagoDI.mp3"),type:"audio/mpeg"})})})]})},X=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,505)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,o=t.getTTFB;n(e),r(e),a(e),c(e),o(e)}))};i.a.render(Object(j.jsx)(Q,{}),document.getElementById("root")),X()}},[[504,1,2]]]);
//# sourceMappingURL=main.0231e3a4.chunk.js.map