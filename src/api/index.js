const db = require('../firebase')

const hashids = require('./hasher')
const dataManager = require('./datamg')
const urlManager = require('./urlmg')

let jobHandler
const jobInterval = 1000 * 60 * 60 * 20 //every 20 hrs

module.exports = {
  route(rdClient, req) {
    if (req.path.startsWith('/shorten')) {
      // Start job if the job has not been started, and when there is a new data entry
      if (!jobHandler) {
        jobHandler = setInterval(
          function() {
            dataManager.backup(rdClient, db, hashids)
          }, jobInterval)
      }

      return urlManager.shorten(rdClient, hashids, req.body)
    } else if (req.path.startsWith('/list')) {
      return dataManager.list(rdClient, hashids)
    } else if (req.path.startsWith('/backup')) {
      return dataManager.backup(rdClient, db, hashids)
    } else {
      return 'OK'
    }
  },
  lenghten: urlManager.lenghten
}
