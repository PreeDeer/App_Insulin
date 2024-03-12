import * as React from "react";
import { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  AppRegistry,
  ImageBackground,
  Pressable,
  ScrollView,
  Linking,
} from "react-native";

import {
  Button,
  TextInput,
  Avatar,
  Provider as PaperProvider,
  DefaultTheme,
  configureFonts,
  MD2LightTheme,
  Card,
  Switch,
  TimePicker,
} from "react-native-paper";

//--------------------------------------------------------------------------------//
import DatePicker from "react-native-datepicker";

import { Database } from "../Alarm/DatabaseAlarm";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Notifications from "expo-notifications";

import { Icon } from "react-native-elements";
import { Audio } from 'expo-av';

const items = [
  {
    id: 1,
    name: "ช่วงเช้า",
    Title: "{time} ",
    image: require("../../assets/bgalarm1.png"),
    music: " ",
    days: "อา.,จ.,อ.,พ.,พฤ.,ศ.,ส.",
    switchs: true,
  },
  {
    id: 2,
    name: "ช่วงเที่ยง",
    Title: "{time} ",
    image: require("../../assets/bgalarm2.png"),
    music: " ",
    days: "อา.,จ.,อ.,พ.,พฤ.,ศ.,ส.",
    switchs: true,
  },
  {
    id: 3,
    name: "ช่วงเย็น",
    Title: "{time} ",
    image: require("../../assets/bgalarm3.png"),
    music: " ",
    days: "อา.,จ.,อ.,พ.,พฤ.,ศ.,ส.",
    switchs: true,
  },
];

const thaiToEnglishDays = {
  "อา.": "Sun",
  "จ.": "Mon",
  "อ.": "Tue",
  "พ.": "Wed",
  "พฤ.": "Thu",
  "ศ.": "Fri",
  "ส.": "Sat",
};

const Alarmmain = ({ navigation, route }) => {
  const { alarmsData } = route.params || {};

  const [switchStates, setSwitchStates] = useState(
    items.map((item) => item.switchs)
  );
  const [selectedDays, setSelectedDays] = useState({});
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  const [alarms, setAlarms] = useState([]);

  const [sound, setSound] = useState();

  const playSound = async () => {
    // ตรวจสอบสถานะเสียง
    if (!sound) {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/music/alarm.mp3')
      );
      setSound(sound);
  
      // เพิ่มตัวควบคุมสำหรับการหยุดเสียง
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          console.log('Sound not loaded');
        } else {
          // ตรวจสอบว่าเสียงเล่นเสร็จหรือไม่
          if (status.didJustFinish && !status.isLooping) {
            // เริ่มเล่นอีกครั้ง
            sound.replayAsync();
          }
        }
      });
  
      // เริ่มเล่นเสียง
      await sound.playAsync();
    }
  };
  
  useEffect(() => {
    // การตรวจสอบว่ามีเสียงหรือไม่
    return sound
      ? () => {
          console.log('Unloading Sound');
          // หยุดเสียงเมื่อ component unmount
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  

  const askForNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert(
          "คุณไม่ได้เปิดการแจ้งเตือน",
          'โปรดเปิดการแจ้งเตือนของแอปพลเคชั่นใน "ตั้งค่า"',
          [
            {
              text: "ตกลง",
              onPress: async () => {
                console.log("OK Pressed");
                await Linking.openSettings();
              },
            },
          ]
        );
      }
    }
  };

  useEffect(() => {
    console.log("alarmsData:", alarmsData);

    if (route.params && route.params.updatedAlarm) {
      const updatedAlarm = route.params.updatedAlarm;
      setSelectedDays(updatedAlarm.selectedDays || {});
      setHour(updatedAlarm.hour || 0);
      setMinute(updatedAlarm.minute || 0);
    }
    // ใช้ Database.getAll() เพื่อดึงข้อมูลทั้งหมดพร้อมกับ cardId เป็นเงื่อนไข
    Database.getAll({ cardId: route.params?.cardId })
      .then((result) => {
        console.log("Fetched alarms from the database:", result);

        // ทำต่อไปตามความต้องการของคุณ เช่น อัพเดท state หรือทำอะไรก็ตามที่ต้องการ
        setAlarms(result);
      })
      .catch((error) => {
        console.error("Error fetching alarms:", error);
      });

    askForNotificationPermission();
  }, [route.params, alarmsData]);

  // useEffect ใหม่ที่ดึงสถานะสวิตซ์ล่าสุด
  useEffect(() => {
    const retrieveSwitchStates = async () => {
      try {
        const storedSwitchStates = await AsyncStorage.getItem('switchStates');
        if (storedSwitchStates) {
          setSwitchStates(JSON.parse(storedSwitchStates));
        }
      } catch (error) {
        console.error('Error retrieving switchStates from AsyncStorage:', error);
      }
    };
  
    retrieveSwitchStates();
  }, [switchStates]);  // ให้ useEffect ทำงานเพียงครั้งเดียวที่การ render แรก (mount)
  
  useEffect(() => {
    // ทำงานเมื่อ switchStates มีการเปลี่ยนแปลง
    console.log("SwitchStates updated:", switchStates);
    // คุณสามารถทำอย่างอื่น ๆ ที่คุณต้องการในนี้
  }, [switchStates]);
  

  const renderTitleWithTime = (cardId) => {
    const item = items.find((item) => item.id === cardId);

    if (item) {
      const fetchedData = getFetchedDataForCardId(cardId);

      if (fetchedData) {
        const formattedTime = `${fetchedData.hour
          .toString()
          .padStart(2, "0")}:${fetchedData.minute
          .toString()
          .padStart(2, "0")} น.`;
        const replacedTitle = item.Title.replace("{time}", formattedTime);

        // ตรวจสอบว่า days มีใน SQL list หรือไม่
        const hasDaysInSQLList =
          fetchedData.days && fetchedData.days.length > 0;

        console.log(
          `cardId: ${cardId}, item.id: ${item.id}, replacedTitle: ${replacedTitle}, hasDaysInSQLList: ${hasDaysInSQLList}`
        );

        // เพิ่มเงื่อนไขเพื่อตรวจสอบว่า days มีใน SQL list หรือไม่
        if (hasDaysInSQLList) {
          console.log(`Days in SQL List: ${fetchedData.days}`);
        } else {
          console.log(`No days in SQL List for cardId: ${cardId}`);
        }
        // เพิ่ม console.log สำหรับแสดงข้อมูล English Days
        const parsedDays = JSON.parse(fetchedData.days);
        const englishDays = parsedDays[0].map(
          (day) => thaiToEnglishDays[day.trim()]
        );
        console.log("English Days:", englishDays);

        // ตรวจสอบว่าสถานะสวิตซ์เป็น true หรือ false
        const switchState = switchStates[cardId - 1];
        console.log(
          `Switch states for cardId ${cardId}: ${
            switchState ? "true" : "false"
          }`
        );

        // ส่ง englishDays ไปยัง NotificationAlarmId /************** */
        NotificationAlarmId(cardId, englishDays, switchState);

        return <Text style={styles.CardDescription}>{replacedTitle}</Text>;
      } else {
        console.log(`No data for cardId: ${cardId}`);
        return (
          <Text style={styles.CardDescription}>No data for this cardId</Text>
        );
      }
    } else {
      console.log(`No item for cardId: ${cardId}`);
      return <Text style={styles.CardDescription}>00.00 น.</Text>;
    }
  };

  // เพิ่มฟังก์ชันที่ให้ข้อมูลจาก SQLList หรือที่เก็บข้อมูลไว้ (ในที่นี้ให้ใช้ข้อมูลจาก state เป็นตัวอย่าง)
  const getFetchedDataForCardId = (cardId) => {
    const fetchedData = alarms.find((alarm) => alarm.cardId === cardId);

    return fetchedData;
  };

  const checkDayInSQLList = (cardId, day) => {
    const fetchedData = getFetchedDataForCardId(cardId);

    if (fetchedData) {
      return fetchedData.days.includes(day);
    }

    return false;
  };

  const onToggleSwitch = async (itemId) => {
    const updatedSwitchStates = switchStates.map((state, index) =>
      index === itemId - 1 ? !state : state
    );
    setSwitchStates(updatedSwitchStates);
  
    try {
      // บันทึก switchStates ที่อัปเดตล่าสุดไว้ใน AsyncStorage
      await AsyncStorage.setItem('switchStates', JSON.stringify(updatedSwitchStates));
    } catch (error) {
      console.error('Error saving switchStates to AsyncStorage:', error);
    }
  };
  

  /*************************************************************** */
  const scheduleNotification = async (
    scheduledTime,
    notificationMessage,
    englishDays
  ) => {
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString("en-US", {
      weekday: "short",
    });

    if (englishDays.includes(currentDay)) {

      Notifications.scheduleNotificationAsync({
        content: {
          title: "แจ้งเตือน",
          body: notificationMessage,
          sound: 'default', //เสียงติ้งจากเครื่อง
        },
        trigger: {
          date: scheduledTime,
        },
      });
      console.log("Notification successfully scheduled and triggered!");
    } else {
      console.log(
        "Current day is not in englishDays, no notification scheduled."
      );
    }
  };

  // ในฟังก์ชัน NotificationAlarmId
  const NotificationAlarmId = async (itemId, englishDays,switchState) => {
    const fetchedData = getFetchedDataForCardId(itemId);

    if (fetchedData) {
      const { hour, minute, days } = fetchedData;
      console.log("Received data for cardId:", itemId);
      console.log("Hour:", hour);
      console.log("Minute:", minute);

      const parsedDays = JSON.parse(days);
      const thaiDays = parsedDays[0];

      const currentDate = new Date();
      const currentDay = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
      });

      // เพิ่ม console.log สำหรับแสดงข้อมูล English Days ใน NotificationAlarmId
      console.log("English Days in NotificationAlarmId:", englishDays);
      console.log("Current Day:", currentDay);

      if (englishDays.includes(currentDay)) {
        const scheduledTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          hour,
          minute
        );

        console.log("Current Time:", currentDate);
        console.log("Scheduled Time:", scheduledTime); //กำหนดเวลา

        if (scheduledTime > currentDate) {
          try {
            // ใช้ switchStates ที่รับมาจากพารามิเตอร์
            if (switchState) {
              const notificationMessage = `นี้คือการแจ้งเตือน! เวลา ${scheduledTime.toLocaleTimeString(
                "th-TH",
                { hour: "2-digit", minute: "2-digit", hour12: true }
              )} ได้เวลาฉีดยาแล้วน้า`;
          
              await scheduleNotification(
                scheduledTime,
                notificationMessage,
                englishDays
              );
          
              console.log("Notification successfully scheduled and triggered!");
            } else {
              console.log("Switch is turned off, no notification scheduled.");
            }
          } catch (error) {
            console.error(
              "Error scheduling or triggering notification:",
              error
            );
          }
        } else {
          console.log(
            "Scheduled time is in the past, notification not scheduled."
          );
        }
      } else {
        console.log("Today is not in the list of days to notify.");
      }
    } else {
      console.log(`No data for cardId: ${itemId}`);
    }
  };

  /*************************************************************** */
  const handleCardPress = (itemId, itemImage) => {
    navigation.navigate("AlarmClock", {
      cardId: itemId,
      cardImage: itemImage,
      selectedDays,
      alarmsData,
    });
    console.log(`Card with ID ${itemId} pressed`);
  };

  return (
    <SafeAreaView style={styles.backgroundImage}>
      
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View style={styles.View}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleCardPress(item.id, item.image)}
                activeOpacity={0.8}
              >
                <Card style={styles.Card}>
                  <Card.Cover source={item.image} style={styles.CardImage} />
                  <Card.Content>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <Text style={{ ...styles.CardTitle, width: 175 }}>
                        {item.name}
                      </Text>
                      <Switch
                        value={switchStates[item.id - 1]}
                        onValueChange={() => onToggleSwitch(item.id)}
                      />
                    </View>
                    {renderTitleWithTime(item.id)}

                    {switchStates[item.id - 1] && (
                      <View>
                        <Text>{item.music}</Text>

                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                          {item.days.split(",").map((day, index) => (
                            <View
                              key={index}
                              style={[
                                styles.dayButton,
                                (selectedDays[item.id] &&
                                  selectedDays[item.id].includes(day.trim())) ||
                                checkDayInSQLList(item.id, day.trim()) // เพิ่มเงื่อนไขเช็คว่าวันนี้มีใน SQLList หรือไม่
                                  ? styles.selectedDayButton
                                  : null,
                              ]}
                            >
                              <Text style={styles.dayButtonText}>
                                {day.trim()}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  View: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor: "rgba(234, 252, 255, 0.4)",
  },
  Textheader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 16,
  },
  BackButton: {
    elevation: 5,
    marginTop: 15,
    marginLeft: 15,
    flexDirection: "row",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 35,
    height: 35,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  Card: {
    marginBottom: 20,
    elevation: 5,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
  },
  CardImage: {
    width: 375,
    height: 95,
    marginBottom: 10,
    borderRadius: 0,
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
  },
  CardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  CardDescription: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.5)",
  },
  CardTitleinfor: {
    fontSize: 14,
    marginBottom: 5,
    color: "rgba(0, 0, 0, 0.8)",
  },

  dayButton: {
    backgroundColor: "#66B8E6",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  selectedDayButton: {
    backgroundColor: "#2ecc71", // สีเมื่อถูกเลือก
  },
  dayButtonText: {
    color: "#fff",
  },
});

export default Alarmmain;
