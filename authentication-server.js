const express = require('express')
const app = express()

const port = 3297

class AuthenticationServer {
  constructor(){
    app.get('/', function (req, res) {
      res.send('Hello World!')
    });
    app.listen(port, function () {
      console.log(`Authentication Server listening on Port ${port}`)
    })
  }

  getRedirectUri(){
    return `http://localhost:${port}`
  }
}

module.exports = AuthenticationServer