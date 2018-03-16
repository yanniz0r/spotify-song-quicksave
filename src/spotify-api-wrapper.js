import AuthenticationServer from './authentication-server'
import SpotifyApi from 'spotify-web-api-node'
import secrets from './secrets'
import { shell } from 'electron'

class SpotifyAPIWrapper {

  constructor(){
    this.authenticationServer = new AuthenticationServer()
    this.spotifyApi = new SpotifyApi({
      redirectUri : this.authenticationServer.getRedirectUri(),
      clientId : secrets.clientId,
      clientSecret: secrets.clientSecret
    })
    this.authenticationServer.setAuthenticationCallback(this.authenticate)
  }

  openAuthenticationPrompt = () => {
    this.authenticationURL = this.spotifyApi.createAuthorizeURL(['playlist-modify-private', 'playlist-modify-public', 'playlist-read-collaborative', 'user-read-private', 'user-read-currently-playing', 'playlist-modify-private', 'user-library-modify'])
    shell.openExternal(this.authenticationURL)
  }

  authenticationCallback = () => {

  }

  addCurrentTrackToPlaylist = (playlistId) => {
    this.spotifyApi.getMyCurrentPlayingTrack()
    .then((data) => {
      const { item } = data.body
      console.log(this.user.id, playlistId, item.id)
      this.spotifyApi.addTracksToPlaylist(this.user.id, playlistId, ["spotify:track:" + item.id])
    })
  }

  authenticate = (code) => {
    this.spotifyApi.authorizationCodeGrant(code)
    .then((data) => {
      console.log('The token expires in ' + data.body['expires_in'])
      console.log('The access token is ' + data.body['access_token'])
      console.log('The refresh token is ' + data.body['refresh_token'])
      this.spotifyApi.setAccessToken(data.body['access_token'])
      this.spotifyApi.setRefreshToken(data.body['refresh_token'])
      this.spotifyApi.getMe()
      .then(response => {
        this.user = response.body
        this.authenticationCallback()
      })
    }, (err) => {
      console.log('Something went wrong!', err)
    })
  }

  addCurrentlyPlayingSong = () => {
    return this.spotifyApi.getMyCurrentPlayingTrack()
    .then((data) => {
      const { item } = data.body
      console.log(`Currently playing '${item.name}' (${item.id})`)
      this.spotifyApi.addToMySavedTracks([item.id])
      .then((data) => {
        console.log('Added track!')
      }, (err) => {
        console.log('Something went wrong!', err)
      })
    })
  }

}

export default SpotifyAPIWrapper
