const functions = require('firebase-functions');

var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: functions.config().admin.db_url //"https://novelhub-e5107.firebaseio.com"
});

const db = admin.database()
const db_firestore = admin.firestore()

exports.createUser = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName, photoURL } = user
    const u = {
        email,
        displayName,
        photoURL,
        createAt: new Date().getMilliseconds(),
        level: email == functions.config().admin.email ? 10 : 0
    }
    db.ref('users').child(uid).set(u)
})
exports.deleteUser = functions.auth.user().onDelete(async (user) => {
    const { uid } = user
    db.ref('users').child(uid).remove()
})

exports.incrementRequestBoardCount = functions.firestore.document('board-request/{bid}').onCreate(async (snap, context) => {
    try {
        await db_firestore.collection('meta').doc('board-request')
            .update('count', admin.firestore.FieldValue.increment(1))
    } catch (e) {
        await db_firestore.collection('meta').doc('board-request').set({ count: 1 })
    }
})
exports.decrementRequestBoardCount = functions.firestore.document('board-request/{bid}').onDelete(async (snap, context) => {
    await db_firestore.collection('meta').doc('board-request')
        .update('count', admin.firestore.FieldValue.increment(-1))
})
