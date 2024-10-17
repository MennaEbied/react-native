import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {useEffect, useState} from "react";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { isBefore, Duration, intervalToDuration  } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";


//10 seconds from now
const timestamp=Date.now()+10*1000;

type CountddownStatus={
  isOverdue:boolean;
  distance:Duration;
}

export default function CounterScreen() {
  const[status,setStatus]=useState<CountddownStatus>({
    isOverdue:false,
    distance:{},
  })
  

  useEffect(()=>{
    const intervalId=setInterval(()=>{
      const isOverdue=isBefore(timestamp,Date.now());
      const distance=intervalToDuration(
        isOverdue
          ?{start:timestamp,end:Date.now()}
          :{
            start:Date.now(),
            end:timestamp,
          },
      );
      setStatus({isOverdue,distance});
    },1000);
    return ()=>{
      clearInterval(intervalId);
    };
  },[]);

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
    <View 
    style={[
      styles.container,status.isOverdue?
      styles.containerLate:undefined
    ]}
      >

      {status.isOverdue?(
        <Text style={[styles.heading,styles.whiteText]}>Tthing overdue by</Text>
      ): (
        <Text style={styles.heading}>Thing due in ...</Text>
      )}
      <View style={styles.row}>
        <TimeSegment
         unit="Days" 
         number={status.distance.days??0}
          textStyle={status.isOverdue?styles.whiteText:undefined}
        />
        <TimeSegment
         unit="Hours" 
         number={status.distance.hours??0}
         textStyle={status.isOverdue?styles.whiteText:undefined}
        />
        <TimeSegment
         unit="Minutes" 
         number={status.distance.minutes??0} 
         textStyle={status.isOverdue?styles.whiteText:undefined}
        />
        <TimeSegment
         unit="Seconds" 
         number={status.distance.seconds??0}
         textStyle={status.isOverdue?styles.whiteText:undefined} 
        />
      </View>
      <TouchableOpacity
        onPress={scheduleNotification} 
        style={styles.button} 
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>I've done the thing </Text>
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
  },
  row:{
    flexDirection:"row",
    marginBottom:24,
  },
  heading:{
    fontSize:24,
    fontWeight:"bold",
    marginBottom:24,

  },
  containerLate:{
    backgroundColor:theme.colorRed,
  },
  whiteText:{
    color:theme.colorWhite,
  }
});
