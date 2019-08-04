
import { Discord, ytdl, request, client, key, userCollection, globalStatus } from './global';

const search = async (channel, keyword) => {
  await request.get(`https://www.googleapis.com/youtube/v3/search?type=video&key=${key}&part=snippet&q=${encodeURI(keyword)}&maxResults=10`, (err, res, body) => {
    
    const results = JSON.parse(body).items;
    globalStatus.searchResult = results;
    
    let itemList = basicEmbed('#0099ff', '선택 ㄱㄱ');

    results.map((item, index) => {
      itemList.addField(index + '. ' + item.snippet.title, '업로드 날짜 : ' + item.snippet.publishedAt.replace('T', '　　',).replace('.000Z', ''));
    });
    itemList.addField('x. 취소', '취소하세용');

    channel.send(itemList);
  });
}

const getList = async channel => {
  let itemEmbed = basicEmbed('#fc0303', '등록된 음악 리스트');
  await globalStatus.playList.map((item, index) => {
    itemEmbed.addField(index + '. ' + item.snippet.title, '추가한 놈 : ' + item.addUser);
  });
  await channel.send(itemEmbed);
}

const add = async (channel, selectedItem, nickname) => {
  const today = new Date();
  await globalStatus.playList.push(Object.assign({}, selectedItem, { addUser: nickname }));
  if (globalStatus.globalDispatcher == '' || !globalStatus.globalDispatcher.speaking) {
    play(channel, selectedItem);

  } else {
    const selectedEmbed = new Discord.RichEmbed()
      .setColor('#0099ff')
      .setTitle(selectedItem.snippet.title)
      .setURL('https://youtu.be/' + selectedItem.id.videoId)
      .setAuthor('노래 등록됨 ㅎㅎ', 'https://i.imgur.com/wSTFkRM.png');
    channel.send(selectedEmbed);
    getList(channel);
  }
  userCollection.insertOne({
    nickname: nickname,
    addDate: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
    item: selectedItem
  }, (err, res) => {});
}

const play = async (channel, selectedItem) => {
  if (globalStatus.globalDispatcher != '') 
    globalStatus.globalDispatcher.end();
  const streamOptions = { seek: 0, volume: 1 };
  const stream = await ytdl('https://youtu.be/' + selectedItem.id.videoId, { filter : 'audioonly' });
  globalStatus.globalDispatcher = await globalStatus.connection.playStream(stream, streamOptions);
  globalStatus.globalDispatcher.setVolume(1.0);
  setTimeout(() => {
    globalStatus.globalDispatcher.on('end', async (reason) => {
      let nextItem = globalStatus.playList[globalStatus.playingIndex + 1];
      globalStatus.playingIndex++;
      if (nextItem != null) {
        play(channel, nextItem);
      }
    });
  }, 2000);

  const selectedEmbed = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle(selectedItem.snippet.title)
    .setURL('https://youtu.be/' + selectedItem.id.videoId)
    .setAuthor('노래 스타뜨 !!', 'https://i.imgur.com/wSTFkRM.png')
    .setDescription(selectedItem.snippet.description)
    .setThumbnail(selectedItem.snippet.thumbnails.default.url)

  await channel.send(selectedEmbed);
}

const basicEmbed = (color, title) => {
  const richEmbed = new Discord.RichEmbed()
    .setColor(color)
    .setTitle(title)
    .setAuthor('Noyana By chaehun', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org');

  return richEmbed;
}

export { search, getList, add, play };