const Hashids = require('hashids')

const legalAlpha = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ1234567890'
const hashids = new Hashids('salt', 5, legalAlpha)


module.exports = {
  encode: (param) => hashids.encode(param),
  decode: (param) => hashids.decode(param)
}
