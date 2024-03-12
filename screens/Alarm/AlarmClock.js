import * as React from "react";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  ImageBackground,
  Pressable,
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
  TimePicker,
} from "react-native-paper";

//--------------------------------------------------------------------------------//
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Database } from "../Alarm/DatabaseAlarm";
import { DateTime } from "luxon";

import { Icon } from "react-native-elements";

const data = [
  {
    days: "อา.,จ.,อ.,พ.,พฤ.,ศ.,ส.",
  },
];

const AlarmClock = ({ navigation, route }) => {
  const { cardId, cardImage, alarmsData } = route.params || {};

  const [selectedDays, setSelectedDays] = React.useState({});

  const handleDayPress = (itemId, day) => {
    const updatedDays = { ...selectedDays };
    if (updatedDays[itemId] && updatedDays[itemId].includes(day)) {
      updatedDays[itemId] = updatedDays[itemId].filter(
        (selectedDay) => selectedDay !== day
      );
    } else {
      updatedDays[itemId] = [...(updatedDays[itemId] || []), day];
    }
    setSelectedDays(updatedDays);
  };

  //************************************************** */
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    if (date) {
      setSelectedDate(date);
      hideDatePicker();
    }
  };

  //******************************* */
  const saveAlarm = async (hour, minute, selectedDays, cardId, navigation) => {
    try {
      await Database.initDatabase();

      // ตรวจสอบว่ามีวันที่ถูกเลือกหรือไม่
      if (Object.keys(selectedDays).length === 0) {
        // ถ้าไม่มีวันที่ถูกเลือก ให้แสดง Modal
        Alert.alert("โปรดเลือกวันด้วย", "กรุณาเลือกวันเพื่อตั้งนาฬิกาปลุก");
        return;
      }

      // สร้างวัตถุ DateTime จาก selectedDate
      const selectedDateTime = DateTime.fromJSDate(selectedDate, {
        zone: "Asia/Bangkok",
      });

      const currentDate = new Date();

      const scheduledTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        selectedDateTime.hour,
        selectedDateTime.minute
      );

      const newAlarmData = {
        hour: selectedDateTime.hour,
        minute: selectedDateTime.minute,
        selectedDays: Object.values(selectedDays),
        cardId: cardId,
      };

      await Database.saveAlarm(
        newAlarmData.hour,
        newAlarmData.minute,
        newAlarmData.selectedDays,
        newAlarmData.cardId
      );

      console.log("Alarm saved successfully:", newAlarmData);

      // Send data back to Alarmmain
      navigation.replace("Navigationmenu", {
        updatedAlarm: newAlarmData,
      });
    } catch (error) {
      console.error("Error saving alarm: ", error);
    }
  };

  useEffect(() => {
    if (alarmsData) {
      const alarmData = alarmsData.find((alarm) => alarm.cardId === cardId);
      if (alarmData) {
        setSelectedDays(alarmData.selectedDays || {});
        setSelectedDate(
          new Date().setHours(alarmData.hour || 0, alarmData.minute || 0)
        );
      }
    }
  }, [alarmsData, cardId]);

  return (
    //--------------------------------------------------------------------------------//
    <SafeAreaView style={styles.backgroundImage}>
      <View style={styles.headerView}>
        <TouchableOpacity
          style={styles.BackButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Icon name="chevron-back" size={24} color="#1b1b1b" type="ionicon" />
        </TouchableOpacity>
      </View>

      <View style={{ ...styles.itemContainer }}>
        <Card.Cover source={cardImage} style={styles.ViewcardImage} />

        <Card.Content>
          <Text style={{ ...styles.header, marginTop: 10 }}>
            ตั้งนาฬิกาปลุก
          </Text>

          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
              padding: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.TextdateTime }}>
              {selectedDate
                ? selectedDate.toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "No time selected"}{" "}
              น.
            </Text>

            <TouchableOpacity style={styles.button} onPress={showDatePicker}>
              <Text style={styles.buttonText}>เลือก</Text>
            </TouchableOpacity>
          </View>

          {data.map((item) => (
            <View key={item.id}>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 35,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {item.days.split(",").map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleDayPress(item.id, day.trim())}
                    style={[
                      styles.dayButton,
                      selectedDays[item.id] &&
                        selectedDays[item.id].includes(day.trim()) &&
                        styles.selectedDayButton,
                    ]}
                  >
                    <Text
                      style={{
                        ...styles.dayButtonText,
                        color:
                          selectedDays[item.id] &&
                          selectedDays[item.id].includes(day.trim())
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      {day.trim()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={{ ...styles.ButtonS }}
            onPress={() =>
              saveAlarm(
                selectedDate.getHours(),
                selectedDate.getMinutes(),
                selectedDays,
                cardId,
                navigation
              )
            }
          >
            <Text style={{ ...styles.buttonText }}>บันทึก</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            date={selectedDate}
            isVisible={datePickerVisible}
            mode="time"
            is24Hour={true}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            textColor="#000"
          />
        </Card.Content>
      </View>
    </SafeAreaView>
  );
  //--------------------------------------------------------------------------------//
};

const styles = StyleSheet.create({
  View: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerView: {
    padding: 8,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor: "rgba(234, 252, 255, 0.4)",
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: "white",
    marginBottom: 20,
    borderRadius: 25,
    shadowColor: "#000", // สีของเงา
    shadowOffset: { width: 0, height: 2 }, // ตำแหน่งเงา (x, y)
    shadowOpacity: 0.2, // ความทึบของเงา
    shadowRadius: 5, // รัศมีของเงา
    elevation: 5, // Android: การยกขึ้นจากพื้น
  },

  TextdateTime: {
    fontSize: 26,
    fontWeight: "bold",
    width: 250,
    marginLeft: 18,
    marginTop: 10,
    padding: 10,
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#66B8E6",
    padding: 15,
    margin: 6,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  dayButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#66B8E6",
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },

  selectedDayButton: {
    backgroundColor: "#2ecc71", // สีเมื่อถูกเลือก
  },
  dayButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  ButtonS: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#ade2ff",
    padding: 20,
    margin: 6,
    marginTop: 135,
    borderRadius: 10,
    width: "auto",
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 500,
  },

  ViewcardImage: {
    width: "auto",
    height: 200,
    margin: 7,
    marginBottom: 10,
    borderRadius: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
});

export default AlarmClock;
