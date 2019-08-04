
import { Discord, ytdl, request, client, key, globalStatus, userCollection } from './global';
import { search, getList, play, add } from './actions';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  const { content, member, channel } = msg;

  console.log(member.user.id)
  let msgArr = content.split(' ');

  if (content == '=playlist') {
    globalStatus.playList = [];
    userCollection.countDocuments({nickname: member.nickname})
      .then(count => channel.send(`${count}개의 개인 플레이리스트 전체 등록됨`));
    userCollection.find({nickname: member.nickname}).toArray((err, result) => {
      let temp = [];
      result.map((song, index) => {
        song.item.addUser = member.nickname;
        temp.push(song.item);
      });
      globalStatus.playList = temp;
    });
  }

  if (content.startsWith('=list')) {
    if (content == '=list') {
      getList(channel);
      return;
    }

    globalStatus.playingIndex = msgArr[1];
    play(channel, globalStatus.playList[globalStatus.playingIndex]);
  }

  if (content.startsWith('=search ')) {
    if (globalStatus.connection == '') {
      member.voiceChannel.join().then(conn => {
        globalStatus.connection = conn;
        channel.send('노야나 등장 !!');
      })
    }
    globalStatus.searchStatus = true;
    const keyword = content.substring(8, content.length);
    
    search(channel, keyword.toString());
  }

  if (content.startsWith('=v ')) {
    if (msgArr[1] > 0 && msgArr[1] <= 100) {
      globalStatus.globalDispatcher.setVolume(msgArr[1] / 100);
    }
  }

  if (content == '=skip') {
    if (globalStatus.globalDispatcher != '' & globalStatus.globalDispatcher.speaking) {
      if (globalStatus.playingIndex + 1 == globalStatus.playList.length) {
        globalStatus.globalDispatcher.end();
      } else {
        play(channel, globalStatus.playList[++globalStatus.playingIndex]);
      }
    }
  }

  if (content == '=stop') {
    globalStatus.globalDispatcher.end('user');
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

      channel.send(cancelEmbed);
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
      
      channel.send('ㅂㅂ 친구들 !!');
      member.voiceChannel.leave();
      break;
  }
});

client.login('NTk5NTU5OTAwNTUyNDk1MTE0.XTmmEQ.--VkWgFBRdSpfWN_-6k0H7age4I');