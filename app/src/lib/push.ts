import { FCM } from '@capacitor-community/fcm';
import { PushNotifications } from '@capacitor/push-notifications';

// external required step
// register for push
await PushNotifications.requestPermissions();
await PushNotifications.register();

// now you can subscribe to a specific topic
FCM.subscribeTo({ topic: 'test' })
  .then(r => alert(`subscribed to topic`))
  .catch(err => console.log(err));

// Unsubscribe from a specific topic
FCM.unsubscribeFrom({ topic: 'test' })
  .then(() => alert(`unsubscribed from topic`))
  .catch(err => console.log(err));

// Get FCM token instead of the APN one returned by Capacitor
FCM.getToken()
  .then(r => alert(`Token ${r.token}`))
  .catch(err => console.log(err));

// Delete the old FCM token and get a new one
FCM.refreshToken()
  .then(r => alert(`Token ${r.token}`))
  .catch(err => console.log(err));

// Remove FCM instance
FCM.deleteInstance()
  .then(() => alert(`Token deleted`))
  .catch(err => console.log(err));

// Enable the auto initialization of the library
FCM.setAutoInit({ enabled: true }).then(() => alert(`Auto init enabled`));

// Check the auto initialization status
FCM.isAutoInitEnabled().then(r => {
  console.log('Auto init is ' + (r.enabled ? 'enabled' : 'disabled'));
});