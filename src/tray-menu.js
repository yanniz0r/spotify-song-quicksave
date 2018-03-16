import { Tray, MenuItem, nativeImage, Menu } from 'electron'
import path from 'path'

class TrayMenu {

  playlistsLoading = false
  playlists = []
  selectedPlaylist = null

  constructor(spotifyApiWrapper) {
    this.spotifyApiWrapper = spotifyApiWrapper
    this.tray = new Tray(this.getIcon())
    this.tray.setToolTip('Spotify Song Quicksave')
    this.buildMenu()
    this.loadPlaylists()
  }

  buildMenu = () => {
    this.tray.setContextMenu(Menu.buildFromTemplate([
      this.getAddSongMenuItem(),
      this.getAddToPlaylistMenuItem(),
      {type: 'separator'},
      this.selectQuickAddPlaylist(),
      {type: 'separator'},
      {role: 'quit'}
    ]))
  }

  getAddSongMenuItem = () => {
    return new MenuItem({
      label: 'Add to my songs',
      click: this.spotifyApiWrapper.addCurrentlyPlayingSong
    })
  }

  getSelectedPlaylist = () => {
    return this.playlists.find(playlist => playlist.id === this.selectedPlaylist)
  }

  getAddToPlaylistMenuItem = () => {
    let label = 'Add to playlist'
    let enabled = false
    if(this.selectedPlaylist){
      label = `Add to '${this.getSelectedPlaylist().name}'`
      enabled = true
    }
    const click = () => {
      this.spotifyApiWrapper.addCurrentTrackToPlaylist(this.selectedPlaylist)
    }
    return new MenuItem({
      enabled,
      label,
      click
    })
  }

  selectQuickAddPlaylist = () => {
    return new MenuItem({
      label: 'Quickadd playlist',
      submenu: this.playlistsLoading ? [
        new MenuItem({label: 'Loading...', enabled: false})
      ] : [
        ...this.playlists.map(playlist => {
          const click = () => {
            console.log(`Selected playlist ${playlist.name} (${playlist.id}).`)
            this.selectedPlaylist = playlist.id
            this.buildMenu()
          }
          const checked = playlist.id === this.selectedPlaylist
          return new MenuItem({label: playlist.name, click, type: 'radio', checked})
        }),
        {type: 'separator'},
        new MenuItem({label: 'Reload', click: this.loadPlaylists})
      ]
    })
  }

  loadPlaylists = () => {
    this.playlistsLoading = true
    this.buildMenu()
    this.spotifyApiWrapper.spotifyApi.getUserPlaylists()
    .then(response => response.body.items)
    .then(playlists => {
      this.playlists = playlists
      this.playlistsLoading = false
      this.buildMenu()
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
