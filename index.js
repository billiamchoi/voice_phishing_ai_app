import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: Platform.OS === 'ios'
})
1
AppRegistry.registerComponent(appName, () => App);
