!function(t){if(!t.fetch){var e={searchParams:"URLSearchParams"in t,iterable:"Symbol"in t&&"iterator"in Symbol,blob:"FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in t,arrayBuffer:"ArrayBuffer"in t};if(e.arrayBuffer)var o=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],r=function(t){return t&&DataView.prototype.isPrototypeOf(t)},n=ArrayBuffer.isView||function(t){return t&&o.indexOf(Object.prototype.toString.call(t))>-1};u.prototype.append=function(t,e){t=a(t),e=c(e);var o=this.map[t];this.map[t]=o?o+","+e:e},u.prototype.delete=function(t){delete this.map[a(t)]},u.prototype.get=function(t){return t=a(t),this.has(t)?this.map[t]:null},u.prototype.has=function(t){return this.map.hasOwnProperty(a(t))},u.prototype.set=function(t,e){this.map[a(t)]=c(e)},u.prototype.forEach=function(t,e){for(var o in this.map)this.map.hasOwnProperty(o)&&t.call(e,this.map[o],o,this)},u.prototype.keys=function(){var t=[];return this.forEach(function(e,o){t.push(o)}),l(t)},u.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),l(t)},u.prototype.entries=function(){var t=[];return this.forEach(function(e,o){t.push([o,e])}),l(t)},e.iterable&&(u.prototype[Symbol.iterator]=u.prototype.entries);var i=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];m.prototype.clone=function(){return new m(this,{body:this._bodyInit})},y.call(m.prototype),y.call(w.prototype),w.prototype.clone=function(){return new w(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new u(this.headers),url:this.url})},w.error=function(){var t=new w(null,{status:0,statusText:""});return t.type="error",t};var s=[301,302,303,307,308];w.redirect=function(t,e){if(-1===s.indexOf(e))throw new RangeError("Invalid status code");return new w(null,{status:e,headers:{location:t}})},t.Headers=u,t.Request=m,t.Response=w,t.fetch=function(t,o){return new Promise(function(r,n){var i=new m(t,o),s=new XMLHttpRequest;s.onload=function(){var t={status:s.status,statusText:s.statusText,headers:function(t){var e=new u;return t.split(/\r?\n/).forEach(function(t){var o=t.split(":"),r=o.shift().trim();if(r){var n=o.join(":").trim();e.append(r,n)}}),e}(s.getAllResponseHeaders()||"")};t.url="responseURL"in s?s.responseURL:t.headers.get("X-Request-URL");var e="response"in s?s.response:s.responseText;r(new w(e,t))},s.onerror=function(){n(new TypeError("Network request failed"))},s.ontimeout=function(){n(new TypeError("Network request failed"))},s.open(i.method,i.url,!0),"include"===i.credentials&&(s.withCredentials=!0),"responseType"in s&&e.blob&&(s.responseType="blob"),i.headers.forEach(function(t,e){s.setRequestHeader(e,t)}),s.send(void 0===i._bodyInit?null:i._bodyInit)})},t.fetch.polyfill=!0}function a(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function c(t){return"string"!=typeof t&&(t=String(t)),t}function l(t){var o={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return e.iterable&&(o[Symbol.iterator]=function(){return o}),o}function u(t){this.map={},t instanceof u?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function d(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function h(t){return new Promise(function(e,o){t.onload=function(){e(t.result)},t.onerror=function(){o(t.error)}})}function f(t){var e=new FileReader,o=h(e);return e.readAsArrayBuffer(t),o}function p(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function y(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t,t)if("string"==typeof t)this._bodyText=t;else if(e.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(e.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(e.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(e.arrayBuffer&&e.blob&&r(t))this._bodyArrayBuffer=p(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!e.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(t)&&!n(t))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=p(t)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):e.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},e.blob&&(this.blob=function(){var t=d(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?d(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(f)}),this.text=function(){var t=d(this);if(t)return t;if(this._bodyBlob)return function(t){var e=new FileReader,o=h(e);return e.readAsText(t),o}(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),o=new Array(e.length),r=0;r<e.length;r++)o[r]=String.fromCharCode(e[r]);return o.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},e.formData&&(this.formData=function(){return this.text().then(v)}),this.json=function(){return this.text().then(JSON.parse)},this}function m(t,e){var o=(e=e||{}).body;if(t instanceof m){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new u(t.headers)),this.method=t.method,this.mode=t.mode,o||null==t._bodyInit||(o=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"omit",!e.headers&&this.headers||(this.headers=new u(e.headers)),this.method=function(t){var e=t.toUpperCase();return i.indexOf(e)>-1?e:t}(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function v(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var o=t.split("="),r=o.shift().replace(/\+/g," "),n=o.join("=").replace(/\+/g," ");e.append(decodeURIComponent(r),decodeURIComponent(n))}}),e}function w(t,e){e||(e={}),this.type="default",this.status="status"in e?e.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new u(e.headers),this.url=e.url||"",this._initBody(t)}}("undefined"!=typeof self?self:void 0);function createCommonjsModule(t,e){return t(e={exports:{}},e.exports),e.exports}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},smoothscroll=createCommonjsModule(function(t,e){!function(){var e=window,o=document;function r(){if(!("scrollBehavior"in o.documentElement.style&&!0!==e.__forceSmoothScrollPolyfill__)){var t,r=e.HTMLElement||e.Element,n=468,i=(t=e.navigator.userAgent,new RegExp(["MSIE ","Trident/","Edge/"].join("|")).test(t)?1:0),s={scroll:e.scroll||e.scrollTo,scrollBy:e.scrollBy,elementScroll:r.prototype.scroll||c,scrollIntoView:r.prototype.scrollIntoView},a=e.performance&&e.performance.now?e.performance.now.bind(e.performance):Date.now;e.scroll=e.scrollTo=function(){void 0!==arguments[0]&&(!0!==l(arguments[0])?p.call(e,o.body,void 0!==arguments[0].left?~~arguments[0].left:e.scrollX||e.pageXOffset,void 0!==arguments[0].top?~~arguments[0].top:e.scrollY||e.pageYOffset):s.scroll.call(e,void 0!==arguments[0].left?arguments[0].left:"object"!==_typeof(arguments[0])?arguments[0]:e.scrollX||e.pageXOffset,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:e.scrollY||e.pageYOffset))},e.scrollBy=function(){void 0!==arguments[0]&&(l(arguments[0])?s.scrollBy.call(e,void 0!==arguments[0].left?arguments[0].left:"object"!==_typeof(arguments[0])?arguments[0]:0,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:0):p.call(e,o.body,~~arguments[0].left+(e.scrollX||e.pageXOffset),~~arguments[0].top+(e.scrollY||e.pageYOffset)))},r.prototype.scroll=r.prototype.scrollTo=function(){if(void 0!==arguments[0])if(!0!==l(arguments[0])){var t=arguments[0].left,e=arguments[0].top;p.call(this,this,void 0===t?this.scrollLeft:~~t,void 0===e?this.scrollTop:~~e)}else{if("number"==typeof arguments[0]&&void 0===arguments[1])throw new SyntaxError("Value couldn't be converted");s.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left:"object"!==_typeof(arguments[0])?~~arguments[0]:this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top:void 0!==arguments[1]?~~arguments[1]:this.scrollTop)}},r.prototype.scrollBy=function(){void 0!==arguments[0]&&(!0!==l(arguments[0])?this.scroll({left:~~arguments[0].left+this.scrollLeft,top:~~arguments[0].top+this.scrollTop,behavior:arguments[0].behavior}):s.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left+this.scrollLeft:~~arguments[0]+this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top+this.scrollTop:~~arguments[1]+this.scrollTop))},r.prototype.scrollIntoView=function(){if(!0!==l(arguments[0])){var t=function(t){var e;do{e=(t=t.parentNode)===o.body}while(!1===e&&!1===h(t));return e=null,t}(this),r=t.getBoundingClientRect(),n=this.getBoundingClientRect();t!==o.body?(p.call(this,t,t.scrollLeft+n.left-r.left,t.scrollTop+n.top-r.top),"fixed"!==e.getComputedStyle(t).position&&e.scrollBy({left:r.left,top:r.top,behavior:"smooth"})):e.scrollBy({left:n.left,top:n.top,behavior:"smooth"})}else s.scrollIntoView.call(this,void 0===arguments[0]||arguments[0])}}function c(t,e){this.scrollLeft=t,this.scrollTop=e}function l(t){if(null===t||"object"!==(void 0===t?"undefined":_typeof(t))||void 0===t.behavior||"auto"===t.behavior||"instant"===t.behavior)return!0;if("object"===(void 0===t?"undefined":_typeof(t))&&"smooth"===t.behavior)return!1;throw new TypeError("behavior member of ScrollOptions "+t.behavior+" is not a valid value for enumeration ScrollBehavior.")}function u(t,e){return"Y"===e?t.clientHeight+i<t.scrollHeight:"X"===e?t.clientWidth+i<t.scrollWidth:void 0}function d(t,o){var r=e.getComputedStyle(t,null)["overflow"+o];return"auto"===r||"scroll"===r}function h(t){var e=u(t,"Y")&&d(t,"Y"),o=u(t,"X")&&d(t,"X");return e||o}function f(t){var o,r,i,s=(a()-t.startTime)/n;c=s=s>1?1:s,o=.5*(1-Math.cos(Math.PI*c));var c;r=t.startX+(t.x-t.startX)*o,i=t.startY+(t.y-t.startY)*o,t.method.call(t.scrollable,r,i),r===t.x&&i===t.y||e.requestAnimationFrame(f.bind(e,t))}function p(t,r,n){var i,l,u,d,h=a();t===o.body?(i=e,l=e.scrollX||e.pageXOffset,u=e.scrollY||e.pageYOffset,d=s.scroll):(i=t,l=t.scrollLeft,u=t.scrollTop,d=c),f({scrollable:i,method:d,startTime:h,startX:l,startY:u,x:r,y:n})}}t.exports={polyfill:r}}()}),smoothscroll_1=smoothscroll.polyfill,setState=function(t){var e={};return t.match(/^\/$/)?(e.view="front",e.category=null,e.path=t):t.match(/^\/performance\//)?(t.match(/^\/.+\/list$/)?e.view="list":e.view="post",e.category="performance",e.path=t):t.match(/^\/architecture\//)?(t.match(/^\/.+\/list$/)?e.view="list":e.view="post",e.category="architecture",e.path=t):t.match(/^\/uiux\//)?(t.match(/^\/.+\/list$/)?e.view="list":e.view="post",e.category="uiux",e.path=t):(e.view="404",e.category=null,e.path="404"),e},$=function(t){return document.getElementById(t)},showFront=function(){$("topBar").classList.add("topBar-hidden"),$("innerContainer").classList.remove("innerContainer-listView"),$("innerContainer").classList.remove("innerContainer-postView"),$("bottomBar").classList.remove("bottomBar-listView")},showList=function(){$("topBar").classList.remove("topBar-hidden"),$("innerContainer").classList.add("innerContainer-listView"),$("innerContainer").classList.remove("innerContainer-postView"),$("bottomBar").classList.add("bottomBar-listView")},showPost=function(){$("topBar").classList.remove("topBar-hidden"),$("innerContainer").classList.remove("innerContainer-listView"),$("innerContainer").classList.add("innerContainer-postView"),$("bottomBar").classList.add("bottomBar-listView")},showTopBarPerformance=function(){$("topBar_categoryItems").classList.add("topBar_categoryItems-performance"),$("topBar_categoryItems").classList.remove("topBar_categoryItems-architecture","topBar_categoryItems-uiux")},showTopBarArchitecture=function(){$("topBar_categoryItems").classList.add("topBar_categoryItems-architecture"),$("topBar_categoryItems").classList.remove("topBar_categoryItems-performance","topBar_categoryItems-uiux")},showTopBarUiux=function(){$("topBar_categoryItems").classList.add("topBar_categoryItems-uiux"),$("topBar_categoryItems").classList.remove("topBar_categoryItems-performance","topBar_categoryItems-architecture")},toggleModal=function(t){t.stopPropagation(),$("bottomBar_navBtnContent").classList.toggle("bottomBar_navBtnContent-modal"),$("bottomBar").classList.toggle("bottomBar-modal"),$("bottomBar_navSign").classList.toggle("bottomBar_navSign-modal")},closeModal=function(){$("bottomBar_navBtnContent").classList.remove("bottomBar_navBtnContent-modal"),$("bottomBar").classList.remove("bottomBar-modal"),$("bottomBar_navSign").classList.remove("bottomBar_navSign-modal")},fetchList=function(t){$("listView").classList.add("hidden");var e=document.createDocumentFragment();fetch("https://api.aenrsuvxz.com"+t+".json").then(function(t){return t.json()}).then(function(t){var o=!0,r=!1,n=void 0;try{for(var i,s=t.list[Symbol.iterator]();!(o=(i=s.next()).done);o=!0){var a=i.value,c=document.createElement("li"),l=document.createElement("a"),u=document.createElement("h2"),d=document.createElement("time");l.href=a.path,l.classList.add("listView_item"),l.addEventListener("click",function(t){t.preventDefault();var e=t.target.getAttribute("href"),o=setState(e);window.history.pushState(o,null,o.path),router(o)}),u.classList.add("title"),u.innerText=a.title,d.classList.add("info"),d.innerText="更新日： "+a.date,d.setAttribute("datetime",a.date),l.appendChild(u),l.appendChild(d),c.appendChild(l),e.appendChild(c)}}catch(t){r=!0,n=t}finally{try{!o&&s.return&&s.return()}finally{if(r)throw n}}for(;$("listView_items").firstChild;)$("listView_items").removeChild($("listView_items").firstChild);$("listView").scrollTo(0,0),$("listView_items").appendChild(e)}).then(function(){Ts.onComplete(function(t){0===t.code&&$("listView").classList.remove("hidden"),-2===t.code&&$("listView").classList.remove("hidden")}),Ts.reload()})},isTouch="ontouchstart"in window&&{},isTap=!0,ready=!0,currentPage=1,totalPages=1,setPostAreaHeight=function(){var t=$("postView_contentTitle").clientHeight;$("postView_contentText").style.cssText+="height: calc(100vh - "+t+"px - 115px);",$("postView_contentShiftBtnPrev").style.cssText+="height: calc(100vh - "+t+"px - 115px);",$("postView_contentShiftBtnNext").style.cssText+="height: calc(100vh - "+t+"px - 115px);"},setTotalPage=function(){var t=$("postView_contentText").scrollWidth,e=$("postView_contentText").clientWidth+65,o=(t-t%e+e)/e;$("postView_contentTotalPage").innerText=" / "+o,totalPages=o},postScrollBtnBehavior=function(){setTimeout(function(){var t=$("postView_contentText").scrollLeft,e=$("postView_contentText").clientWidth,o=$("postView_contentText").scrollWidth,r=t+e+50;0===t?($("postView_contentShiftBtnPrev").classList.add("postView_contentShiftBtn-hidden"),$("postView_contentShiftBtnNext").classList.remove("postView_contentShiftBtn-hidden")):0!==t&&r<o?($("postView_contentShiftBtnPrev").classList.remove("postView_contentShiftBtn-hidden"),$("postView_contentShiftBtnNext").classList.remove("postView_contentShiftBtn-hidden")):($("postView_contentShiftBtnPrev").classList.remove("postView_contentShiftBtn-hidden"),$("postView_contentShiftBtnNext").classList.add("postView_contentShiftBtn-hidden"))},1e3)},scrollNext=function(){$.postView_contentText.scrollBy({behavior:"smooth",top:0,left:$("postView_contentText").clientWidth+65})},scrollPrev=function(){$.postView_contentText.scrollBy({behavior:"smooth",top:0,left:-($("postView_contentText").clientWidth+65)})},fetchPost=function(t){$("postView").classList.add("hidden"),currentPage=1,fetch("https://api.aenrsuvxz.com"+t+".json").then(function(t){return t.json()}).then(function(t){for(document.title=t.title+" - www.aenrsuvxz.com",$("postView_contentTitleArea").innerText=t.title,$("postView_contentTimeArea").innerText="更新日： "+t.date,$("postView_contentTimeArea").setAttribute("datetime",t.date);$("postView_contentText").firstChild;)$("postView_contentText").removeChild($("postView_contentText").firstChild);$("postView_contentText").innerHTML=t.text,$("postView_contentCurrentPage").innerText="1",$("postView_contentTotalPage").innerText=" / 0",$("postView_contentCurrentPagePre").classList.remove("defs"),$("postView_contentCurrentPage").classList.remove("defs"),$("postView_contentTotalPage").classList.remove("defs"),$("postView_contentText").scrollTo(0,0)}).then(function(){Ts.onComplete(function(t){0===t.code&&$("postView").classList.remove("hidden"),-2===t.code&&$("postView").classList.remove("hidden")}),Ts.reload()}).then(function(){setPostAreaHeight(),setTotalPage(),postScrollBtnBehavior()})};if(window.addEventListener("touchstart",function(t){isTap=!0}),window.addEventListener("touchmove",function(t){isTap=!1}),window.addEventListener("touchend",function(t){isTap=!!isTap}),$("postView_contentShiftBtnNext").addEventListener(isTouch?"touchend":"click",function(){ready&&isTap&&(currentPage<totalPages&&($("postView_contentCurrentPage").innerText=currentPage+=1),postScrollBtnBehavior(),scrollNext(),ready=!1,setTimeout(function(){ready=!0},1e3))}),$("postView_contentShiftBtnPrev").addEventListener(isTouch?"touchend":"click",function(){ready&&isTap&&(currentPage>1&&($("postView_contentCurrentPage").innerText=currentPage-=1),postScrollBtnBehavior(),scrollPrev(),ready=!1,setTimeout(function(){ready=!0},1e3))}),isTouch){var touchStartX=void 0,touchMoveX=void 0;$("postView_contentText").addEventListener("touchstart",function(t){touchStartX=t.touches[0].pageX}),$("postView_contentText").addEventListener("touchmove",function(t){touchMoveX=t.changedTouches[0].pageX,Math.abs(touchMoveX-touchStartX)>10&&t.preventDefault()}),$("postView_contentText").addEventListener("touchend",function(t){touchStartX>touchMoveX&&ready?touchStartX>touchMoveX+30&&(currentPage<totalPages&&($("postView_contentCurrentPage").innerText=currentPage+=1),postScrollBtnBehavior(),scrollNext(),ready=!1,setTimeout(function(){ready=!0},1e3)):touchStartX<touchMoveX&&ready&&touchStartX+30<touchMoveX&&(currentPage>1&&($("postView_contentCurrentPage").innerText=currentPage-=1),postScrollBtnBehavior(),scrollPrev(),ready=!1,setTimeout(function(){ready=!0},1e3))})}else $("postView_contentText").addEventListener("wheel",function(t){t.preventDefault(),t.deltaX>20&&ready?(currentPage<totalPages&&($("postView_contentCurrentPage").innerText=currentPage+=1),postScrollBtnBehavior(),scrollNext(),ready=!1,setTimeout(function(){ready=!0},1e3)):t.deltaX<-20&&ready&&(currentPage>1&&($("postView_contentCurrentPage").innerText=currentPage-=1),postScrollBtnBehavior(),scrollPrev(),ready=!1,setTimeout(function(){ready=!0},1e3))});var router=function(t){if("front"===t.view)showFront();else if("list"===t.view)fetchList(t.path),showList();else{if("post"!==t.view)return;fetchPost(t.path),showPost()}"performance"===t.category?showTopBarPerformance():"architecture"===t.category?showTopBarArchitecture():"uiux"===t.category&&showTopBarUiux()},eventListen=function(){var t="ontouchstart"in window&&{},e=!0;window.addEventListener("touchstart",function(t){e=!0}),window.addEventListener("touchmove",function(t){e=!1}),window.addEventListener("touchend",function(t){e=!!e});var o=document.getElementsByTagName("a");window.addEventListener("popstate",function(t){return router(t.state)});var r=!0,n=!1,i=void 0;try{for(var s,a=o[Symbol.iterator]();!(r=(s=a.next()).done);r=!0)anchor=s.value,anchor.classList.contains("targetBlank")?anchor.addEventListener(t?"touchend":"click",function(t){t.preventDefault(),e&&window.open(t.target.href)}):anchor.addEventListener(t?"touchend":"click",function(t){t.preventDefault();setState(window.location.pathname);var o=setState(t.target.getAttribute("href"));window.location.pathname===t.target.getAttribute("href")?closeModal():e&&(window.history.pushState(o,null,o.path),router(o))})}catch(t){n=!0,i=t}finally{try{!r&&a.return&&a.return()}finally{if(n)throw i}}$("bottomBar_navBtn").addEventListener(t?"touchend":"click",function(t){e&&toggleModal(t)}),$("bottomBar_navSign").addEventListener(t?"touchend":"click",function(t){e&&toggleModal(t)}),$("bottomBar").addEventListener(t?"touchend":"click",function(){e&&closeModal()})};
/* @license smoothscroll v0.4.0 - 2017 - Dustan Kasten, Jeremias Menichelli - MIT License */
smoothscroll.polyfill(),document.addEventListener("DOMContentLoaded",function(){var t=setState(window.location.pathname);window.history.replaceState(t,null,t.path),eventListen(),router(t)});
