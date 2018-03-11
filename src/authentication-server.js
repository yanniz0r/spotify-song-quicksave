const express = require('express')
const app = express()

const port = 3297

class AuthenticationServer {
  constructor(){
    app.get('/', (function (req, res) {
      this.authenticationCallback(req.query.code)
      res.send('Hello World!')
    }).bind(this));
    app.listen(port, function () {
      console.log(`Authentication Server listening on Port ${port}`)
    })
  }

  setAuthenticationCallback(callback){
    this.authenticationCallback = callback
  }

  authenticationCallback(code){
    return
  }

  getRedirectUri(){
    return `http://localhost:${port}`
  }
}

module.exports = AuthenticationServer