"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CapabilitiesUtil = exports.newMaplibLayer = void 0;

var _WMSCapabilities = _interopRequireDefault(require("ol/format/WMSCapabilities"));

var _WMTSCapabilities = _interopRequireDefault(require("ol/format/WMTSCapabilities.js"));

var _ImageWMS = _interopRequireDefault(require("ol/source/ImageWMS"));

var _Image = _interopRequireDefault(require("ol/layer/Image"));

var _format = require("ol/format");

var _GML = _interopRequireDefault(require("ol/format/GML2"));

var _GML2 = _interopRequireDefault(require("ol/format/GML32"));

var _GeoJSON = _interopRequireDefault(require("ol/format/GeoJSON.js"));

var _layer = require("ol/layer.js");

var _source = require("ol/source.js");

var _loadingstrategy = require("ol/loadingstrategy.js");

var _style = require("ol/style");

var _Domain = require("./Domain");

var _pinMdOrange = _interopRequireDefault(require("../assets/img/pin-md-orange.png"));

var _get = _interopRequireDefault(require("lodash/get.js"));

var _maplibHelper = require("./maplibHelper");

var _MapHelper = require("../Utils/MapHelper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var newMaplibLayer = function newMaplibLayer(sourceType, source) {
  var catIds = [999];

  if (source.groupid !== undefined) {
    catIds = source.groupid.toString().split(',').map(function (item) {
      return parseInt(item, 10);
    });
    (0, _maplibHelper.createNotExistGroup)(catIds, source.name, source.namelng);
  } else {
    if (source.options.isbaselayer === 'false') {
      (0, _maplibHelper.createDummyGroup)();
    }
  }

  var newIsyLayer = new _Domain.Layer({
    subLayers: [{
      title: source.name,
      name: source.params.layers || source.name,
      providerName: source.params.layers || source.name,
      source: sourceType,
      gatekeeper: source.gatekeeper === 'true',
      url: (0, _maplibHelper.getWmsUrl)(source.url),
      format: source.params.format,
      featureNS: source.featureNS || '',
      featureType: source.featureType || '',
      coordinate_system: source.epsg || _maplibHelper.mapConfig.coordinate_system,
      extent: _maplibHelper.mapConfig.extent,
      extentUnits: _maplibHelper.mapConfig.extentUnits,
      matrixPrefix: source.matrixprefix === 'true',
      matrixSet: source.matrixset,
      numZoomLevels: _maplibHelper.mapConfig.numZoomLevels,
      id: sourceType === 'VECTOR' ? source.name + 8001 : source.name + 1001,
      version: source.version,
      transparent: true,
      layerIndex: -1,
      legendGraphicUrl: source.legendurl || '',
      minScale: source.options.minscale,
      maxScale: source.options.maxscale,
      sortingIndex: -1,
      featureInfo: {
        supportsGetFeatureInfo: source.options.queryable,
        getFeatureInfoFormat: 'application/vnd.ogc.gml',
        getFeatureInfoCrs: '',
        supportsGetFeature: true,
        getFeatureBaseUrl: '',
        getFeatureFormat: 'application/json',
        getFeatureCrs: 'EPSG:4326',
        includedFields: source.includedfields
      },
      tiled: source.options.singletile !== 'true',
      crossOrigin: 'anonymous',
      style: source.style,
      wmtsExtent: source.wmtsextent,
      getCapabilities: source.getcapabilities === 'true',
      styles: source.params.styles,
      minResolution: source.minresolution,
      maxResolution: source.maxresolution || 21664
    }],
    guid: source.guid,
    name: source.name,
    groupId: catIds,
    visibleOnLoad: source.options.visibility === 'true',
    id: sourceType === 'VECTOR' ? source.name + 8001 : source.name + 1001,
    isBaseLayer: source.options.isbaselayer === 'true',
    previewActive: false,
    opacity: 1,
    mapLayerIndex: -1,
    legendGraphicUrls: [],
    selectedLayerOpen: false,
    thumbnail: source.thumbnail,
    abstract: source.abstract,
    label: source.name,
    value: source.name
  });
  return newIsyLayer;
};
/**
 * Helper class to parse capabilities of WMS layers
 *
 * @class CapabilitiesUtil
 */


exports.newMaplibLayer = newMaplibLayer;

var CapabilitiesUtil = /*#__PURE__*/function () {
  function CapabilitiesUtil() {
    _classCallCheck(this, CapabilitiesUtil);
  }

  _createClass(CapabilitiesUtil, null, [{
    key: "parseWmsCapabilities",
    value:
    /**
     * Parses the given WMS Capabilities string.
     *
     * @param {string} capabilitiesUrl Url to WMS capabilities document
     * @return {Object} An object representing the WMS capabilities.
     */
    function parseWmsCapabilities(capabilitiesUrl) {
      var newUrl = (0, _MapHelper.mergeDefaultParams)(capabilitiesUrl, {
        service: "WMS",
        request: "GetCapabilities"
      });
      return fetch(newUrl).then(function (response) {
        return response.text();
      }).then(function (data) {
        var wmsCapabilitiesParser = new _WMSCapabilities.default();
        return wmsCapabilitiesParser.read(data);
      });
    }
    /**
     * Returns the layers from a parsed WMS GetCapabilities object.
     *
     * @param {Object} capabilities A capabilities object.
     * @param {string} nameField Configure the field which should be set as the
     *                           'name' property in the openlayers layer.
     * @return {OlLayerTile[]} Array of OlLayerTile
     */

  }, {
    key: "getLayersFromWmsCapabilties",
    value: function getLayersFromWmsCapabilties(capabilities) {
      var nameField = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Name';
      var wmsVersion = (0, _get.default)(capabilities, 'version');
      var layersInCapabilities = (0, _get.default)(capabilities, 'Capability.Layer.Layer');
      var wmsGetMapConfig = (0, _get.default)(capabilities, 'Capability.Request.GetMap');
      var getMapUrl = (0, _get.default)(wmsGetMapConfig, 'DCPType[0].HTTP.Get.OnlineResource');
      return layersInCapabilities.map(function (layerObj) {
        return newMaplibLayer('WMS', {
          type: 'map',
          name: (0, _get.default)(layerObj, nameField) || (0, _get.default)(layerObj, 'Title'),
          abstract: (0, _get.default)(layerObj, 'Abstract'),
          url: getMapUrl,
          legendurl: (0, _get.default)(layerObj, 'Style[0].LegendURL[0].OnlineResource'),
          params: {
            layers: (0, _get.default)(layerObj, 'Name'),
            format: 'image/png',
            'VERSION': wmsVersion
          },
          guid: '1.temakart',
          options: {
            isbaselayer: 'false',
            singletile: 'false',
            visibility: 'true',
            maxscale: layerObj.MaxScaleDenominator || '',
            minscale: layerObj.MinScaleDenominator || '',
            queryable: layerObj.queryable
          }
        });
      });
    }
    /**
     * Parses the given WMTS Capabilities string.
     *
     * @param {string} capabilitiesUrl Url to WMTS capabilities document
     * @return {Object} An object representing the WMTS capabilities.
     */

  }, {
    key: "parseWmtsCapabilities",
    value: function parseWmtsCapabilities(capabilitiesUrl) {
      var newUrl = (0, _MapHelper.mergeDefaultParams)(capabilitiesUrl, {
        service: "WMTS",
        request: "GetCapabilities"
      });
      return fetch(newUrl).then(function (response) {
        return response.text();
      }).then(function (data) {
        var wmtsCapabilitiesParser = new _WMTSCapabilities.default();
        return wmtsCapabilitiesParser.read(data);
      });
    }
  }, {
    key: "getLayersFromWfsCapabilties",
    value: function getLayersFromWfsCapabilties(capabilities) {
      var nameField = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'name.localPart';
      var version = '1.1.0'; //get(capabilities, 'value.version');

      var featureTypesInCapabilities = (0, _get.default)(capabilities, 'value.featureTypeList.featureType');
      var url = (0, _get.default)(capabilities, 'value.operationsMetadata.operation[0].dcp[0].http.getOrPost[0].value.href');
      var featureNS = {};
      return featureTypesInCapabilities.map(function (layerObj) {
        featureNS[layerObj.name.prefix] = layerObj.name.namespaceURI;
        return newMaplibLayer('WFS', {
          type: 'map',
          name: (0, _get.default)(layerObj, nameField),
          url: url,
          version: version,
          params: {
            layers: (0, _get.default)(layerObj, nameField),
            format: 'image/png'
          },
          guid: '1.temakart',
          options: {
            isbaselayer: 'false',
            singletile: 'false',
            visibility: 'true',
            maxscale: layerObj.MaxScaleDenominator || '',
            minscale: layerObj.MinScaleDenominator || ''
          },
          featureNS: featureNS,
          featureType: layerObj.name.prefix + ':' + layerObj.name.localPart
        });
      });
    }
  }, {
    key: "getOlLayerFromWFS",
    value: function getOlLayerFromWFS(metaCapabilities, capabilities) {
      var nameField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'name.localPart';
      var version = '1.1.0'; //get(metaCapabilities, 'Version')

      var url = (0, _get.default)(metaCapabilities, 'MapUrl');
      var projection = window.olMap.getView().getProjection();

      var parseResponse = function parseResponse(response) {
        response = new DOMParser().parseFromString(response, "text/xml");

        if (typeof vectorSource.format === 'undefined') {
          var gmlFormat;

          switch (version) {
            case '1.0.0':
              gmlFormat = new _GML.default();
              break;

            case '1.1.0':
              gmlFormat = new _GML2.default();
              break;

            case '2.0.0':
              gmlFormat = new _GML2.default();
              break;

            default:
              gmlFormat = new _format.GML();
              break;
          }

          var featureNS = ''; // capabilities.featureNS || response.firstChild.namespaceURI || 'http://www.opengis.net/gml/3.2'

          vectorSource.format = new _format.WFS({
            featureNS: featureNS,
            featureTypes: [capabilities.name.prefix + ':' + capabilities.name.localPart],
            gmlFormat: gmlFormat
          });
        }

        var features = vectorSource.format.readFeatures(response);

        if (features && features.length > 0) {
          features.forEach(function (featureitem) {
            console.log(featureitem);
          });
          vectorSource.addFeatures(features);
          console.log(features[0].getGeometryName());
        }

        return features;
      };

      var loader = function loader(extent) {
        url = (0, _MapHelper.mergeDefaultParams)(url, {
          service: "WFS",
          request: "GetFeature",
          version: version,
          typename: capabilities.Name,
          srsname: projection.getCode(),
          bbox: extent.join(',') + ',' + projection.getCode(),
          outputFormat: 'text/xml; subtype=gml/3.2.1'
        });
        return fetch(url).then(function (response) {
          return response.text();
        }).then(function (response) {
          if (_typeof(response) === 'object') {
            if (response.firstChild.childElementCount === 0) {
              return;
            }
          } else {
            return parseResponse(response);
          }
        });
      };

      var vectorSource = new _source.Vector({
        loader: loader,
        strategy: _loadingstrategy.bbox,
        projection: projection
      });
      window.olMap.on('click', function (event) {
        var features = window.olMap.getFeaturesAtPixel(event.pixel);

        if (!features) {
          return;
        }

        var feature = features[0];
        console.log(feature.getProperties());
      });
      return new _layer.Vector({
        source: vectorSource
      });
    }
  }, {
    key: "parseWFSCapabilities",
    value: function parseWFSCapabilities(capabilitiesUrl) {
      var newUrl = (0, _MapHelper.mergeDefaultParams)(capabilitiesUrl, {
        service: "WFS",
        request: "GetCapabilities"
      });
      return fetch(newUrl).then(function (response) {
        return response.text();
      }).then(function (data) {
        var parser = new DOMParser();
        return parser.parseFromString(data, 'text/xml');
      });
    }
  }, {
    key: "getGeoJson",
    value: function getGeoJson(url) {
      return fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        data.Name = data.name;
        return data;
      });
    }
  }, {
    key: "getOlLayerFromGeoJson",
    value: function getOlLayerFromGeoJson(meta, layerCapabilities) {
      var vectorSource = new _source.Vector({
        features: new _GeoJSON.default().readFeatures(layerCapabilities, {
          dataProjection: meta.EPSG,
          featureProjection: 'EPSG:25833'
        })
      });
      return new _layer.Vector({
        source: vectorSource,
        style: function style(feature, resolution) {
          var geom_name = feature.getGeometry().getType();

          if (geom_name === 'Point') {
            return new _style.Style({
              image: new _style.Icon({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: _pinMdOrange.default
              }),
              text: new _style.Text({
                font: '12px Calibri,sans-serif',
                fill: new _style.Fill({
                  color: '#000'
                }),
                stroke: new _style.Stroke({
                  color: '#fff',
                  width: 3
                }),
                text: feature.get(meta.ShowPropertyName)
              })
            });
          } else {
            return new _style.Style({
              fill: new _style.Fill({
                color: 'rgba(255, 255, 255, 0.6)'
              }),
              stroke: new _style.Stroke({
                color: '#319FD3',
                width: 2
              }),
              text: new _style.Text({
                font: '12px Calibri,sans-serif',
                fill: new _style.Fill({
                  color: '#000'
                }),
                stroke: new _style.Stroke({
                  color: '#fff',
                  width: 3
                }),
                text: feature.get(meta.ShowPropertyName)
              })
            });
          }
        },
        name: layerCapabilities.name
      });
    }
  }, {
    key: "getWMSMetaCapabilities",
    value: function getWMSMetaCapabilities(capabilities) {
      var Meta = {};
      var wmsGetMapConfig = (0, _get.default)(capabilities, 'Capability.Request.GetMap');
      Meta.Version = (0, _get.default)(capabilities, 'version');
      Meta.Attributions = (0, _get.default)(capabilities, 'Service.AccessConstraints');
      Meta.MapUrl = (0, _get.default)(wmsGetMapConfig, 'DCPType[0].HTTP.Get.OnlineResource');
      Meta.FeatureInfoConfig = (0, _get.default)(capabilities, 'Capability.Request.GetFeatureInfo');
      Meta.FeatureInfoUrl = (0, _get.default)(Meta.FeatureInfoConfig, 'DCPType[0].HTTP.Get.OnlineResource');
      Meta.LegendUrl = (0, _get.default)(capabilities, 'Capability.Layer.Layer') ? (0, _get.default)(capabilities, 'Capability.Layer.Layer').length > 0 ? (0, _get.default)((0, _get.default)(capabilities, 'Capability.Layer.Layer')[0], 'Style[0].LegendURL[0].OnlineResource') : null : null;
      return Meta;
    }
  }, {
    key: "getWFSMetaCapabilities",
    value: function getWFSMetaCapabilities(capabilities) {
      var Meta = {};
      Meta.Version = (0, _get.default)(capabilities, 'value.version');
      Meta.Attributions = (0, _get.default)(capabilities, 'Service.AccessConstraints');
      Meta.MapUrl = (0, _get.default)(capabilities, 'value.operationsMetadata.operation[0].dcp[0].http.getOrPost[0].value.href');
      return Meta;
    }
    /**
       * Returns an OpenlLayers Layer ready to be added to the map
       *
       * @param {Object} metaCapabilities The generell top capabilities object.
       * @param {Object} layerCapabilities A layer spesific capabilities object.
       * @return {OlLayerTile[]} Array of OlLayerTile
       */

  }, {
    key: "getOlLayerFromWmsCapabilities",
    value: function getOlLayerFromWmsCapabilities(metaCapabilities, layerCapabilities) {
      var params = metaCapabilities.Params || {};
      params['LAYERS'] = layerCapabilities.Name;
      params['VERSION'] = metaCapabilities.Version;
      return new _Image.default({
        opacity: 1,
        title: layerCapabilities.Title,
        name: layerCapabilities.Name,
        abstract: layerCapabilities.Abstract,
        getFeatureInfoUrl: metaCapabilities.FeatureInfoUrl,
        getFeatureInfoFormats: (0, _get.default)(metaCapabilities.FeatureInfoConfig, 'Format'),
        legendUrl: metaCapabilities.LegendUrl,
        queryable: layerCapabilities.queryable,
        source: new _ImageWMS.default({
          url: metaCapabilities.MapUrl,
          attributions: metaCapabilities.Attribution,
          params: params
        })
      });
    }
  }]);

  return CapabilitiesUtil;
}();

exports.CapabilitiesUtil = CapabilitiesUtil;
var _default = CapabilitiesUtil;
exports.default = _default;