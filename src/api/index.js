const Hashids = require('hashids')

const legalAlpha = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ1234567890'
const hashids = new Hashids('salt', 8, legalAlpha)

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
    rdClient.keys('url:*', (err, reply) => {
      if (err) reject(err)

      const result = reply.map(val => hashids.encode(Number(val.substring(4), 10)))
      resolve(result)
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
    } else {
      return 'OK'
    }
  },
  lenghten(rdClient, path) {
    return new Promise(function(resolve, reject) {
      const id = hashids.decode(path)[0]
      rdClient.get(`url:${id}`, (err, reply) => {
        if (err) reject(err)

        resolve(reply)
      })
    })
  }
}
