
import Discord from 'discord.js';
import ytdl from 'ytdl-core';
import request from 'request';

export { Discord, ytdl, request };
export const client = new Discord.Client();
export const key = 'AIzaSyDcmFTT8sWnjj4dFCsZ6LRfBmRzr95QK4Y';

export let globalStatus = {
  connection: '',
  searchStatus: false,
  searchResult: [],
  playList: [],
  globalDispatcher: '',
  playingIndex: 0
} 
