import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";

export default function CounterScreen() {
  const scheduleNotification = async () => {
      const result = await registerForPushNotificationsAsync();
      if(result==="granted"){
        await Notifications.scheduleNotificationAsync({
          content:{
            title:"I'm a notification from your app"
          }, 
          trigger:{
            seconds:5,
          }
        })
      }else{
        Alert.alert(
          "Unable to schedule notification",
          "Enable the notification permission for expo go in settings"
          )
      }
  
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={scheduleNotification} 
        style={styles.button} 
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Schedule notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
  },
  button:{
    backgroundColor:theme.colorBlack,
    padding:12,
    borderRadius:6,
  },
  buttonText:{
    fontWeight:"bold",
    textTransform:"uppercase",
    color:theme.colorWhite,
    letterSpacing:1,
  }
});
