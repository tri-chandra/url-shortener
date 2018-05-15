const db = require('../firebase')

const Hashids = require('hashids')

const legalAlpha = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ1234567890'
const hashids = new Hashids('salt', 5, legalAlpha)

function shorten(rdClient, param) {
  return new Promise(function(resolve, reject) {
    rdClient.get('lastkey', (err, reply) => {
      if (err) reject(err)

      let lastIndex = 0;
      if (!isNaN(Number(reply, 10))) {
        lastIndex = Number(reply, 10)
      }
//client.set(key, value, 'EX', 60 * 60 * 24, callback);
      ++lastIndex
      rdClient.set(`url:${lastIndex}`, param.url, (err2, reply) => {
        if (err) reject(err2)

        rdClient.set('lastkey', lastIndex)

        resolve(hashids.encode(lastIndex))
      })
    })
  })
}

function list(rdClient) {
  return new Promise(function(resolve, reject) {
    rdClient.keys('url:*', (err, keys) => {
      if (err) reject(err)

      let retVal = []
      rdClient.mget(keys, (err2, urls) => {
        if (err2) reject(err2)

        for (let i=0; i<keys.length; i++) {
          retVal.push({
            key: hashids.encode(Number(keys[i].substring(4), 10)),
            url: urls[i]
          })
        }

        resolve(retVal)
      })
    })
  })
}

function backup(rdClient) {
  return new Promise(function(resolve, reject) {
    list(rdClient).then((data) => {
      const batch = db.batch()
      for (let i=0; i<data.length; i++) {
        const datum = data[i]
        const newDoc = db.collection('url').doc(datum.key)
        batch.set(newDoc, datum)
      }
      batch.commit()
      resolve('OK')
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}


module.exports = {
  process(rdClient, param) {
    console.log(param)

    return hashids.encode(123)
  },
  route(rdClient, req) {
    if (req.path.startsWith('/shorten')) {
      return shorten(rdClient, req.body)
    } else if (req.path.startsWith('/list')) {
      return list(rdClient)
    } else if (req.path.startsWith('/backup')) {
      return backup(rdClient)
    } else {
      return 'OK'
    }
  },
  lenghten(rdClient, path) {
    return new Promise(function(resolve, reject) {
      const id = hashids.decode(path)[0]
      rdClient.get(`url:${id}`, (err, reply) => {
        if (err) reject(err)

        if (reply) resolve(reply)
        else {
          db.collection('url').doc(path).get().then((doc) => {
            resolve(doc.data().url)
          }).catch((err) => {
            console.log(err)
            reject(err)
          })
        }
      })
    })
  }
}
