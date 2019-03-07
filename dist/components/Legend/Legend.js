"use strict";

var _interopRequireDefault = require("C:\\code_git\\r_map.github\\node_modules\\@babel\\runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var Legend = function Legend(props) {
  return _react.default.createElement("img", {
    src: props.legendUrl,
    alt: props.legendAlternative
  });
};

var _default = Legend;
exports.default = _default;