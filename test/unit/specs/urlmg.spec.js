import urlmg from '@/api/urlmg'

const mockRedis = {
  get(key, cb) {
    cb(null, 'foo')
  },
  set(a, b, c, d, cb) {
    if (cb) cb(null, null)
  }
}

const mockValidRedis = {
  get(key, cb) {
    cb(null, '123')
  },
  set(a, b, c, d, cb) {
    if (cb) cb(null, null)
  }
}

const mockFaillingRedisGet = {
  get(key, cb) {
    cb('err:get', 'foo')
  },
  set(a, b, c, d, cb) {
    if (cb) cb('er:set', null)
  }
}

const mockHashid = {
  encode: (x) => x
}

describe('URL Manager', () => {
  it('Test shorten string', () => {
    return urlmg.shorten(mockRedis, mockHashid, {url:'bar'}).then((result) => {
      expect(result).to.equal(1)
    }).catch((err) => {
      expect.fail(0, 1, err)
    })
  })

  it('Test shorten string to existing Redis', () => {
    return urlmg.shorten(mockValidRedis, mockHashid, {url:'bar'}).then((result) => {
      expect(result).to.equal(124)
    }).catch((err) => {
      expect.fail(0, 1, err)
    })
  })

  it('Test shorten fail to get last key', () => {
    return urlmg.shorten(mockFaillingRedisGet, mockHashid, {url:'bar'}).then((result) => {
      expect.fail(0, 1, 'This should fail!')
    }).catch((err) => {
      expect(err).to.equal('err:get')
    })
  })

  it('Test lenghten string', () => {

  })
})
