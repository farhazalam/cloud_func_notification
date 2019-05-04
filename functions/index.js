const functions = require('firebase-functions');

const admin = require('firebase-admin')
admin.initializeApp()

var name
exports.sendNoti = functions.firestore
    .document('MESSAGE/{ID1}/{ID2}/{message}')
    .onCreate((snap, context) => {
        console.log('starts')
        const idFrom = snap.data().idFrom
        const idTo = snap.data().idTo
        const content = snap.data().content
        console.log(`from: ${idFrom},to: ${idTo},content: ${content}`)


        admin.firestore().collection('USER').where('id', '==', idFrom)
            .get().then(qs => {
                qs.forEach(ds => { name = ds.data().name })
                return console.log('got name')
            }).catch((e) => {console.log(e) })



        admin.firestore().collection('USER').where('id', '==', idTo)
            .get().then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().tokendata) {
                        const payload = {
                            notification: {
                                title: `You have a new message from ${name}`,
                                body: content,
                                sound: 'default'
                            },
                        }
                        admin.messaging()
                            .sendToDevice(documentSnapshot.data().tokendata,
                                payload)
                    }
                    else {
                        console.log('cant find')
                    }

                })
                return console.log('nothing')
            }).catch((e) => { console.log(e); })
    })