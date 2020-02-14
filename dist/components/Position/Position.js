"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _PositionModule = _interopRequireDefault(require("./Position.module.scss"));

var _coordinate = require("ol/coordinate.js");

var _MousePosition = _interopRequireDefault(require("ol/control/MousePosition"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Position = function Position() {
  var _useState = (0, _react.useState)(),
      _useState2 = _slicedToArray(_useState, 2),
      projection = _useState2[0],
      setProjectionString = _useState2[1];

  (0, _react.useEffect)(function () {
    createOlMousePositionControl(window.olMap);
  });
  /**
   * Creates and adds the mouse position control to the map.
   *
   * @param {OlMap} The OpenLayers map
   */

  var createOlMousePositionControl = function createOlMousePositionControl(map) {
    var existingControls = map.getControls();
    var mousePositionControl = existingControls.getArray().find(function (c) {
      return c instanceof _MousePosition.default;
    });
    setProjectionString(map.getView().getProjection().getCode());

    var customFormat = function customFormat(coordinate) {
      return (0, _coordinate.format)(coordinate, '{y}N, {x}Ø');
    };

    if (!mousePositionControl) {
      var options = {
        name: 'ol-mouse-position',
        coordinateFormat: customFormat,
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;',
        projection: projection
      };

      var _mousePositionControl = new _MousePosition.default(options);

      map.addControl(_mousePositionControl);
    }
  };

  return _react.default.createElement("div", {
    className: _PositionModule.default.mouseposition
  }, _react.default.createElement("span", null, projection), _react.default.createElement("div", {
    id: "mouse-position"
  }));
};

var _default = Position;
exports.default = _default;