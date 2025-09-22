// import { FirebaseMessaging } from '@capacitor-firebase/messaging';

// const checkPermissions = async () => {
//   const result = await FirebaseMessaging.checkPermissions();
//   return result.receive;
// };

// const requestPermissions = async () => {
//   const result = await FirebaseMessaging.requestPermissions();
//   return result.receive;
// };

// const getToken = async () => {
//   const result = await FirebaseMessaging.getToken();
//   return result.token;
// };

// const deleteToken = async () => {
//   await FirebaseMessaging.deleteToken();
// };

// const getDeliveredNotifications = async () => {
//   const result = await FirebaseMessaging.getDeliveredNotifications();
//   return result.notifications;
// };

// const removeDeliveredNotifications = async () => {
//   // await FirebaseMessaging.removeDeliveredNotifications({Notification:});
// };

// const removeAllDeliveredNotifications = async () => {
//   await FirebaseMessaging.removeAllDeliveredNotifications();
// };

// const subscribeToTopic = async () => {
//   await FirebaseMessaging.subscribeToTopic({ topic: 'news' });
// };

// const unsubscribeFromTopic = async () => {
//   await FirebaseMessaging.unsubscribeFromTopic({ topic: 'news' });
// };

// const addTokenReceivedListener = async () => {
//   await FirebaseMessaging.addListener('tokenReceived', event => {
//     console.log('tokenReceived', { event });
//   });
// };

// const addNotificationReceivedListener = async () => {
//   await FirebaseMessaging.addListener('notificationReceived', event => {
//     console.log('notificationReceived', { event });
//   });
// };

// const addNotificationActionPerformedListener = async () => {
//   await FirebaseMessaging.addListener('notificationActionPerformed', event => {
//     console.log('notificationActionPerformed', { event });
//   });
// };

// const removeAllListeners = async () => {
//   await FirebaseMessaging.removeAllListeners();
// };