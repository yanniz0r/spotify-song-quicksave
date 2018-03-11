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

  opentAuthenticationPrompt = () => {
    this.authenticationURL = this.spotifyApi.createAuthorizeURL(['user-read-private', 'user-read-currently-playing', 'playlist-modify-private', 'user-library-modify'])
    shell.openExternal(this.authenticationURL)
  }

  authenticate = (code) => {
    this.spotifyApi.authorizationCodeGrant(code)
    .then((data) => {
      console.log('The token expires in ' + data.body['expires_in'])
      console.log('The access token is ' + data.body['access_token'])
      console.log('The refresh token is ' + data.body['refresh_token'])
      this.spotifyApi.setAccessToken(data.body['access_token'])
      this.spotifyApi.setRefreshToken(data.body['refresh_token'])
    }, (err) => {
      console.log('Something went wrong!', err)
    })
  }

}

export default SpotifyAPIWrapper