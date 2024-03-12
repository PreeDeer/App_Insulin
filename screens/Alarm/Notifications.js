import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
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
  FlatList,
} from "react-native";

import {
  Button,
  TextInput,
  Avatar,
  Provider as PaperProvider,
  DefaultTheme,
  configureFonts,
  MD2LightTheme,
} from "react-native-paper";

//--------------------------------------------------------------------------------//
import { Icon } from "react-native-elements";

const Notifications = ({ navigation, route }) => {
  const [sound, setSound] = React.useState();

  const playSound = async () => {
    if (!sound) {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/music/alarm.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };
  
  return (
    <SafeAreaView source={require("../../assets/bgNoi.png")} style={styles.backgroundImage}>
      <View>
        {/* Add a button to stop the alarm */}
        <TouchableOpacity style={styles.stopButton} onPress={stopSound}>
          <Text style={styles.buttonText}>Stop Alarm</Text>
        </TouchableOpacity>
      </View>
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
    resizeMode: "cover", // ให้รูปภาพปรับขนาดเพื่อครอบคลุมพื้นที่ทั้งหมด
    justifyContent: "center", // ให้ UI อยู่กึ่งกลาง
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemContainer: {
    flex: 1,
    margin: 18,
    padding: 30,
    paddingHorizontal: 3,
    backgroundColor: "white",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  stopButton: {
    borderRadius: 15,
    backgroundColor: "#FF0000", // Red color for stop button
    padding: 10,
    margin: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Notifications;
