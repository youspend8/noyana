// import functions from 'firebase-functions';
// import express from 'express';
const functions = require('firebase-functions');
const express = require('express');
const app = express();
const port = 5000;

import { Discord, ytdl, request, client, key, globalStatus } from './global';
import { search, getList, play, add } from './actions';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  const { content, member, channel } = msg;

  let msgArr = content.split(' ');

  if (content.startsWith('=list')) {
    if (content == '=list') {
      getList(channel);
      return;
    }
    play(channel, globalStatus.playList[msgArr[1]]);
    globalStatus.playingIndex = msgArr[1];
  }

  if (content.startsWith('=search ')) {
    globalStatus.searchStatus = true;

    const keyword = content.substring(8, content.length);
    search(channel, keyword);
  }

  if (content == '=skip') {
    if (globalStatus.globalDispatcher != '' & globalStatus.globalDispatcher.speaking) {
      play(channel, globalStatus.playList[++globalStatus.playingIndex]);
    }
  }

  if (content == '=stop') {
    globalStatus.globalDispatcher.end();
  }

  if (content == '=ss') {
    console.log(globalStatus.globalDispatcher);
  }

  if (globalStatus.searchStatus) {
    if (content.match('[0-9]')) {
      const selectedItem = globalStatus.searchResult[content];

      add(channel, selectedItem, member.nickname);
      
      globalStatus.searchStatus = false;
      globalStatus.searchResult = [];

    } else if (content === 'x') {
      globalStatus.searchStatus = false;
      globalStatus.searchResult = [];
      
      let cancelEmbed = new Discord.RichEmbed()
          .setColor('#0099ff')
          .setTitle('취소됐삼 ㅎㅎ')
          .setAuthor('Noyana By chaehun', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org');

      channel.send(cancelEmbed)
    }
  }
  
  //  Noyana 입장과 퇴장
  switch (content) {
    case '=j':
      if (globalStatus.connection != '') return;
      member.voiceChannel.join().then(conn => {
        globalStatus.connection = conn;
        channel.send('노야나 등장 !!');
      })
      break;
  
    case '=l':
      globalStatus.connection = '';
      globalStatus.searchStatus = false,
      globalStatus.searchResult = [],
      globalStatus.playList = [],
      globalStatus.globalDispatcher = '',
      globalStatus.playingIndex = 0
      
      channel.send('쳐접어라 쓰레기련들아');
      member.voiceChannel.leave();
      break;
  }
});

client.login('NTk5NTU5OTAwNTUyNDk1MTE0.XSm-oQ.eOexvHEqdUePtEvXAoX67oXlDdU');

app.get('/test', (req, res) => {
  res.send("TEST");
});

app.listen(port, () =>  {
  console.log(`Server Listening ${port} port`);
});

exports.app = functions.https.onRequest(app);