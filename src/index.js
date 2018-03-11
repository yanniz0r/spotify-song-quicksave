import { app } from 'electron'
import SpotifyAPIWrapper from './spotify-api-wrapper'
import TrayMenu from './tray-menu'

const spotify = new SpotifyAPIWrapper()
spotify.opentAuthenticationPrompt()

app.on('ready', () => {
  app.dock.hide()
  const trayMenu = new TrayMenu(spotify)
})
