import {app, shell, Menu, MenuItem, Tray, nativeImage} from 'electron'
import path from 'path'
import secrets from './secrets'
import SpotifyAPIWrapper from './spotify-api-wrapper'

const spotify = new SpotifyAPIWrapper()
spotify.opentAuthenticationPrompt()

let tray = null

const iconPath = path.join(__dirname, 'spotify-logo.png')
const icon = nativeImage.createFromPath(iconPath).resize({
  width: 14,
  height: 14
})

const addSongMenuItem = new MenuItem({
  label: 'Add to my songs',
  click: function(){
    spotify.spotifyApi.getMyCurrentPlayingTrack()
    .then(function(data){
      const { item } = data.body
      console.log(`Currently playing '${item.name}' (${item.id})`)
      console.log(item.id)
      spotify.spotifyApi.addToMySavedTracks([item.id])
      .then(function(data) {
        console.log('Added track!');
      }, function(err) {
        console.log('Something went wrong!', err);
      });
    })
  }
})

app.on('ready', () => {
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    addSongMenuItem
  ])
  tray.setToolTip('Spotify Song Quicksave')
  tray.setContextMenu(contextMenu)
})
