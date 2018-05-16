const Hashids = require('hashids')

const legalAlpha = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ1234567890'
const hashids = new Hashids('O7XVnq82M9', 5, legalAlpha)


module.exports = {
  encode: (param) => hashids.encode(param),
  decode: (param) => hashids.decode(param)
}
