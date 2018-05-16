function list(rdClient, hashids) {
  return new Promise(function(resolve, reject) {
    rdClient.keys('url:*', (err, keys) => {
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

function backup(rdClient, db, hashid) {
  return new Promise(function(resolve, reject) {
    list(rdClient, hashid).then((data) => {
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
  list: (rdClient, hashid) => list(rdClient, hashid),
  backup: (rdClient, db, hashid) => backup(rdClient, db, hashid)
}
