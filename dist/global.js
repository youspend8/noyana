'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globalStatus = exports.key = exports.client = exports.request = exports.ytdl = exports.Discord = undefined;

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _ytdlCore = require('ytdl-core');

var _ytdlCore2 = _interopRequireDefault(_ytdlCore);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Discord = _discord2.default;
exports.ytdl = _ytdlCore2.default;
exports.request = _request2.default;
var client = exports.client = new _discord2.default.Client();
var key = exports.key = 'AIzaSyDcmFTT8sWnjj4dFCsZ6LRfBmRzr95QK4Y';

var globalStatus = exports.globalStatus = {
  connection: '',
  searchStatus: false,
  searchResult: [],
  playList: [],
  globalDispatcher: '',
  playingIndex: 0
};