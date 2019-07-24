'use strict';

var _global = require('./global');

var _actions = require('./actions');

// import functions from 'firebase-functions';
// import express from 'express';
var functions = require('firebase-functions');
var express = require('express');
var app = express();
var port = 5000;

_global.client.on('ready', function () {
  console.log('Logged in as ' + _global.client.user.tag + '!');
});

_global.client.on('message', function (msg) {
  var content = msg.content,
      member = msg.member,
      channel = msg.channel;


  var msgArr = content.split(' ');

  if (content.startsWith('=list')) {
    if (content == '=list') {
      (0, _actions.getList)(channel);
      return;
    }
    (0, _actions.play)(channel, _global.globalStatus.playList[msgArr[1]]);
    _global.globalStatus.playingIndex = msgArr[1];
  }

  if (content.startsWith('=search ')) {
    _global.globalStatus.searchStatus = true;

    var keyword = content.substring(8, content.length);
    (0, _actions.search)(channel, keyword);
  }

  if (content == '=skip') {
    if (_global.globalStatus.globalDispatcher != '' & _global.globalStatus.globalDispatcher.speaking) {
      (0, _actions.play)(channel, _global.globalStatus.playList[++_global.globalStatus.playingIndex]);
    }
  }

  if (content == '=stop') {
    _global.globalStatus.globalDispatcher.end();
  }

  if (content == '=ss') {
    console.log(_global.globalStatus.globalDispatcher);
  }

  if (_global.globalStatus.searchStatus) {
    if (content.match('[0-9]')) {
      var selectedItem = _global.globalStatus.searchResult[content];

      (0, _actions.add)(channel, selectedItem, member.nickname);

      _global.globalStatus.searchStatus = false;
      _global.globalStatus.searchResult = [];
    } else if (content === 'x') {
      _global.globalStatus.searchStatus = false;
      _global.globalStatus.searchResult = [];

      var cancelEmbed = new _global.Discord.RichEmbed().setColor('#0099ff').setTitle('취소됐삼 ㅎㅎ').setAuthor('Noyana By chaehun', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org');

      channel.send(cancelEmbed);
    }
  }

  //  Noyana 입장과 퇴장
  switch (content) {
    case '=j':
      if (_global.globalStatus.connection != '') return;
      member.voiceChannel.join().then(function (conn) {
        _global.globalStatus.connection = conn;
        channel.send('노야나 등장 !!');
      });
      break;

    case '=l':
      _global.globalStatus.connection = '';
      _global.globalStatus.searchStatus = false, _global.globalStatus.searchResult = [], _global.globalStatus.playList = [], _global.globalStatus.globalDispatcher = '', _global.globalStatus.playingIndex = 0;

      channel.send('쳐접어라 쓰레기련들아');
      member.voiceChannel.leave();
      break;
  }
});

_global.client.login('NTk5NTU5OTAwNTUyNDk1MTE0.XSm-oQ.eOexvHEqdUePtEvXAoX67oXlDdU');

app.get('/test', function (req, res) {
  res.send("TEST");
});

app.listen(port, function () {
  console.log('Server Listening ' + port + ' port');
});

exports.app = functions.https.onRequest(app);