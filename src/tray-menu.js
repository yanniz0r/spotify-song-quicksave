import { Tray, MenuItem, nativeImage, Menu } from 'electron'
import path from 'path'

class TrayMenu {

  constructor(spotifyApiWrapper) {
    this.spotifyApiWrapper = spotifyApiWrapper
    this.tray = new Tray(this.getIcon())
    this.contextMenu = Menu.buildFromTemplate([
      this.getAddSongMenuItem(),
      {type: 'separator'},
      {role: 'quit'}
    ])
    this.tray.setToolTip('Spotify Song Quicksave')
    this.tray.setContextMenu(this.contextMenu)
  }

  getAddSongMenuItem = () => {
    return new MenuItem({
      label: 'Add to my songs',
      click: this.spotifyApiWrapper.addCurrentlyPlayingSong
    })
  }

  getIcon = () => {
    const iconPath = path.join(__dirname, 'spotify-logo.png')
    return nativeImage.createFromPath(iconPath).resize({
      width: 14,
      height: 14
    })
  }

}

export default TrayMenu
