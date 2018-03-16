import { app } from 'electron'
import SpotifyAPIWrapper from './spotify-api-wrapper'
import TrayMenu from './tray-menu'

app.on('ready', () => {
  app.dock.hide()
  const spotify = new SpotifyAPIWrapper()
  spotify.openAuthenticationPrompt()
  spotify.authenticationCallback = () => {
    const trayMenu = new TrayMenu(spotify)
  }
})
