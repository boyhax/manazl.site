// import {} from "npm:@supabase/supabase-js";
import admin, { ServiceAccount } from 'npm:firebase-admin'

import serviceAccount from './service-account.json' with { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL:
    'https://mandubk-370d7-default-rtdb.asia-southeast1.firebasedatabase.app',
})

// This FCM token comes from the Capacitor Firebase Cloud Messaging plugin.
const token =
  'c8Sf_hvQQjO-MjTn9oq4nY:APA91bEnP-Yeej1rYQJkwaOIQwTY76wzvhC8PU2EP-F_toOpyetVFSrY7su0Vr4s67HVWOa0dGxidxZ18MA4liljrg4OI-ikF3rBZes2k4PAU1A1nKAepzs'
const message = {
  notification: {
    title: 'Capacitor Firebase Messaging',
    body: 'Hello world!',
  },
  token: token,
}

// Send a message to the device corresponding to the provided FCM token
admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log('Successfully sent message: ', response)
  })
  .catch((error) => {
    console.log('Error sending message: ', error)
  })
