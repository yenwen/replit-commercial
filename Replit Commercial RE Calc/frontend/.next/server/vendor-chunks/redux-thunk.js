"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/redux-thunk";
exports.ids = ["vendor-chunks/redux-thunk"];
exports.modules = {

/***/ "(ssr)/../../node_modules/redux-thunk/dist/redux-thunk.mjs":
/*!***********************************************************!*\
  !*** ../../node_modules/redux-thunk/dist/redux-thunk.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   thunk: () => (/* binding */ thunk),\n/* harmony export */   withExtraArgument: () => (/* binding */ withExtraArgument)\n/* harmony export */ });\n// src/index.ts\nfunction createThunkMiddleware(extraArgument) {\n    const middleware = ({ dispatch, getState })=>(next)=>(action)=>{\n                if (typeof action === \"function\") {\n                    return action(dispatch, getState, extraArgument);\n                }\n                return next(action);\n            };\n    return middleware;\n}\nvar thunk = createThunkMiddleware();\nvar withExtraArgument = createThunkMiddleware;\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL3JlZHV4LXRodW5rL2Rpc3QvcmVkdXgtdGh1bmsubWpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZUFBZTtBQUNmLFNBQVNBLHNCQUFzQkMsYUFBYTtJQUMxQyxNQUFNQyxhQUFhLENBQUMsRUFBRUMsUUFBUSxFQUFFQyxRQUFRLEVBQUUsR0FBSyxDQUFDQyxPQUFTLENBQUNDO2dCQUN4RCxJQUFJLE9BQU9BLFdBQVcsWUFBWTtvQkFDaEMsT0FBT0EsT0FBT0gsVUFBVUMsVUFBVUg7Z0JBQ3BDO2dCQUNBLE9BQU9JLEtBQUtDO1lBQ2Q7SUFDQSxPQUFPSjtBQUNUO0FBQ0EsSUFBSUssUUFBUVA7QUFDWixJQUFJUSxvQkFBb0JSO0FBSXRCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29tbWVyY2lhbC1yZS1jYWxjLWZyb250ZW5kLy4uLy4uL25vZGVfbW9kdWxlcy9yZWR1eC10aHVuay9kaXN0L3JlZHV4LXRodW5rLm1qcz81MDNmIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9pbmRleC50c1xuZnVuY3Rpb24gY3JlYXRlVGh1bmtNaWRkbGV3YXJlKGV4dHJhQXJndW1lbnQpIHtcbiAgY29uc3QgbWlkZGxld2FyZSA9ICh7IGRpc3BhdGNoLCBnZXRTdGF0ZSB9KSA9PiAobmV4dCkgPT4gKGFjdGlvbikgPT4ge1xuICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJldHVybiBhY3Rpb24oZGlzcGF0Y2gsIGdldFN0YXRlLCBleHRyYUFyZ3VtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgfTtcbiAgcmV0dXJuIG1pZGRsZXdhcmU7XG59XG52YXIgdGh1bmsgPSBjcmVhdGVUaHVua01pZGRsZXdhcmUoKTtcbnZhciB3aXRoRXh0cmFBcmd1bWVudCA9IGNyZWF0ZVRodW5rTWlkZGxld2FyZTtcbmV4cG9ydCB7XG4gIHRodW5rLFxuICB3aXRoRXh0cmFBcmd1bWVudFxufTtcbiJdLCJuYW1lcyI6WyJjcmVhdGVUaHVua01pZGRsZXdhcmUiLCJleHRyYUFyZ3VtZW50IiwibWlkZGxld2FyZSIsImRpc3BhdGNoIiwiZ2V0U3RhdGUiLCJuZXh0IiwiYWN0aW9uIiwidGh1bmsiLCJ3aXRoRXh0cmFBcmd1bWVudCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/redux-thunk/dist/redux-thunk.mjs\n");

/***/ })

};
;