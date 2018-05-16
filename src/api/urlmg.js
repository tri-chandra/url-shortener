const db = require('../firebase')

const hashids = require('./hasher')
const lifetime = 60 * 60 * 24

function shorten(rdClient, hashids, param) {
  return new Promise(function(resolve, reject) {
    rdClient.get('lastkey', (err, reply) => {
      if (err) reject(err)

      let lastIndex = 0;
      if (!isNaN(Number(reply, 10))) {
        lastIndex = Number(reply, 10)
      }

      ++lastIndex
      rdClient.set(`url:${lastIndex}`, param.url, 'EX', lifetime, (err2, ignored) => {
      // rdClient.set(`url:${lastIndex}`, param.url, (err2, reply) => {
        if (err) reject(err2)

        rdClient.set('lastkey', lastIndex)

        resolve(hashids.encode(lastIndex))
      })
    })
  })
}

function lenghten(rdClient, path) {
  return new Promise(function(resolve, reject) {
    const id = hashids.decode(path)[0]
    rdClient.get(`url:${id}`, (err, reply) => {
      if (err) reject(err)

      if (reply) resolve(reply)
      else {
        db.collection('url').doc(path).get().then((doc) => {
          if (doc.data()) {
            rdClient.set(`url:${id}`, doc.data().url, 'EX', lifetime, (err2, reply) => {})
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
