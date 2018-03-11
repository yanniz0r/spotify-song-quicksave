const {app, Menu, MenuItem, Tray, nativeImage} = require('electron')
const path = require('path')
  
  let tray = null

  const iconPath = path.join(__dirname, 'spotify-logo.png')
  const icon = nativeImage.createFromPath(iconPath).resize({
    width: 14,
    height: 14
  })

  const addSongMenuItem = new MenuItem({
    label: 'Add to my songs',
    click: function(){
      console.log('Clicked');
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
