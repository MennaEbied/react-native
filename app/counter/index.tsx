import { 
  Text,
   View,
   StyleSheet, 
   TouchableOpacity, 
   Alert, 
   ActivityIndicator,
   Dimensions
  } from "react-native";
import {useEffect, useRef, useState} from "react";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { isBefore, Duration, intervalToDuration  } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import * as Haptics from "expo-haptics";
import ConfettiCanon from "react-native-confetti-cannon";



//Two weeks
const frequency= 14* 24* 60* 60* 1000;

export const countdownStorageKey="taskley-counter";

 export type PersistedCountdownState={
  currentNotificationId:string | undefined;
  completedAtTimestamp:number [];
};

type CountdownStatus={
  isOverdue:boolean;
  distance:Duration;
}

export default function CounterScreen() {
  const[isLoading,setIsLoading]=useState(true);
  const confettiRef=useRef<any>();
  const[countdownState,setCountdownState]=useState<PersistedCountdownState>()
  const[status,setStatus]=useState<CountdownStatus>({
    isOverdue:false,
    distance:{},
  });

  const lastCompletedTimestamp= countdownState?.completedAtTimestamp[0]

  useEffect(()=>{
    const init =async()=>{
      const value=await getFromStorage(countdownStorageKey)
      setCountdownState(value)
    }
    init();
  },[])
  

  useEffect(()=>{
    const intervalId=setInterval(()=>{
      const timestamp= lastCompletedTimestamp 
      ? lastCompletedTimestamp + frequency 
      :Date.now();

      if(lastCompletedTimestamp){
        setIsLoading(false);
      }


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
  },[lastCompletedTimestamp]);

  const scheduleNotification = async () => {
    confettiRef?.current?.start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    let pushNotificationId;
      const result = await registerForPushNotificationsAsync();
      if(result==="granted"){
        pushNotificationId= await Notifications.scheduleNotificationAsync({
          content:{
            title:"Time to wash the car🚗!"
          }, 
          trigger:{
            seconds:frequency/1000,
          }
        })
      }else{
        Alert.alert(
          "Unable to schedule notification",
          "Enable the notification permission for expo go in settings"
          )
      }
      if(countdownState?.currentNotificationId){
        await Notifications.cancelScheduledNotificationAsync(
          countdownState?.currentNotificationId,
        )
      }
      const newCountdownState: PersistedCountdownState={
        currentNotificationId:pushNotificationId,
        completedAtTimestamp: countdownState
        ? [Date.now(),...countdownState.completedAtTimestamp]
        : [Date.now()]
      }
      setCountdownState(newCountdownState);
      await saveToStorage(countdownStorageKey,newCountdownState)
    };
    if(isLoading){
      return(
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator />
        </View>
      )
    }
    

  return (
    <View 
    style={[
      styles.container,status.isOverdue?
      styles.containerLate:undefined
    ]}
      >

      {status.isOverdue?(
        <Text style={[styles.heading,styles.whiteText]}>
          Car wash overdue by
        </Text>
      ): (
        <Text style={styles.heading}>Car wash due in ...</Text>
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
        <Text style={styles.buttonText}>I've washed the car! </Text>
      </TouchableOpacity>
      <ConfettiCanon 
        ref={confettiRef}
        count={50}
        origin={{x:Dimensions.get("window").width/2,y:-20}}
        autoStart={false}
        fadeOut
      />
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
  },
  activityIndicatorContainer:{
    backgroundColor:theme.colorWhite,
    justifyContent:"center",
    alignItems:"center",
    flex:1,
  }
});
