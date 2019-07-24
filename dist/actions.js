'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.play = exports.add = exports.getList = exports.search = undefined;

var _global = require('./global');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var search = function search(channel, keyword) {
  _global.request.get('https://www.googleapis.com/youtube/v3/search?type=video&key=' + _global.key + '&part=snippet&q=' + encodeURIComponent(keyword) + '&maxResults=10', function (err, res, body) {
    var results = JSON.parse(body).items;
    _global.globalStatus.searchResult = results;

    var itemList = basicEmbed('#0099ff', '선택 ㄱㄱ');

    results.map(function (item, index) {
      itemList.addField(index + '. ' + item.snippet.title, '업로드 날짜 : ' + item.snippet.publishedAt.replace('T', '　　').replace('.000Z', ''));
    });
    itemList.addField('x. 취소', '취소하세용');

    channel.send(itemList);
  });
};

var getList = function getList(channel) {
  var itemEmbed = basicEmbed('#fc0303', '등록된 음악 리스트');
  _global.globalStatus.playList.map(function (item, index) {
    itemEmbed.addField(index + '. ' + item.snippet.title, '추가한 놈 : ' + item.addUser);
  });
  channel.send(itemEmbed);
};

var add = function add(channel, selectedItem, nickname) {
  console.log(selectedItem);
  _global.globalStatus.playList.push(Object.assign({}, selectedItem, { addUser: nickname }));
  if (_global.globalStatus.globalDispatcher == '' || !_global.globalStatus.globalDispatcher.speaking) {
    play(channel, selectedItem);
  } else {
    var selectedEmbed = new _global.Discord.RichEmbed().setColor('#0099ff').setTitle(selectedItem.snippet.title).setURL('https://youtu.be/' + selectedItem.id.videoId).setAuthor('노래 등록됨 ㅎㅎ', 'https://i.imgur.com/wSTFkRM.png');
    channel.send(selectedEmbed);
    getList(channel);
  }
};

var play = function play(channel, selectedItem) {
  if (_global.globalStatus.globalDispatcher != '') _global.globalStatus.globalDispatcher.end('user');
  var streamOptions = { seek: 0, volume: 1 };
  var stream = (0, _global.ytdl)('https://youtu.be/' + selectedItem.id.videoId, { filter: 'audioonly' });
  _global.globalStatus.globalDispatcher = _global.globalStatus.connection.playStream(stream, streamOptions);
  setTimeout(function () {
    _global.globalStatus.globalDispatcher.on('end', function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(reason) {
        var nextItem;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(_global.globalStatus.playingIndex + 1 == _global.globalStatus.playList.length)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return');

              case 2:
                nextItem = _global.globalStatus.playList[++_global.globalStatus.playingIndex];

                if (nextItem != null) {
                  play(channel, nextItem);
                }

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }, 500);

  var selectedEmbed = new _global.Discord.RichEmbed().setColor('#0099ff').setTitle(selectedItem.snippet.title).setURL('https://youtu.be/' + selectedItem.id.videoId).setAuthor('노래 스타뜨 !!', 'https://i.imgur.com/wSTFkRM.png').setDescription(selectedItem.snippet.description).setThumbnail(selectedItem.snippet.thumbnails.default.url);

  channel.send(selectedEmbed);
};

var basicEmbed = function basicEmbed(color, title) {
  var richEmbed = new _global.Discord.RichEmbed().setColor(color).setTitle(title).setAuthor('Noyana By chaehun', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org');

  return richEmbed;
};

exports.search = search;
exports.getList = getList;
exports.add = add;
exports.play = play;