/**
 * Dev only API, list key:calue in mem-cache
 *
 * @param {*} rdClient: Inject redis client
 * @param {*} hashids: Inject hashid instance
 */
function list(rdClient, hashids) {
  return new Promise(function(resolve, reject) {
    rdClient.keys('url:*', (err, keys) => { // Query all keys
      if (err) reject(err)

      let retVal = []
      rdClient.mget(keys, (err2, urls) => {
        if (err2) reject(err2)

        for (let i=0; i<keys.length; i++) {
          if (keys[i].length > 4) {
            retVal.push({
              key: hashids.encode(Number(keys[i].substring(4), 10)),
              url: urls[i]
            })
          }
        }

        resolve(retVal)
      })
    })
  })
}

/**
 * Push mem-cache content to firebase
 *
 * @param {*} rdClient: Inject redis client
 * @param {*} db: Inject firebase client
 * @param {*} hashid: Inject hashid instance
 */
function backup(rdClient, db, hashid) {
  console.log('Backup executed on: ' + new Date());
  return new Promise(function(resolve, reject) {
    list(rdClient, hashid).then((data) => {
      const batch = db.batch() // Setup firebase batch insert
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
  list: (rdClient, hashid) => list(rdClient, hashid),
  backup: (rdClient, db, hashid) => backup(rdClient, db, hashid)
}
