// import firebase from 'firebase'
// import 'firebase/firestore'
// import { config } from '@/config/FirebaseConfig'

const firebase = require('firebase')
const config = require('../config/FirebaseConfig')

firebase.initializeApp(config)

let db = firebase.firestore()
db.settings({
  timestampsInSnapshots: true
})

module.exports = db
