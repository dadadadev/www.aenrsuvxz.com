(function (self) {
  if (self.fetch) {
    return;
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isDataView = function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj);
    };

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ',' + value : value;
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('');
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type');
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this, { body: this._bodyInit });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    rawHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = 'status' in options ? options.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : undefined);

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var smoothscroll = createCommonjsModule(function (module, exports) {
  /* smoothscroll v0.4.0 - 2017 - Dustan Kasten, Jeremias Menichelli - MIT License */
  (function () {
    var w = window;
    var d = document;

    /**
     * indicates if a the current browser is made by Microsoft
     * @method isMicrosoftBrowser
     * @param {String} userAgent
     * @returns {Boolean}
     */
    function isMicrosoftBrowser(userAgent) {
      var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

      return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }

    // polyfill
    function polyfill() {
      // return if scroll behavior is supported and polyfill is not forced
      if ('scrollBehavior' in d.documentElement.style && w.__forceSmoothScrollPolyfill__ !== true) {
        return;
      }

      // globals
      var Element = w.HTMLElement || w.Element;
      var SCROLL_TIME = 468;

      /*
       * IE has rounding bug rounding down clientHeight and clientWidth and
       * rounding up scrollHeight and scrollWidth causing false positives
       * on hasScrollableSpace
       */
      var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

      // object gathering original scroll methods
      var original = {
        scroll: w.scroll || w.scrollTo,
        scrollBy: w.scrollBy,
        elementScroll: Element.prototype.scroll || scrollElement,
        scrollIntoView: Element.prototype.scrollIntoView
      };

      // define timing method
      var now = w.performance && w.performance.now ? w.performance.now.bind(w.performance) : Date.now;

      /**
       * changes scroll position inside an element
       * @method scrollElement
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */
      function scrollElement(x, y) {
        this.scrollLeft = x;
        this.scrollTop = y;
      }

      /**
       * returns result of applying ease math function to a number
       * @method ease
       * @param {Number} k
       * @returns {Number}
       */
      function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
      }

      /**
       * indicates if a smooth behavior should be applied
       * @method shouldBailOut
       * @param {Number|Object} firstArg
       * @returns {Boolean}
       */
      function shouldBailOut(firstArg) {
        if (firstArg === null || (typeof firstArg === 'undefined' ? 'undefined' : _typeof(firstArg)) !== 'object' || firstArg.behavior === undefined || firstArg.behavior === 'auto' || firstArg.behavior === 'instant') {
          // first argument is not an object/null
          // or behavior is auto, instant or undefined
          return true;
        }

        if ((typeof firstArg === 'undefined' ? 'undefined' : _typeof(firstArg)) === 'object' && firstArg.behavior === 'smooth') {
          // first argument is an object and behavior is smooth
          return false;
        }

        // throw error when behavior is not supported
        throw new TypeError('behavior member of ScrollOptions ' + firstArg.behavior + ' is not a valid value for enumeration ScrollBehavior.');
      }

      /**
       * indicates if an element has scrollable space in the provided axis
       * @method hasScrollableSpace
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function hasScrollableSpace(el, axis) {
        if (axis === 'Y') {
          return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
        }

        if (axis === 'X') {
          return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
        }
      }

      /**
       * indicates if an element has a scrollable overflow property in the axis
       * @method canOverflow
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function canOverflow(el, axis) {
        var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

        return overflowValue === 'auto' || overflowValue === 'scroll';
      }

      /**
       * indicates if an element can be scrolled in either axis
       * @method isScrollable
       * @param {Node} el
       * @param {String} axis
       * @returns {Boolean}
       */
      function isScrollable(el) {
        var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
        var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

        return isScrollableY || isScrollableX;
      }

      /**
       * finds scrollable parent of an element
       * @method findScrollableParent
       * @param {Node} el
       * @returns {Node} el
       */
      function findScrollableParent(el) {
        var isBody;

        do {
          el = el.parentNode;

          isBody = el === d.body;
        } while (isBody === false && isScrollable(el) === false);

        isBody = null;

        return el;
      }

      /**
       * self invoked function that, given a context, steps through scrolling
       * @method step
       * @param {Object} context
       * @returns {undefined}
       */
      function step(context) {
        var time = now();
        var value;
        var currentX;
        var currentY;
        var elapsed = (time - context.startTime) / SCROLL_TIME;

        // avoid elapsed times higher than one
        elapsed = elapsed > 1 ? 1 : elapsed;

        // apply easing to elapsed time
        value = ease(elapsed);

        currentX = context.startX + (context.x - context.startX) * value;
        currentY = context.startY + (context.y - context.startY) * value;

        context.method.call(context.scrollable, currentX, currentY);

        // scroll more if we have not reached our destination
        if (currentX !== context.x || currentY !== context.y) {
          w.requestAnimationFrame(step.bind(w, context));
        }
      }

      /**
       * scrolls window or element with a smooth behavior
       * @method smoothScroll
       * @param {Object|Node} el
       * @param {Number} x
       * @param {Number} y
       * @returns {undefined}
       */
      function smoothScroll(el, x, y) {
        var scrollable;
        var startX;
        var startY;
        var method;
        var startTime = now();

        // define scroll context
        if (el === d.body) {
          scrollable = w;
          startX = w.scrollX || w.pageXOffset;
          startY = w.scrollY || w.pageYOffset;
          method = original.scroll;
        } else {
          scrollable = el;
          startX = el.scrollLeft;
          startY = el.scrollTop;
          method = scrollElement;
        }

        // scroll looping over a frame
        step({
          scrollable: scrollable,
          method: method,
          startTime: startTime,
          startX: startX,
          startY: startY,
          x: x,
          y: y
        });
      }

      // ORIGINAL METHODS OVERRIDES
      // w.scroll and w.scrollTo
      w.scroll = w.scrollTo = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scroll.call(w, arguments[0].left !== undefined ? arguments[0].left : _typeof(arguments[0]) !== 'object' ? arguments[0] : w.scrollX || w.pageXOffset,
          // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined ? arguments[0].top : arguments[1] !== undefined ? arguments[1] : w.scrollY || w.pageYOffset);

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(w, d.body, arguments[0].left !== undefined ? ~~arguments[0].left : w.scrollX || w.pageXOffset, arguments[0].top !== undefined ? ~~arguments[0].top : w.scrollY || w.pageYOffset);
      };

      // w.scrollBy
      w.scrollBy = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0])) {
          original.scrollBy.call(w, arguments[0].left !== undefined ? arguments[0].left : _typeof(arguments[0]) !== 'object' ? arguments[0] : 0, arguments[0].top !== undefined ? arguments[0].top : arguments[1] !== undefined ? arguments[1] : 0);

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
      };

      // Element.prototype.scroll and Element.prototype.scrollTo
      Element.prototype.scroll = Element.prototype.scrollTo = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          // if one number is passed, throw error to match Firefox implementation
          if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
            throw new SyntaxError('Value couldn\'t be converted');
          }

          original.elementScroll.call(this,
          // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined ? ~~arguments[0].left : _typeof(arguments[0]) !== 'object' ? ~~arguments[0] : this.scrollLeft,
          // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined ? ~~arguments[0].top : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop);

          return;
        }

        var left = arguments[0].left;
        var top = arguments[0].top;

        // LET THE SMOOTHNESS BEGIN!
        smoothScroll.call(this, this, typeof left === 'undefined' ? this.scrollLeft : ~~left, typeof top === 'undefined' ? this.scrollTop : ~~top);
      };

      // Element.prototype.scrollBy
      Element.prototype.scrollBy = function () {
        // avoid action when no arguments are passed
        if (arguments[0] === undefined) {
          return;
        }

        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.elementScroll.call(this, arguments[0].left !== undefined ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, arguments[0].top !== undefined ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop);

          return;
        }

        this.scroll({
          left: ~~arguments[0].left + this.scrollLeft,
          top: ~~arguments[0].top + this.scrollTop,
          behavior: arguments[0].behavior
        });
      };

      // Element.prototype.scrollIntoView
      Element.prototype.scrollIntoView = function () {
        // avoid smooth behavior if not required
        if (shouldBailOut(arguments[0]) === true) {
          original.scrollIntoView.call(this, arguments[0] === undefined ? true : arguments[0]);

          return;
        }

        // LET THE SMOOTHNESS BEGIN!
        var scrollableParent = findScrollableParent(this);
        var parentRects = scrollableParent.getBoundingClientRect();
        var clientRects = this.getBoundingClientRect();

        if (scrollableParent !== d.body) {
          // reveal element inside parent
          smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top);

          // reveal parent in viewport unless is fixed
          if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
            w.scrollBy({
              left: parentRects.left,
              top: parentRects.top,
              behavior: 'smooth'
            });
          }
        } else {
          // reveal element in viewport
          w.scrollBy({
            left: clientRects.left,
            top: clientRects.top,
            behavior: 'smooth'
          });
        }
      };
    }

    {
      // commonjs
      module.exports = { polyfill: polyfill };
    }
  })();
});

var smoothscroll_1 = smoothscroll.polyfill;

var setState = (function (path) {
  var state = {};

  if (path.match(/^\/$/)) {
    state.view = 'front';
    state.category = null;
    state.path = path;
  } else if (path.match(/^\/performance\//)) {
    if (path.match(/^\/.+\/list$/)) {
      state.view = 'list';
    } else {
      state.view = 'post';
    }
    state.category = 'performance';
    state.path = path;
  } else if (path.match(/^\/architecture\//)) {
    if (path.match(/^\/.+\/list$/)) {
      state.view = 'list';
    } else {
      state.view = 'post';
    }
    state.category = 'architecture';
    state.path = path;
  } else if (path.match(/^\/uiux\//)) {
    if (path.match(/^\/.+\/list$/)) {
      state.view = 'list';
    } else {
      state.view = 'post';
    }
    state.category = 'uiux';
    state.path = path;
  } else {
    state.view = '404';
    state.category = null;
    state.path = '404';
  }

  return state;
});

var topBar = document.getElementById('topBar');
var topBar_categoryItems = document.getElementById('topBar_categoryItems');

var innerContainer = document.getElementById('innerContainer');

var listView = document.getElementById('listView');
var listView_items = document.getElementById('listView_items');

var postView = document.getElementById('postView');
var postView_contentTitle = document.getElementById('postView_contentTitle');
var postView_contentTitleArea = document.getElementById('postView_contentTitleArea');
var postView_contentTimeArea = document.getElementById('postView_contentTimeArea');
var postView_contentText = document.getElementById('postView_contentText');
var postView_contentCurrentPagePre = document.getElementById('postView_contentCurrentPagePre');
var postView_contentCurrentPage = document.getElementById('postView_contentCurrentPage');
var postView_contentTotalPage = document.getElementById('postView_contentTotalPage');
var postView_contentShiftBtnPrev = document.getElementById('postView_contentShiftBtnPrev');
var postView_contentShiftBtnNext = document.getElementById('postView_contentShiftBtnNext');

var bottomBar = document.getElementById('bottomBar');
var bottomBar_navSign = document.getElementById('bottomBar_navSign');
var bottomBar_navBtn = document.getElementById('bottomBar_navBtn');
var bottomBar_navBtnContent = document.getElementById('bottomBar_navBtnContent');

var showFront = function showFront() {
  topBar.classList.add('topBar-hidden');
  innerContainer.classList.remove('innerContainer-listView');
  innerContainer.classList.remove('innerContainer-postView');
  bottomBar.classList.remove('bottomBar-listView');
};
var showList = function showList() {
  topBar.classList.remove('topBar-hidden');
  innerContainer.classList.add('innerContainer-listView');
  innerContainer.classList.remove('innerContainer-postView');
  bottomBar.classList.add('bottomBar-listView');
};
var showPost = function showPost() {
  topBar.classList.remove('topBar-hidden');
  innerContainer.classList.remove('innerContainer-listView');
  innerContainer.classList.add('innerContainer-postView');
  bottomBar.classList.add('bottomBar-listView');
};

var showTopBarPerformance = function showTopBarPerformance() {
  topBar_categoryItems.classList.add('topBar_categoryItems-performance');
  topBar_categoryItems.classList.remove('topBar_categoryItems-architecture', 'topBar_categoryItems-uiux');
};
var showTopBarArchitecture = function showTopBarArchitecture() {
  topBar_categoryItems.classList.add('topBar_categoryItems-architecture');
  topBar_categoryItems.classList.remove('topBar_categoryItems-performance', 'topBar_categoryItems-uiux');
};
var showTopBarUiux = function showTopBarUiux() {
  topBar_categoryItems.classList.add('topBar_categoryItems-uiux');
  topBar_categoryItems.classList.remove('topBar_categoryItems-performance', 'topBar_categoryItems-architecture');
};

var toggleModal = function toggleModal(e) {
  e.stopPropagation();
  bottomBar_navBtnContent.classList.toggle('bottomBar_navBtnContent-modal');
  bottomBar.classList.toggle('bottomBar-modal');
  bottomBar_navSign.classList.toggle('bottomBar_navSign-modal');
};
var closeModal = function closeModal() {
  bottomBar_navBtnContent.classList.remove('bottomBar_navBtnContent-modal');
  bottomBar.classList.remove('bottomBar-modal');
  bottomBar_navSign.classList.remove('bottomBar_navSign-modal');
};

var fetchList = function fetchList(path) {
  listView.classList.add('hidden');
  var fragment = document.createDocumentFragment();
  fetch('https://api.aenrsuvxz.com' + path + '.json').then(function (res) {
    return res.json();
  }).then(function (json) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = json.list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var post = _step.value;

        var li = document.createElement('li'),
            a = document.createElement('a'),
            h2 = document.createElement('h2'),
            time = document.createElement('time');
        a.href = post.path;
        a.classList.add('listView_item');
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var targetPath = e.target.getAttribute('href'),
              targetState = setState(targetPath);
          window.history.pushState(targetState, null, targetState.path);
          router(targetState);
        });
        h2.classList.add('title');
        h2.innerText = post.title;
        time.classList.add('info');
        time.innerText = '\u66F4\u65B0\u65E5\uFF1A ' + post.date;
        time.setAttribute('datetime', post.date);
        a.appendChild(h2);
        a.appendChild(time);
        li.appendChild(a);
        fragment.appendChild(li);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    while (listView_items.firstChild) {
      listView_items.removeChild(listView_items.firstChild);
    }
    listView.scrollTo(0, 0);
    listView_items.appendChild(fragment);
  }).then(function () {
    Ts.reload();
    setTimeout(function () {
      listView.classList.remove('hidden');
    }, 500);
  });
};
var fetchPost = function fetchPost(path) {
  postView.classList.add('hidden');
  fetch('https://api.aenrsuvxz.com' + path + '.json').then(function (res) {
    return res.json();
  }).then(function (json) {
    document.title = json.title + ' - www.aenrsuvxz.com';
    postView_contentTitleArea.innerText = json.title;
    postView_contentTimeArea.innerText = '\u66F4\u65B0\u65E5\uFF1A ' + json.date;
    postView_contentTimeArea.setAttribute('datetime', json.date);
    while (postView_contentText.firstChild) {
      postView_contentText.removeChild(postView_contentText.firstChild);
    }
    postView_contentText.innerHTML = json.text;
    postView_contentCurrentPage.innerText = '1';
    postView_contentTotalPage.innerText = ' / 0';
    postView_contentCurrentPagePre.classList.remove('defs');
    postView_contentCurrentPage.classList.remove('defs');
    postView_contentTotalPage.classList.remove('defs');
    postView_contentText.scrollTo(0, 0);

    setPostAreaHeight();
    setTotalPage();
    postScrollBtnBehavior();
  }).then(function () {
    Ts.reload();
    setTimeout(function () {
      postView.classList.remove('hidden');
    }, 500);
  });
};

var isTouch = 'ontouchstart' in window ? true : false;

var isTap = true;
var ready = true;
var currentPage = 1;
var totalPages = 1;

window.addEventListener('touchstart', function (e) {
  isTap = true;
});
window.addEventListener('touchmove', function (e) {
  isTap = false;
});
window.addEventListener('touchend', function (e) {
  isTap ? isTap = true : isTap = false;
});

postView_contentShiftBtnNext.addEventListener(isTouch ? 'touchend' : 'click', function () {
  if (ready && isTap) {
    if (currentPage < totalPages) postView_contentCurrentPage.innerText = currentPage += 1;
    postScrollBtnBehavior();
    scrollNext();
    ready = false;
    setTimeout(function () {
      ready = true;
    }, 1000);
  }
});
postView_contentShiftBtnPrev.addEventListener(isTouch ? 'touchend' : 'click', function () {
  if (ready && isTap) {
    if (currentPage > 1) postView_contentCurrentPage.innerText = currentPage -= 1;
    postScrollBtnBehavior();
    scrollPrev();
    ready = false;
    setTimeout(function () {
      ready = true;
    }, 1000);
  }
});
if (isTouch) {
  var touchStartX = void 0,
      touchMoveX = void 0;
  postView_contentText.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].pageX;
  });
  postView_contentText.addEventListener('touchmove', function (e) {
    touchMoveX = e.changedTouches[0].pageX;
    if (Math.abs(touchMoveX - touchStartX) > 10) e.preventDefault();
  });
  postView_contentText.addEventListener('touchend', function (e) {
    if (touchStartX > touchMoveX && ready) {
      if (touchStartX > touchMoveX + 30) {
        if (currentPage < totalPages) postView_contentCurrentPage.innerText = currentPage += 1;
        postScrollBtnBehavior();
        scrollNext();
        ready = false;
        setTimeout(function () {
          ready = true;
        }, 1000);
      }
    } else if (touchStartX < touchMoveX && ready) {
      if (touchStartX + 30 < touchMoveX) {
        if (currentPage > 1) postView_contentCurrentPage.innerText = currentPage -= 1;
        postScrollBtnBehavior();
        scrollPrev();
        ready = false;
        setTimeout(function () {
          ready = true;
        }, 1000);
      }
    }
  });
} else {
  postView_contentText.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (e.deltaX > 20 && ready) {
      if (currentPage < totalPages) postView_contentCurrentPage.innerText = currentPage += 1;
      postScrollBtnBehavior();
      scrollNext();
      ready = false;
      setTimeout(function () {
        ready = true;
      }, 1000);
    } else if (e.deltaX < -20 && ready) {
      if (currentPage > 1) postView_contentCurrentPage.innerText = currentPage -= 1;
      postScrollBtnBehavior();
      scrollPrev();
      ready = false;
      setTimeout(function () {
        ready = true;
      }, 1000);
    } else {
      return;
    }
  });
}

var setPostAreaHeight = function setPostAreaHeight() {
  var titleHeight = postView_contentTitle.clientHeight;
  postView_contentText.style.cssText += 'height: calc(100vh - ' + titleHeight + 'px - 115px);';
  postView_contentShiftBtnPrev.style.cssText += 'height: calc(100vh - ' + titleHeight + 'px - 115px);';
  postView_contentShiftBtnNext.style.cssText += 'height: calc(100vh - ' + titleHeight + 'px - 115px);';
};
var setTotalPage = function setTotalPage() {
  var scrollWidth = postView_contentText.scrollWidth,
      viewAreaWidth = postView_contentText.clientWidth + 65,
      restWidth = scrollWidth % viewAreaWidth,
      _scrollWidth = scrollWidth - restWidth,
      totalPage = (_scrollWidth + viewAreaWidth) / viewAreaWidth;
  postView_contentTotalPage.innerText = ' / ' + totalPage;
  totalPages = totalPage;
};
var postScrollBtnBehavior = function postScrollBtnBehavior() {
  setTimeout(function () {
    var scrollPosition = postView_contentText.scrollLeft;
    var contentWidth = postView_contentText.clientWidth;
    var scrollWidth = postView_contentText.scrollWidth;
    var targetWidth = scrollPosition + contentWidth + 50;
    if (contentWidth === scrollWidth) {
      return;
    } else if (scrollPosition === 0) {
      postView_contentShiftBtnPrev.classList.add('postView_contentShiftBtn-hidden');
      postView_contentShiftBtnNext.classList.remove('postView_contentShiftBtn-hidden');
    } else if (scrollPosition !== 0 && targetWidth < scrollWidth) {
      postView_contentShiftBtnPrev.classList.remove('postView_contentShiftBtn-hidden');
      postView_contentShiftBtnNext.classList.remove('postView_contentShiftBtn-hidden');
    } else {
      postView_contentShiftBtnPrev.classList.remove('postView_contentShiftBtn-hidden');
      postView_contentShiftBtnNext.classList.add('postView_contentShiftBtn-hidden');
    }
  }, 1000);
};
var scrollNext = function scrollNext() {
  postView_contentText.scrollBy({
    behavior: 'smooth',
    top: 0,
    left: postView_contentText.clientWidth + 65
  });
};
var scrollPrev = function scrollPrev() {
  postView_contentText.scrollBy({
    behavior: 'smooth',
    top: 0,
    left: -(postView_contentText.clientWidth + 65)
  });
};

var router = (function (state) {
  if (state.view === 'front') {
    showFront();
  } else if (state.view === 'list') {
    fetchList(state.path);
    showList();
  } else if (state.view === 'post') {
    fetchPost(state.path);
    showPost();
  } else {
    return;
  }

  if (state.category === 'performance') showTopBarPerformance();else if (state.category === 'architecture') showTopBarArchitecture();else if (state.category === 'uiux') showTopBarUiux();
});

var eventListen = (function () {

  var isTouch = 'ontouchstart' in window ? true : false;
  var isTap = true;
  window.addEventListener('touchstart', function (e) {
    isTap = true;
  });
  window.addEventListener('touchmove', function (e) {
    isTap = false;
  });
  window.addEventListener('touchend', function (e) {
    isTap ? isTap = true : isTap = false;
  });

  var anchors = document.getElementsByTagName('a');

  window.addEventListener('popstate', function (e) {
    return router(e.state);
  });

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = anchors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      anchor = _step.value;

      if (anchor.classList.contains('targetBlank')) {
        anchor.addEventListener(isTouch ? 'touchend' : 'click', function (e) {
          e.preventDefault();
          if (isTap) window.open(e.target.href);
        });
      } else {
        anchor.addEventListener(isTouch ? 'touchend' : 'click', function (e) {
          e.preventDefault();
          var currentState = setState(window.location.pathname),
              targetState = setState(e.target.getAttribute('href'));
          if (window.location.pathname === e.target.getAttribute('href')) {
            closeModal();
          } else if (isTap) {
            window.history.pushState(targetState, null, targetState.path);
            router(targetState);
          }
        });
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  bottomBar_navBtn.addEventListener(isTouch ? 'touchend' : 'click', function (e) {
    if (isTap) toggleModal(e);
  });
  bottomBar_navSign.addEventListener(isTouch ? 'touchend' : 'click', function (e) {
    if (isTap) toggleModal(e);
  });
  bottomBar.addEventListener(isTouch ? 'touchend' : 'click', function (e) {
    if (isTap) closeModal();
  });
});

smoothscroll.polyfill();

document.addEventListener('DOMContentLoaded', function () {
  var state = setState(window.location.pathname);
  window.history.replaceState(state, null, state.path);
  eventListen();
  router(state);
});
