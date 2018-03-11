import {app, shell, Menu, MenuItem, Tray, nativeImage} from 'electron'
import path from 'path'
import secrets from './secrets'
import AuthenticationServer from './authentication-server'
import SpotifyWebApi from 'spotify-web-api-node'

const authenticationServer = new AuthenticationServer()

const spotify = new SpotifyWebApi({
  redirectUri : authenticationServer.getRedirectUri(),
  clientId : secrets.clientId,
  clientSecret: secrets.clientSecret
})

const authorizeURL = spotify.createAuthorizeURL(['user-read-private', 'user-read-currently-playing', 'playlist-modify-private', 'user-library-modify'])
shell.openExternal(authorizeURL);

authenticationServer.setAuthenticationCallback((code) => {
  console.log(code)
  spotify.authorizationCodeGrant(code)
  .then(function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotify.setAccessToken(data.body['access_token']);
    spotify.setRefreshToken(data.body['refresh_token']);
  }, function(err) {
    console.log('Something went wrong!', err);
  })
})

let tray = null

const iconPath = path.join(__dirname, 'spotify-logo.png')
const icon = nativeImage.createFromPath(iconPath).resize({
  width: 14,
  height: 14
})

const addSongMenuItem = new MenuItem({
  label: 'Add to my songs',
  click: function(){
    spotify.getMyCurrentPlayingTrack()
    .then(function(data){
      const { item } = data.body
      console.log(`Currently playing '${item.name}' (${item.id})`)
      console.log(item.id)
      spotify.addToMySavedTracks([item.id])
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
