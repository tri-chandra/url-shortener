import datamg from '@/api/datamg'

const mockRedis = {
  keys(key, cb) {
    cb(null, ['url:1', 'url:2', 'url:3', 'url:4', 'url:5'])
  },
  mget(keys, cb) {
    cb(null, ['one', 'two', 'three', 'four', 'five'])
  }
}

const mockFaillingRedisKeys = {
  keys(key, cb) {
    cb('err:keys', null)
  },
  mget(keys, cb) {
    cb('err:mget', null)
  }
}

const mockFaillingRedisMget = {
  keys(key, cb) {
    cb(null, ['url:1', 'url:2', 'url:3', 'url:4', 'url:5'])
  },
  mget(keys, cb) {
    cb('err:mget', null)
  }
}

const mockHashid = {
  encode: (x) => x
}

const mockDb = {
  batch() {
    return {
      set(val) {

      },
      commit() {}
    }
  },
  collection(val) {
    return {
      doc() {
        return ''
      }
    }
  }
}

const listAnswer = [
  {key: 1, url: 'one'},
  {key: 2, url: 'two'},
  {key: 3, url: 'three'},
  {key: 4, url: 'four'},
  {key: 5, url: 'five'}
]

describe('Data Manager', () => {
  it('List minified URLs', () => {
    return datamg.list(mockRedis, mockHashid).then((result) => {
      expect(result).to.deep.equal(listAnswer)
    }).catch((err) => {
      expect.fail(0, 1, err)
    })
  })

  it('List failed to get keys', () => {
    return datamg.list(mockFaillingRedisKeys, mockHashid).then((result) => {
      expect.fail(0, 1, 'This should fail!')
    }).catch((err) => {
      expect(err).to.equal('err:keys')
    })
  })

  it('List failed to get values', () => {
    return datamg.list(mockFaillingRedisMget, mockHashid).then((result) => {
      expect.fail(0, 1, 'This should fail!')
    }).catch((err) => {
      expect(err).to.equal('err:mget')
    })
  })

  it('Backup memcache to DB', () => {
    return datamg.backup(mockRedis, mockDb, mockHashid).then((result) => {
      expect(result).to.equal('OK')
    }).catch((err) => {
      expect.fail(0, 1, err)
    })
  })

  it('Backup error', () => {
    return datamg.backup(mockFaillingRedisKeys, mockDb, mockHashid).then((result) => {
      expect.fail(0, 1, 'This should fail!')
    }).catch((err) => {
      expect(1).to.equal(1)
    })
  })
})
