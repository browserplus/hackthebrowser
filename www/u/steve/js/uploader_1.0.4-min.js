if(typeof BPTool=="undefined"||!BPTool){var BPTool={}}BPTool.Uploader=typeof BPTool.Uploader!="undefined"&&BPTool.Uploader?BPTool.Uploader:function(){var D=1;var C=false;var A={UPLOAD:"uploaded",ADD:"add",REMOVE:"remove",SELECT:"select",UNSELECT:"unselect"};var H='<div style="position:relative; width:100%; height:100%; padding:0; background:{uploadBackground}; font:{uploadFont}">    <div style="color:{titleColor};">        <div style="position:absolute; top:10px; left:32px;">{fileLabel}</div>        <div style="position:absolute; top:10px; right:110px;">{sizeLabel}</div>        <div style="position:absolute; top:10px; right:24px;">{removeLabel}</div>    </div>    <div id="{dzid}" style="position:absolute; top:24px; left:16px; {filesWidth}; {filesHeight}; border:{fileBorder}; background:{fileBackground}; overflow-y:auto;overflow-x:hidden;">        {files}    </div>    <div style="position:absolute; bottom:16px; left:16px; {filesWidth}; height:29px; border:{footerBorder}; color:{footerColor}; background:{footerBackground}; font:{footerFont};">        <div style="position:absolute; bottom:7px; left:10px; width:200px;">{numfiles}</div>        <div style="position:absolute; bottom:7px; left:64px; width:200px; "><a id="{browseButton}" style="color:{footerColor};" href="#">{browseLabel}</a></div>        <div style="position:absolute; bottom:7px; right:80px;">{totalLabel}: {total}</div>        <div style="position:absolute; bottom:7px; right:5px; visibility:{vupload};"><a id="{uploadButton}" style="color:{footerColor};" href="#">{uploadLabel}</a></div>    </div></div>';var B='<div id="{dzid}_file{index}" style="position:relative; width:100%; height:20px; color:{fileColor};cursor:default;">   <div id="{dzid}_prog{index}" style="position:absolute; width: 0%; height:20px; background:#ccc;"></div>   <div style="position:absolute; top:5px; left: 10px;">{fname}</div>   <div style="position:absolute; top:5px; right:80px;">{fsize}</div>   <div title="{trashLabel}" class="{dzid}_remove" style="position:absolute; top:7px; right:22px; width:10px; height:10px;background:transparent url(http://l.yimg.com/g/images/upload/trash_can.gif) no-repeat; margin-left:15px; text-decoration:none;"></div></div>';var K='<div style="width:100%; height:100%; padding:0; background:#f7f7f7; font-size:10pt; font-family:Tahoma,Verdana,Arial,Sans-Serif;">    <div style="padding:20px;">        To use the advanced uploader you must first install Yahoo BrowserPlus&trade;.         <a target="_blank" href="{url}">Click here</a> to install BrowserPlus.          Installation will take just a few minutes and not require a browser restart.    </div></div>';var E='<div style="position:relative; width:100%; height:100%; padding:0; background:#f7f7f7; font-family:Arial,Sans-Serif;"">    <div style="position:absolute; top:16px; left:16px; bottom:16px; right:16px; background:#fff; border:1px solid #ccc;">        <div style="position:relative; top:15px; left:20px; font-size:11pt; font-weight:bold; ">Loading Advanced Uploader...</div>        <div style="position:absolute; top:35px; right:20px; left:20px; height:17px; border:1px solid #e4e4e4;width:200px;">           <div style="width:{percentage}%; height:17px; background:#666;"></div>        </div>    </div></div>';var G='<div style="position:relative; width:100%; height:100%; background:#f7f7f7; font-size:10pt; font-family:Tahoma,Verdana,Arial,Sans-Serif;">    <div style="padding:20px;">        <div style="font-weight:bold; padding:0 0 16px 0">Error loading Yahoo! BrowserPlus&trade;</div>        <div style="padding:0 0 10px 0;">Please report this error to the website administrator:</div>        <div style="padding:8px; background:#ddd; font-family:monospace;font-size:9pt;">{error}</div>    </div></div>';function L(){return"ybpt_uploader_dz_"+D++}function J(a,P){var T,S,R,W,X,Z,V=[],Q,U=" ",O="{",Y="}";for(;;){T=a.lastIndexOf(O);if(T<0){break}S=a.indexOf(Y,T);if(T+1>=S){break}Q=a.substring(T+1,S);W=Q;Z=null;R=W.indexOf(U);if(R>-1){Z=W.substring(R+1);W=W.substring(0,R)}X=P[W];a=a.substring(0,T)+X+a.substring(S+1)}for(T=V.length-1;T>=0;T=T-1){a=a.replace(new RegExp("~-"+T+"-~"),"{"+V[T]+"}","g")}return a}function I(O){if(O){return(typeof O.length==="number"&&isFinite(O.length)&&typeof O.splice==="function")}return false}function N(O){return(O&&(typeof O==="object"||typeof O==="function"))||false}function F(O){var P,Q={};for(P=0;P<O.length;P++){Q[O[P]]=1}return Q}function M(Q,P){var O;if(P){for(O in P){if(P.hasOwnProperty(O)&&Q.hasOwnProperty(O)){Q[O]=P[O]}}}return Q}return{create:function(R,S){var P=R;var Q=null;var O={fileCB:null,postCB:null,uploadUrl:null,fileVarName:"file",mimeTypes:null,uploadBackground:"#f7f7f7",uploadFont:"8pt tahoma,sans-serif",titleColor:"#666",fileLabel:"File",sizeLabel:"Size",removeLabel:"Remove?",trashLabel:"Remove file from list",fileBorder:"1px solid #ccc",fileBackground:"#fff",fileColor:"#666",selectBackground:"#006adb",selectColor:"#fff",browseLabel:"Browse...",uploadLabel:"Upload",hoverBackground:"#ffd",progressBackground:"#ccc",progressBorderColor:"#f08",footerBackground:"#eee",footerFont:"bold 8pt tahoma,sans-serif",footerBorder:"1px solid #ccc",footerColor:"#000",fileLabel:"File",filesLabel:"Files",totalLabel:"Total"};if(typeof R!="string"){throw"BPTool.Uploader.create() requires a string argument which is the id of a div into which an advanced uploader is rendered."}O=M(O,S);if(I(O.mimeTypes)&&O.mimeTypes.length>0){Q=F(O.mimeTypes)}return function(){var b=L();var X=b+"browse";var U=b+"upload";var e=[];var k=null;function h(p){var o,n=[" B"," KB"," MB"," GB"," TB"];for(o=0;p>1024;o++){p/=1024}return Math.round(p*10)/10+n[o]}function d(n){return b+"_"+n.BrowserPlusHandleID}function Y(n,p,o){if(O.fileCB){O.fileCB({success:true,action:p,name:n.name,size:n.size,id:P,uuid:d(n),value:o})}}function V(){var o=document.getElementById(b);var n=document.createTextNode(".");o.appendChild(n);o.removeChild(n)}function Z(n){var o=document.getElementById(R);if(!o){throw ("No such id: '"+R+'"')}o.innerHTML=J(K,{url:n})}function f(n){var o=document.getElementById(R);if(!o){throw ("No such id: '"+R+'"')}o.innerHTML=J(G,{error:n})}function i(n){var o=document.getElementById(R);if(!o){throw ("No such id: '"+R+'"')}o.innerHTML=J(E,{percentage:n.totalPercentage})}function T(p,o){var n=document.getElementById(p);if(o){n.className=b+"_selected";n.style.backgroundColor=O.selectBackground;n.style.color=O.selectColor}else{n.className="";n.style.backgroundColor="";n.style.color=O.fileColor}}function j(o){for(var n=0;n<o.length;n++){if((!Q||Q[o[n].mimeType]===1)&&o[n].mimeType!="application/x-folder"){Y(o[n],A.ADD);e.push(o[n])}}l()}function m(n){var o=document.getElementById(b);o.style.background=n?O.hoverBackground:O.fileBackground;V()}function c(s){var q,n,o,r;if(!C){s=s||window.event;q=s.target||s.srcElement;if(q&&3==q.nodeType){q=q.parentNode}if(q.className==(b+"_remove")){n=q.parentNode.id.match(/[0-9]+$/);if(n[0]){if(k){Y(e[k.match(/[0-9]+$/)[0]],A.UNSELECT);k=null}Y(e[n[0]],A.REMOVE);e.splice(n[0],1);l()}}else{o=new RegExp(b+"_file[0-9]+");r=null;if(o.test(q.id)){r=q}else{if(o.test(q.parentNode.id)){r=q.parentNode}}if(r){if(k){T(k,false);Y(e[k.match(/[0-9]+$/)[0]],A.UNSELECT);if(r.id!=k){T(r.id,true);k=r.id;Y(e[k.match(/[0-9]+$/)[0]],A.SELECT)}else{k=null}}else{T(r.id,true);k=r.id;Y(e[k.match(/[0-9]+$/)[0]],A.SELECT)}}else{if(k){T(k,false);Y(e[k.match(/[0-9]+$/)[0]],A.UNSELECT);k=null}}}}}function W(n){var o=O.mimeTypes?{mimeTypes:O.mimeTypes}:{};BrowserPlus.FileBrowse.OpenBrowseDialog(o,function(p){if(p.success){j(p.value)}});return false}function g(n){if(O.uploadUrl){if(k){T(k,false);Y(e[k.match(/[0-9]+$/)[0]],A.UNSELECT);k=null}a();if(document.getElementById(U)){document.getElementById(U).style.visibility="hidden"}return false}}function l(){var r,n="",u,o=0,v,q,p,t,s;p=document.getElementById(R);q=p.offsetHeight?("height:"+(p.offsetHeight-72)+"px"):"bottom:48px";v=p.offsetWidth?("width:"+(p.offsetWidth-32)+"px"):"right:16px";for(r=0;r<e.length;r++){u="";if(e[r].size){u=h(e[r].size);o+=e[r].size}n+=J(B,{index:r,fname:e[r].BrowserPlusHandleName,fsize:u,dzid:b,trashLabel:O.trashLabel,fileColor:O.fileColor})}t={filesHeight:q,filesWidth:v,dzid:b,browseButton:X,uploadButton:U,numfiles:e.length+" "+(e.length===1?O.fileLabel:O.filesLabel),total:h(o),vupload:(e.length>0&&!C?"visible":"hidden"),files:n};for(s in O){if(O.hasOwnProperty(s)){t[s]=O[s]}}p.innerHTML=J(H,t);BrowserPlus.DragAndDrop.RemoveDropTarget({id:b},function(){BrowserPlus.DragAndDrop.AddDropTarget({id:b},function(w){if(w.success){BrowserPlus.DragAndDrop.AttachCallbacks({id:b,hover:m,drop:j},function(){})}})});document.getElementById(b).onclick=c;document.getElementById(X).onclick=W;document.getElementById(U).onclick=g;if(k){T(k,true)}}function a(){var p,q="",n=document.getElementById(b+"_prog0");if(e.length===0){C=false;return false}C=true;n.style.borderRight="2px solid "+O.progressBorderColor;n.style.background=O.progressBackground;function v(s){n.style.width=Math.min(s.filePercent,100)+"%";V()}function t(w){if(w.success){var s=e[0];e.shift();l();Y(s,A.UPLOAD,w.value);a()}else{if(O.fileCB){O.fileCB({success:false,error:w.error,verboseError:w.verboseError,id:P});C=false;l()}}}var r,u={},o={};u[O.fileVarName]=e[0];r={url:O.uploadUrl,progressCallback:v,files:u,cookies:document.cookie};if(O.postCB){o=O.postCB(d(e[0]));if(N(o)){r.postvars=o}}BrowserPlus.Uploader.upload(r,t);return false}return{render:function(){BrowserPlus.init({},function(n){if(n.success){BrowserPlus.require({services:[{service:"Uploader",version:"3"},{service:"DragAndDrop",version:"1"},{service:"FileBrowse",version:"1"}],progressCallback:i},function(o){if(o.success){l()}else{var p=o.verboseError?o.verboseError:o.error;f("problem loading services: "+p)}})}else{if(n.error==="bp.notInstalled"){Z("http://browserplus.yahoo.com/install")}}})}}}()}}}();