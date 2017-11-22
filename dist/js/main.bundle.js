/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(6);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_common_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_common_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_common_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_layer_layer_js__ = __webpack_require__(7);




const App = function () {
    console.log(__WEBPACK_IMPORTED_MODULE_1__components_layer_layer_js__["a" /* default */]);
    var dom = document.getElementById('app');
    var layer = new __WEBPACK_IMPORTED_MODULE_1__components_layer_layer_js__["a" /* default */]();
    //babel 继承 jsx 这种语法到babel自身,不用下载jsx-loader，只需要在babel内部配置一下，react vue 都是可以通过jsx这种语法写代码，都可以通过babel工具支持jsx语法，不用单独在引入一个loader处理（下载jsx-loader）
    //html就是一串字符串
    //tpl相当于函数可以传递参数，通过模板引擎 显示参数到模板中
    dom.innerHTML = layer.tpl({
        name:'john',
        arr: ['apple', 'xiaomi', 'banana']
    });
}

new App();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/_css-loader@0.28.7@css-loader/index.js??ref--1-1!../../node_modules/_postcss-loader@2.0.8@postcss-loader/lib/index.js!./common.css", function() {
			var newContent = require("!!../../node_modules/_css-loader@0.28.7@css-loader/index.js??ref--1-1!../../node_modules/_postcss-loader@2.0.8@postcss-loader/lib/index.js!./common.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.i(__webpack_require__(5), "");

// module
exports.push([module.i, "body {\r\n    font-size: 16px;\r\n    font-family:  'microsoft yahei';\r\n    background-color: greenyellow;\r\n}\r\n.s-f-20{\r\n    font-size: .625em;\r\n}\r\n\r\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".flex-div{\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n}", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layer_less__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__layer_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__layer_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layer_tpl__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__layer_tpl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__layer_tpl__);



function layer() {
    return{
        name:'layer',
        tpl: __WEBPACK_IMPORTED_MODULE_1__layer_tpl___default.a
    }
}

/* harmony default export */ __webpack_exports__["a"] = (layer);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/_css-loader@0.28.7@css-loader/index.js!../../../node_modules/_postcss-loader@2.0.8@postcss-loader/lib/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./layer.less", function() {
			var newContent = require("!!../../../node_modules/_css-loader@0.28.7@css-loader/index.js!../../../node_modules/_postcss-loader@2.0.8@postcss-loader/lib/index.js!../../../node_modules/_less-loader@4.0.5@less-loader/dist/cjs.js!./layer.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.layer {\n  width: 600px;\n  height: 200px;\n  background-color: red;\n}\n.layer > div {\n  width: 400px;\n  height: 100px;\n  background: url(" + __webpack_require__(10) + ");\n}\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="layer">\r\n    <img src="' +
((__t = ( __webpack_require__(12) )) == null ? '' : __t) +
'" />\r\n    <div> this is ' +
((__t = ( name )) == null ? '' : __t) +
' layer</div>\r\n    <!--下边是 ejs模板 模板引擎写法-->\r\n    ';
 for (var i = 0;i < arr.length; i++) {;
__p += '\r\n        ' +
((__t = ( arr[i] )) == null ? '' : __t) +
'\r\n    ';
 } ;
__p += '\r\n</div>';

}
return __p
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/b-06b817.jpg";

/***/ })
/******/ ]);