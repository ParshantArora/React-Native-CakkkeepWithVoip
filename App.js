/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity, PermissionsAndroid, Alert
} from 'react-native';
import VoipPushNotification from 'react-native-voip-push-notification';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';



import RNCallKeep from 'react-native-callkeep';;
import uuid from 'uuid';
import messaging from '@react-native-firebase/messaging';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};




class App extends React.Component {

  constructor(props) {
    super(props)

    this.currentCallId = null;

    // Add RNCallKeep Events
    RNCallKeep.addEventListener('didReceiveStartCallAction', this.didReceiveStartCallAction);
    RNCallKeep.addEventListener('answerCall', this.onAnswerCallAction);
    RNCallKeep.addEventListener('endCall', this.onEndCallAction);
    RNCallKeep.addEventListener('didDisplayIncomingCall', this.onIncomingCallDisplayed);
    RNCallKeep.addEventListener('didPerformSetMutedCallAction', this.onToggleMute);
    RNCallKeep.addEventListener('didToggleHoldCallAction', this.onToggleHold);
    RNCallKeep.addEventListener('didPerformDTMFAction', this.onDTMFAction);
    RNCallKeep.addEventListener('didActivateAudioSession', this.audioSessionActivated);
  }
      // --- anywhere which is most comfortable and appropriate for you,
      // --- usually ASAP, ex: in your app.js or at some global scope.
      componentDidMount() {
  

        this.setup()
        this.requestUserPermission()
          // --- NOTE: You still need to subscribe / handle the rest events as usuall.
          // --- This is just a helper whcih cache and propagate early fired events if and only if for
          // --- "the native events which DID fire BEFORE js bridge is initialed",
          // --- it does NOT mean this will have events each time when the app reopened.
  
  
          // ===== Step 1: subscribe `register` event =====
          // --- this.onVoipPushNotificationRegistered
          VoipPushNotification.addEventListener('register', (token) => {
            console.log("voippppppp",token)
              // --- send token to your apn provider server
          });
  
          // ===== Step 2: subscribe `notification` event =====
          // --- this.onVoipPushNotificationiReceived
          VoipPushNotification.addEventListener('notification', (notification) => {
              // --- when receive remote voip push, register your VoIP client, show local notification ... etc
              // this.doSomething();
            
              // --- optionally, if you `addCompletionHandler` from the native side, once you have done the js jobs to initiate a call, call `completion()`
              VoipPushNotification.onVoipNotificationCompleted(notification.uuid);
          });
  
          // ===== Step 3: subscribe `didLoadWithEvents` event =====
          VoipPushNotification.addEventListener('didLoadWithEvents', (events) => {
              // --- this will fire when there are events occured before js bridge initialized
              // --- use this event to execute your event handler manually by event type
  
              if (!events || !Array.isArray(events) || events.length < 1) {
                  return;
              }
              for (let voipPushEvent of events) {
                  let { name, data } = voipPushEvent;
                  if (name === VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent) {
                      this.onVoipPushNotificationRegistered(data);
                  } else if (name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent) {
                      this.onVoipPushNotificationiReceived(data);
                  }
              }
          });
  
          // ===== Step 4: register =====
          // --- it will be no-op if you have subscribed before (like in native side)
          // --- but will fire `register` event if we have latest cahced voip token ( it may be empty if no token at all )
          VoipPushNotification.registerVoipToken(); // --- register token
      }
  
      // --- unsubscribe event listeners
      componentWillUnmount() {
          VoipPushNotification.removeEventListener('didLoadWithEvents');
          VoipPushNotification.removeEventListener('register');
          VoipPushNotification.removeEventListener('notification');
      }





 // Initialise RNCallKeep
 setup = () => {
  const options = {
    ios: {
      appName: 'ReactNativeWazoDemo',
      imageName: 'sim_icon',
      supportsVideo: false,
      maximumCallGroups: '1',
      maximumCallsPerCallGroup: '1'
    },
    android: {
      alertTitle: 'Permissions Required',
      alertDescription:
        'This application needs to access your phone calling accounts to make calls',
      cancelButton: 'Cancel',
      okButton: 'ok',
      imageName: 'sim_icon',
      additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS]
    }
  };

  try {
    RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true); // Only used for Android, see doc above.
  } catch (err) {
    console.error('initializeCallKeep error:', err.message);
  }
}



displayIncomingCall( handle, localizedCallerName){
  
  const callUUID = uuid.v4();
  let number = String(Math.floor(Math.random() * 100000));
  RNCallKeep.displayIncomingCall(callUUID, number, "testddfgfdgdfge", 'numberdgdgdgdgdf', true);
}


  // Use startCall to ask the system to start a call - Initiate an outgoing call from this point
startCall = ({ handle, localizedCallerName }) => {

  console.log("Start call ")
  // Your normal start call action
  RNCallKeep.startCall(this.getCurrentCallId(), handle, localizedCallerName);
};

reportEndCallWithUUID = (callUUID, reason) => {
  RNCallKeep.reportEndCallWithUUID(callUUID, reason);
}

// Event Listener Callbacks

didReceiveStartCallAction = (data) => {
  let { handle, callUUID, name } = data;
  // Get this event after the system decides you can start a call
  // You can now start a call from within your app
};

onAnswerCallAction = (data) => {  
  let { callUUID } = data;
  console.log("displayName",callUUID)
  // Called when the user answers an incoming call
  //  RNCallKeep.answerIncomingCall(uuid)
};

onEndCallAction = (data) => {
  let { callUUID } = data;
  RNCallKeep.endCall(this.getCurrentCallId());

  this.currentCallId = null;
};

// Currently iOS only
onIncomingCallDisplayed = (data) => {
  let { error } = data;
  // You will get this event after RNCallKeep finishes showing incoming call UI
  // You can check if there was an error while displaying
};

onToggleMute = (data) => {
  let { muted, callUUID } = data;
  // Called when the system or user mutes a call
};

onToggleHold = (data) => {
  let { hold, callUUID } = data;
  // Called when the system or user holds a call
};

onDTMFAction = (data) => {
  let { digits, callUUID } = data;
  // Called when the system or user performs a DTMF action
};

audioSessionActivated = (data) => {
  // you might want to do following things when receiving this event:
  // - Start playing ringback if it is an outgoing call
};

getCurrentCallId = () => {
  if (!this.currentCallId) {
    this.currentCallId = uuid.v4();
  }

  return this.currentCallId;
};





firebaseFunctionCall = () =>{
  messaging()
  .getToken()
  .then((fcmToken) => {
    if (fcmToken) {
      console.log("fcmTokenfcmTokenfcmToken",fcmToken)

    } else {
      console.log('[FCMService] User doesnt not have a device token');
    }
  })
  .catch((error) => {
    console.log('[FCMService] getToken rejected', error);
  });

   unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
  // Register background handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {

//   // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//   // console.log('Message handled in the background!', remoteMessage);

// });

messaging().onNotificationOpenedApp(remoteMessage => {
console.log(
  'Notification caused app to open from background state:',
  remoteMessage.notification,
);
});

messaging()
.getInitialNotification()
.then(remoteMessage => {
if (remoteMessage) {
  console.log(
    'Notification caused app to open from quit state:',
    remoteMessage.notification,
  );
}

});

}


  requestUserPermission = async()=> {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      this.firebaseFunctionCall()
    }
  }












  render(){
    return (
      <View style={{flex:1, backgroundColor : "red", paddingTop: 100}} >
      
      <TouchableOpacity onPress={()=>{this.displayIncomingCall({handle: "+919041908802",localizedCallerName: "Parshant Nagpal" })}}>
        <Text>Testtttt</Text>
       </TouchableOpacity> 
      </View>
    );
  }
  }

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
