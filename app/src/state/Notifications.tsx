import { FCM } from "@capacitor-community/fcm";
import {
  PushNotifications,
  PushNotificationSchema,
} from "@capacitor/push-notifications";
import { isPlatform } from "@ionic/core";
import { create } from "zustand";

export const notifications = create<{
  notifications: PushNotificationSchema[];
  fcm_token: string;
}>((set, get) => ({
  notifications: [],
  fcm_token: null,
}));

update_token();
isPlatform('hybrid')&& subscribeToTopic('general')

export async function update_token() {
  try {
    if (!isPlatform("hybrid")) return null;
  const r = await FCM.getToken();
  console.log(`Token ${r.token}`);
  notifications.setState({ fcm_token: r.token });
  return r.token;
  } catch (error) {
    console.log('update_token error=> ',error)
  }
  
}

export function subscribeToTopic(topic: string) {
  FCM.subscribeTo({ topic })
    .then((r) => console.log(`subscribed to topic` + topic))
    .catch((err) => console.log(err));
}
export function unSubscribeToTopic(topic: string) {
  FCM.unsubscribeFrom({ topic })
    .then((r) => console.log(`subscribed to topic` + topic))
    .catch((err) => console.log(err));
}

export async function loadPush() {
  if (!isPlatform("hybrid")) return;
  await PushNotifications.requestPermissions();
  await PushNotifications.register();
  PushNotifications.getDeliveredNotifications().then((n) => {
    notifications.setState({ notifications: n.notifications });
  });
  PushNotifications.addListener("pushNotificationReceived", (not) => {
    console.log("notififcation receved :>> ", JSON.stringify(not));
    notifications.setState({
      notifications: [...notifications.getState().notifications, not],
    });
  });
  // now you can subscribe to a specific topic

  // Get FCM token instead of the APN one returned by Capacitor

  // Delete the old FCM token and get a new one
  // FCM.refreshToken()
  //   .then((r) => console.log(`Token ${r.token}`))
  //   .catch((err) => console.log(err));

  // Remove FCM instance
  // FCM.deleteInstance()
  //   .then(() => console.log(`Token deleted`))
  //   .catch((err) => console.log(err));

  // Enable the auto initialization of the library
  FCM.setAutoInit({ enabled: true }).then(() =>
    console.log(`Auto init enabled`)
  );

  // Check the auto initialization status
  FCM.isAutoInitEnabled().then((r) => {
    console.log("Auto init is " + (r.enabled ? "enabled" : "disabled"));
  });
}
// external required step
// register for push

// Unsubscribe from a specific topic
// FCM.unsubscribeFrom({ topic: 'test' })
//   .then(() => alert(`unsubscribed from topic`))
//   .catch(err => console.log(err));
