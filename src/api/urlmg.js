const db = require('../firebase')

const hashids = require('./hasher')
const lifetime = 60 * 60 * 24

/**
 * Increment numeric lastIndex, encode lastIndex using hashids library
 * Store to redis using key: url:lastIndex, and value: client input URL
 *
 * @param {*} rdClient: Inject redis client
 * @param {*} hashids: Inject hashid instance
 * @param {*} param: user-input url
 */
function shorten(rdClient, hashids, param) {
  return new Promise(function(resolve, reject) {
    rdClient.get('lastkey', (err, reply) => {
      if (err) reject(err)

      // Retrieve last index
      let lastIndex = 0;
      if (!isNaN(Number(reply, 10))) {
        lastIndex = Number(reply, 10)
      }

      ++lastIndex
      rdClient.set(`url:${lastIndex}`, param.url, 'EX', lifetime, (err2, ignored) => { // Insert redis record with lifetime setting
      // rdClient.set(`url:${lastIndex}`, param.url, (err2, reply) => {
        if (err) reject(err2)

        rdClient.set('lastkey', lastIndex) // Update lastIndex

        resolve(hashids.encode(lastIndex))
      })
    })
  })
}

/**
 * Decode 5* character code to redis key:value, if key exists, returns value
 *
 * @param {*} rdClient: Inject redis client
 * @param {*} path: encoded key
 */
function lenghten(rdClient, path) {
  return new Promise(function(resolve, reject) {
    const id = hashids.decode(path)[0]
    rdClient.get(`url:${id}`, (err, reply) => { // Search redis mem-cache
      if (err) reject(err)

      if (reply) resolve(reply)
      else { // if not exists, search firebase records
        db.collection('url').doc(path).get().then((doc) => {
          if (doc.data()) {
            rdClient.set(`url:${id}`, doc.data().url, 'EX', lifetime, (err2, reply) => {}) // if not exists, add record to mem-cache
            resolve(doc.data().url)
          } else {
            reject('')
          }
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
      }
    })
  })
}

module.exports = {
  shorten: (rdClient, hashids, param) => shorten(rdClient, hashids, param),
  lenghten: (rdClient, path) => lenghten(rdClient, path)
}
