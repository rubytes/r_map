"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _CapabilitiesUtil = require("../../MapUtil/CapabilitiesUtil");

var _ServicePanelModule = _interopRequireDefault(require("./ServicePanel.module.scss"));

var _icons = require("@material-ui/icons");

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _List = _interopRequireDefault(require("@material-ui/core/List"));

var _LayerEntry = _interopRequireDefault(require("./LayerEntry"));

var _store = require("../../Utils/store.js");

var _FeatureUtil = require("../../MapUtil/FeatureUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var language = navigator.language.split(/[-_]/)[0];

var ServicePanel = function ServicePanel(props) {
  var featureState = (0, _react.useContext)(_store.store);
  var dispatch = featureState.dispatch;

  var _useState = (0, _react.useState)(),
      _useState2 = _slicedToArray(_useState, 2),
      capabilities = _useState2[0],
      setCapabilities = _useState2[1];

  var _useState3 = (0, _react.useState)(),
      _useState4 = _slicedToArray(_useState3, 2),
      meta = _useState4[0],
      setMeta = _useState4[1];

  var _useState5 = (0, _react.useState)(true),
      _useState6 = _slicedToArray(_useState5, 2),
      expanded = _useState6[0],
      setState = _useState6[1];

  (0, _react.useEffect)(function () {
    var newMetaInfo = {};

    switch (props.services.DistributionProtocol) {
      case 'WMS':
      case 'WMS-tjeneste':
      case 'OGC:WMS':
        _CapabilitiesUtil.CapabilitiesUtil.parseWmsCapabilities(props.services.GetCapabilitiesUrl, language).then(function (capa) {
          if (props.services.excludeLayers) {
            capa.Capability.Layer.Layer = capa.Capability.Layer.Layer.filter(function (e) {
              return !props.services.excludeLayers.includes(e.Name);
            });
          }

          setCapabilities(capa);
          newMetaInfo = _CapabilitiesUtil.CapabilitiesUtil.getWMSMetaCapabilities(capa);
          newMetaInfo.Type = 'OGC:WMS';
          newMetaInfo.Params = props.services.customParams || '';

          if (props.services.addLayers.length > 0) {
            var layersToBeAdded = [];
            layersToBeAdded = capa.Capability.Layer.Layer.filter(function (e) {
              return props.services.addLayers.includes(e.Name);
            });

            if (layersToBeAdded.length === 0 || layersToBeAdded.length !== props.services.addLayers.length) {
              layersToBeAdded = [];
              props.services.addLayers.forEach(function (layerName) {
                layersToBeAdded.push({
                  Name: layerName
                });
              });
            }

            layersToBeAdded.forEach(function (layer) {
              var laycapaLayerer = _CapabilitiesUtil.CapabilitiesUtil.getOlLayerFromWmsCapabilities(newMetaInfo, layer);

              newMetaInfo.isVisible = true;
              window.olMap.addLayer(laycapaLayerer);

              if (layer.queryable) {
                window.olMap.on('singleclick', function (evt) {
                  var viewResolution = window.olMap.getView().getResolution();
                  var formats = laycapaLayerer.getProperties().getFeatureInfoFormats;
                  var indexFormat = 0;

                  if (formats.includes('text/plain')) {
                    indexFormat = formats.indexOf('text/plain');
                  } else if (formats.indexOf('text/xml') > 0) {
                    indexFormat = formats.indexOf('text/xml');
                  } else if (formats.indexOf('application/vnd.ogc.gml') > 0) {
                    indexFormat = formats.indexOf('application/vnd.ogc.gml');
                  } else if (formats.indexOf('application/json') > 0) {
                    indexFormat = formats.indexOf('application/json');
                  } else if (formats.indexOf('text/html') === 0) {
                    indexFormat = 1;
                  }

                  var url = laycapaLayerer.getSource().getFeatureInfoUrl(evt.coordinate, viewResolution, window.olMap.getView().getProjection(), {
                    INFO_FORMAT: formats[indexFormat]
                  });

                  if (url.startsWith('http://rin-te')) {
                    url = 'https://norgeskart.no/ws/px.py?' + url;
                  }

                  if (url && laycapaLayerer.getVisible()) {
                    fetch(url).then(function (response) {
                      return response.text();
                    }).then(function (data) {
                      return dispatch({
                        type: 'SET_FEATURES',
                        show: true,
                        info: (0, _FeatureUtil.parseFeatureInfo)(data, formats[indexFormat])
                      });
                    }).catch(function (error) {
                      console.error('Error:', error);
                    });
                  }
                });
              }
            });
          }

          setMeta(newMetaInfo);
        }).catch(function (e) {
          return console.warn(e);
        });

        break;

      case 'OGC:WMTS':
        _CapabilitiesUtil.CapabilitiesUtil.parseWmtsCapabilities(props.services.GetCapabilitiesUrl).then(function (capa) {
          setCapabilities(capa);
          newMetaInfo = _CapabilitiesUtil.CapabilitiesUtil.getWMSMetaCapabilities(capa);
          newMetaInfo.Type = 'OGC:WMTS';
          newMetaInfo.Params = props.services.customParams || '';
          setMeta(newMetaInfo);
        }).catch(function (e) {
          return console.warn(e);
        });

        break;

      case 'WFS':
      case 'WFS-tjeneste':
      case 'OGC:WFS':
        _CapabilitiesUtil.CapabilitiesUtil.parseWFSCapabilities(props.services.GetCapabilitiesUrl, language).then(function (capa) {
          setCapabilities(capa);
          newMetaInfo = _CapabilitiesUtil.CapabilitiesUtil.getWFSMetaCapabilities(capa);
          newMetaInfo.Type = 'WFS';
          newMetaInfo.Params = props.services.customParams || '';
          setMeta(newMetaInfo);
        }).catch(function (e) {
          return console.warn(e);
        });

        break;

      case 'GEOJSON':
        _CapabilitiesUtil.CapabilitiesUtil.getGeoJson(props.services.url).then(function (layers) {
          setCapabilities(layers);
          newMetaInfo.Type = 'GEOJSON';
          newMetaInfo.ShowPropertyName = props.services.ShowPropertyName || 'id';
          newMetaInfo.EPSG = props.services.EPSG || 'EPSG:4326';
          setMeta(newMetaInfo);
        }).catch(function (e) {
          return console.warn(e);
        });

        break;

      default:
        console.warn('No service type specified');
        break;
    }
  }, [props.services.DistributionProtocol, props.services.GetCapabilitiesUrl, props.services.url, props.services.ShowPropertyName, props.services.customParams, props.services.EPSG, props.services.addLayers]);

  var renderRemoveButton = function renderRemoveButton() {
    if (props.removeMapItem) {
      return /*#__PURE__*/_react.default.createElement(_IconButton.default, {
        "aria-label": "close",
        className: _ServicePanelModule.default.removeInline,
        onClick: props.removeMapItem
      }, /*#__PURE__*/_react.default.createElement(_icons.Close, null));
    } else {
      return '';
    }
  };

  var renderCapabilites = function renderCapabilites() {
    if (capabilities && capabilities.Capability) {
      return capabilities.Capability.Layer.Layer.map(function (capaLayer, i) {
        return /*#__PURE__*/_react.default.createElement("div", {
          className: _ServicePanelModule.default.facet,
          key: i
        }, /*#__PURE__*/_react.default.createElement(_LayerEntry.default, {
          layer: capaLayer,
          meta: meta,
          key: i
        }));
      });
    } else if (capabilities && capabilities.value) {
      return capabilities.value.featureTypeList.featureType.map(function (capaLayer, i) {
        return /*#__PURE__*/_react.default.createElement("div", {
          className: _ServicePanelModule.default.facet,
          key: i
        }, /*#__PURE__*/_react.default.createElement(_LayerEntry.default, {
          layer: capaLayer,
          meta: meta,
          key: i
        }));
      });
    } else if (capabilities && capabilities.features) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: _ServicePanelModule.default.facet
      }, /*#__PURE__*/_react.default.createElement(_LayerEntry.default, {
        layer: capabilities,
        meta: meta
      }));
    } else if (capabilities && capabilities.Contents) {
      return capabilities.Contents.Layer.map(function (capaLayer, i) {
        return /*#__PURE__*/_react.default.createElement("div", {
          className: _ServicePanelModule.default.facet,
          key: i
        }, /*#__PURE__*/_react.default.createElement(_LayerEntry.default, {
          layer: capaLayer,
          meta: meta,
          capa: capabilities,
          key: i
        }));
      });
    } else {
      // console.warn(capabilities)
      return '';
    }
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    onClick: function onClick() {
      return setState(!expanded);
    },
    className: _ServicePanelModule.default.expandLayersBtn
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: _ServicePanelModule.default.ellipsisToggle
  }, capabilities ? capabilities.Service ? capabilities.Service.Title : props.services.Title : ''), /*#__PURE__*/_react.default.createElement("label", {
    style: {
      fontStyle: "italic"
    }
  }, capabilities ? capabilities.Service ? capabilities.Service.Abstract : '' : ''), expanded ? /*#__PURE__*/_react.default.createElement(_icons.ExpandLess, null) : /*#__PURE__*/_react.default.createElement(_icons.ExpandMore, null)), renderRemoveButton(), /*#__PURE__*/_react.default.createElement(_List.default, {
    className: expanded ? "".concat(_ServicePanelModule.default.selectedlayers, " ").concat(_ServicePanelModule.default.open) : _ServicePanelModule.default.selectedlayers
  }, renderCapabilites()));
};

ServicePanel.propTypes = {
  /**
   * The services to be parsed and shown in the panel
   * @type {Object} -- required
   */
  services: _propTypes.default.object.isRequired,
  removeMapItem: _propTypes.default.object
};
var _default = ServicePanel;
exports.default = _default;