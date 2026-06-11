/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/ui-kit/Button/Button.tsx"
/*!**********************************************!*\
  !*** ./src/scripts/ui-kit/Button/Button.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


const COLOR_SCHEMES = {
  grape: {
    active: {
      default: {
        background: 'linear-gradient(90deg, #5823EB 0%, #6D00D2 100%)',
        color: 'rgb(255, 255, 255)'
      },
      hovered: {
        background: '#7955F9'
      },
      pressed: {
        background: '#3D1FAA'
      }
    },
    inactive: {
      default: {
        background: 'linear-gradient(90deg, #ECEFFF 0%, #F2E8FF 100%)',
        color: '#5230D0'
      },
      hovered: {
        background: '#ffffff'
      },
      pressed: {
        background: '#DDDDDD'
      }
    }
  },
  raspberry: {
    active: {
      default: {
        background: 'linear-gradient(90deg, rgb(215, 69, 255) 0%, rgb(245, 47, 162) 100%)',
        color: 'rgb(255, 255, 255)'
      }
    },
    inactive: {
      default: {
        background: 'linear-gradient(90deg, rgb(247, 217, 255) 0%, rgb(255, 200, 232) 100%)',
        color: 'rgb(188, 0, 173)'
      }
    }
  },
  strawberry: {
    active: {
      default: {
        background: 'linear-gradient(90deg, #F74098 0%, #F64B30 100%)',
        color: 'rgb(255, 255, 255)'
      }
    },
    inactive: {
      default: {
        background: 'linear-gradient(90deg, #FFD4E9, #FFCFC8 100%)',
        color: 'rgb(188, 0, 173)'
      }
    }
  }
};
const DEFAULT_RADIUS = {
  desktop: '8px',
  tablet: '8px',
  phone: '6px'
};
const sizeMap = {
  sm: {
    phone: {
      padding: '8px 12px',
      fontSize: '16px'
    },
    tablet: {
      padding: '8px 12px',
      fontSize: '16px'
    },
    desktop: {
      padding: '8px 12px',
      fontSize: '16px'
    }
  },
  md: {
    phone: {
      padding: '8px 24px',
      fontSize: '24px'
    },
    tablet: {
      padding: '8px 24px',
      fontSize: '24px'
    },
    desktop: {
      padding: '8px 24px',
      fontSize: '24px'
    }
  },
  lg: {
    phone: {
      padding: '6px 18px',
      fontSize: '18px'
    },
    tablet: {
      padding: '8px 24px',
      fontSize: '24px'
    },
    desktop: {
      padding: '12px 36px',
      fontSize: '36px'
    }
  }
};
function getSizeProp(size, bp, prop) {
  return sizeMap[size]?.[bp]?.[prop];
}
function resolveSchemeColors(colors, state, customColors) {
  if (colors !== 'custom' && customColors) {
    const scheme = COLOR_SCHEMES[colors];
    const schemeState = state === 'active' ? scheme.active : scheme.inactive;
    if (!schemeState) return customColors;
    return {
      background: customColors.background || schemeState.default.background,
      color: customColors.color || schemeState.default.color,
      borderColor: customColors.borderColor
    };
  }
  if (colors !== 'custom') {
    const scheme = COLOR_SCHEMES[colors];
    const schemeState = state === 'active' ? scheme.active : scheme.inactive;
    if (!schemeState) return {};
    return {
      background: schemeState.default.background,
      color: schemeState.default.color
    };
  }
  return customColors || {};
}
function getRadius(borderRadius, bp) {
  if (!borderRadius) return DEFAULT_RADIUS[bp];
  if (typeof borderRadius === 'string') return borderRadius;
  return borderRadius[bp] || DEFAULT_RADIUS[bp];
}
function getSchemeName(colors) {
  return colors;
}
function hasDefinedHover(colors, state) {
  if (colors === 'custom') return false;
  const scheme = COLOR_SCHEMES[colors];
  const schemeState = state === 'active' ? scheme.active : scheme.inactive;
  return !!schemeState?.hovered;
}
function getHoverBackground(colors, state) {
  if (colors === 'custom') return undefined;
  const scheme = COLOR_SCHEMES[colors];
  const schemeState = state === 'active' ? scheme.active : scheme.inactive;
  return schemeState?.hovered?.background;
}
function getPressedBackground(colors, state) {
  if (colors === 'custom') return undefined;
  const scheme = COLOR_SCHEMES[colors];
  const schemeState = state === 'active' ? scheme.active : scheme.inactive;
  return schemeState?.pressed?.background;
}
const Button = ({
  isActive = true,
  active: activeColors,
  inactive: inactiveColors,
  colors = 'grape',
  icon,
  onClick,
  children,
  className = '',
  disabled = false,
  size = 'md',
  href,
  target,
  rel,
  borderRadius
}) => {
  const currentColors = isActive ? resolveSchemeColors(colors, 'active', activeColors) : resolveSchemeColors(colors, 'inactive', inactiveColors);
  const style = {
    background: currentColors.background,
    color: currentColors.color,
    border: `1px solid ${currentColors.borderColor || 'transparent'}`,
    '--button-padding-desktop': getSizeProp(size, 'desktop', 'padding'),
    '--button-padding-tablet': getSizeProp(size, 'tablet', 'padding'),
    '--button-padding-phone': getSizeProp(size, 'phone', 'padding'),
    '--button-font-size-desktop': getSizeProp(size, 'desktop', 'fontSize'),
    '--button-font-size-tablet': getSizeProp(size, 'tablet', 'fontSize'),
    '--button-font-size-phone': getSizeProp(size, 'phone', 'fontSize'),
    '--button-radius-desktop': getRadius(borderRadius, 'desktop'),
    '--button-radius-tablet': getRadius(borderRadius, 'tablet'),
    '--button-radius-phone': getRadius(borderRadius, 'phone'),
    '--button-hover-bg': getHoverBackground(colors, isActive ? 'active' : 'inactive'),
    '--button-pressed-bg': getPressedBackground(colors, isActive ? 'active' : 'inactive')
  };
  const dataAttrs = {
    'data-colors': getSchemeName(colors),
    'data-hover-defined': hasDefinedHover(colors, isActive ? 'active' : 'inactive') ? 'true' : undefined
  };
  const classNames = ['ui-button', isActive ? 'ui-button--active' : '', className].filter(Boolean).join(' ');
  const content = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, icon && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "ui-button__icon"
  }, icon), children && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "ui-button__text"
  }, children));
  if (href) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: href,
      target: target,
      rel: rel,
      onClick: onClick,
      className: classNames,
      style: style,
      ...dataAttrs
    }, content);
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: classNames,
    style: style,
    onClick: onClick,
    disabled: disabled,
    "aria-pressed": isActive,
    ...dataAttrs
  }, content);
};

/***/ },

/***/ "./src/scripts/ui-kit/Button/block.tsx"
/*!*********************************************!*\
  !*** ./src/scripts/ui-kit/Button/block.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Button */ "./src/scripts/ui-kit/Button/Button.tsx");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./style.scss */ "./src/scripts/ui-kit/Button/style.scss");







const COLOR_SCHEME_OPTIONS = [{
  label: 'Grape',
  value: 'grape'
}, {
  label: 'Raspberry',
  value: 'raspberry'
}, {
  label: 'Strawberry',
  value: 'strawberry'
}, {
  label: 'Custom',
  value: 'custom'
}];
const BORDER_RADIUS_OPTIONS = [{
  label: 'None',
  value: 'none'
}, {
  label: '4px',
  value: '4px'
}, {
  label: '6px',
  value: '6px'
}, {
  label: '8px',
  value: '8px'
}, {
  label: '10px',
  value: '10px'
}, {
  label: '12px',
  value: '12px'
}, {
  label: '16px',
  value: '16px'
}, {
  label: '20px',
  value: '20px'
}, {
  label: '32px',
  value: '32px'
}, {
  label: 'Round',
  value: '50%'
}];
const SIZE_MAP = {
  sm: {
    phone: {
      padding: '8px 12px',
      fontSize: '16px'
    },
    tablet: {
      padding: '8px 12px',
      fontSize: '16px'
    },
    desktop: {
      padding: '8px 12px',
      fontSize: '16px'
    }
  },
  md: {
    phone: {
      padding: '8px 24px',
      fontSize: '24px'
    },
    tablet: {
      padding: '8px 24px',
      fontSize: '24px'
    },
    desktop: {
      padding: '8px 24px',
      fontSize: '24px'
    }
  },
  lg: {
    phone: {
      padding: '6px 18px',
      fontSize: '18px'
    },
    tablet: {
      padding: '8px 24px',
      fontSize: '24px'
    },
    desktop: {
      padding: '12px 36px',
      fontSize: '36px'
    }
  }
};
function getSchemeBackground(colors) {
  const schemes = {
    grape: 'linear-gradient(90deg, #5823EB 0%, #6D00D2 100%)',
    raspberry: 'linear-gradient(90deg, rgb(215, 69, 255) 0%, rgb(245, 47, 162) 100%)',
    strawberry: 'linear-gradient(90deg, #F74098 0%, #F64B30 100%)'
  };
  return schemes[colors] || '';
}
function getSchemeTextColor(colors) {
  const schemes = {
    grape: 'rgb(255, 255, 255)',
    raspberry: 'rgb(255, 255, 255)',
    strawberry: 'rgb(255, 255, 255)'
  };
  return schemes[colors] || '';
}
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('childlab/button', {
  edit: ({
    attributes,
    setAttributes
  }) => {
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
    const isCustom = attributes.colors === 'custom';
    const previewBackground = isCustom ? attributes.customBackground || '#ffffff' : getSchemeBackground(attributes.colors);
    const previewTextColor = isCustom ? attributes.customTextColor || '#5230D0' : getSchemeTextColor(attributes.colors);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Button Settings', 'childlab')
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Text', 'childlab'),
      value: attributes.text,
      onChange: text => setAttributes({
        text
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Link URL', 'childlab'),
      value: attributes.href,
      onChange: href => setAttributes({
        href
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Size', 'childlab'),
      value: attributes.size,
      options: [{
        label: 'Small',
        value: 'sm'
      }, {
        label: 'Medium',
        value: 'md'
      }, {
        label: 'Large',
        value: 'lg'
      }],
      onChange: size => setAttributes({
        size
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Color Scheme', 'childlab'),
      value: attributes.colors,
      options: COLOR_SCHEME_OPTIONS,
      onChange: colors => setAttributes({
        colors
      })
    })), isCustom && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Custom Colors', 'childlab'),
      initialOpen: true
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Background (color or gradient)', 'childlab'),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('e.g. #ff0000 or linear-gradient(90deg, #f00 0%, #00f 100%)', 'childlab'),
      value: attributes.customBackground,
      onChange: customBackground => setAttributes({
        customBackground
      })
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ColorPicker, {
      color: attributes.customTextColor,
      onChange: value => {
        const color = typeof value === 'string' ? value : value.hex;
        setAttributes({
          customTextColor: color
        });
      },
      enableAlpha: true
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Border Radius', 'childlab'),
      initialOpen: false
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TabPanel, {
      tabs: [{
        name: 'desktop',
        title: 'Desktop'
      }, {
        name: 'tablet',
        title: 'Tablet'
      }, {
        name: 'phone',
        title: 'Phone'
      }]
    }, tab => {
      const key = `borderRadius${tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}`;
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Radius', 'childlab'),
        value: attributes[key],
        options: BORDER_RADIUS_OPTIONS,
        onChange: value => setAttributes({
          [key]: value
        })
      });
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "wp-block-childlab-button-preview"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Button__WEBPACK_IMPORTED_MODULE_5__.Button, {
      href: attributes.href || undefined,
      active: {
        background: previewBackground,
        color: previewTextColor
      },
      colors: "custom",
      size: attributes.size,
      borderRadius: {
        desktop: attributes.borderRadiusDesktop,
        tablet: attributes.borderRadiusTablet,
        phone: attributes.borderRadiusPhone
      }
    }, attributes.text || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Button', 'childlab'))));
  },
  save: ({
    attributes
  }) => {
    const isCustom = attributes.colors === 'custom';
    const background = isCustom ? attributes.customBackground : getSchemeBackground(attributes.colors);
    const color = isCustom ? attributes.customTextColor : getSchemeTextColor(attributes.colors);
    const style = {
      ...(SIZE_MAP[attributes.size]?.desktop || SIZE_MAP.md.desktop),
      background: background || '#ffffff',
      color: color || '#5230D0',
      border: '1px solid transparent',
      borderRadius: attributes.borderRadiusDesktop
    };
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      className: "ui-button",
      href: attributes.href || '#',
      style: style
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "ui-button__text"
    }, attributes.text));
  }
});

/***/ },

/***/ "./src/scripts/ui-kit/Button/style.scss"
/*!**********************************************!*\
  !*** ./src/scripts/ui-kit/Button/style.scss ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"scripts/ui-kit/Button/block": 0,
/******/ 			"scripts/ui-kit/Button/style-block": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkbrads_boilerplate_theme"] = globalThis["webpackChunkbrads_boilerplate_theme"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["scripts/ui-kit/Button/style-block"], () => (__webpack_require__("./src/scripts/ui-kit/Button/block.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=block.js.map