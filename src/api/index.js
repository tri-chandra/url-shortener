const db = require('../firebase')

const hashids = require('./hasher')
const dataManager = require('./datamg')
const urlManager = require('./urlmg')

module.exports = {
  route(rdClient, req) {
    if (req.path.startsWith('/shorten')) {
      return urlManager.shorten(rdClient, req.body)
    } else if (req.path.startsWith('/list')) {
      return dataManager.list(rdClient)
    } else if (req.path.startsWith('/backup')) {
      return dataManager.backup(rdClient)
    } else {
      return 'OK'
    }
  },
  lenghten: urlManager.lenghten
}
