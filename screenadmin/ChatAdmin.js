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

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
//--------------------------------------------------------------------------------//
import { getDatabase, ref, push, set, serverTimestamp,query, get,onValue ,orderByChild, equalTo} from "firebase/database";

import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import MessageList from "../components/MessageList";
import CustomKeybordView from "../components/CustomKeybordView";
import { Icon } from "react-native-elements";
import { FontAwesome5 } from '@expo/vector-icons';

const ChatAdmin = ({ navigation, route }) => {

  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    console.log("route.params in useEffect:", route.params);
    if (route.params && route.params.userData) {
      const { userData } = route.params;
      setUserData(userData);
  
      const db = getDatabase();
      const phoneNumber = userData.phoneNumber;  // ดึงเบอร์โทรศัพท์จาก userData
      const roomsRef = ref(db, `rooms/${phoneNumber}`);
  
      const unsubscribe = onValue(roomsRef, (snapshot) => {
        if (snapshot.exists()) {
          const roomsData = snapshot.val();
          const messagesArray = Object.values(roomsData);
          setMessages(messagesArray);
        } else {
          setMessages([]);
        }
      }, (error) => {
        console.error("Error fetching messages from rooms:", error);
      });
  
      return () => {
        // Cleanup function to unsubscribe when component unmounts
        unsubscribe();
      };
    }
  }, [route.params]);
  
  const sendMessage = async () => {
    try {
      if (messageText.trim() !== "") {
        console.log("messageText:", messageText);
  
        const auth = getAuth();
        const phoneNumber = userData.phoneNumber;  // ดึงเบอร์โทรศัพท์จาก userData
        console.log("phoneNumber:", phoneNumber);
  
        const db = getDatabase();
        const userRef = ref(db, `rooms/${phoneNumber}`);
        const newRoomRef = push(userRef);
  
        // Fetch username from userData
        const username = userData ? userData.username : "Unknown User";
        console.log("username:", username);
  
        const roomData = {
          messageText: messageText,
          username: "Admin",
          timestamp: serverTimestamp(),
        };
        console.log("roomData:", roomData);
  
        await set(newRoomRef, roomData);
        console.log("Message sent successfully");
  
        setMessageText("");  // Reset messageText to an empty string
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };
  

  return (
    <CustomKeybordView inChat={true}>
    <SafeAreaView style={styles.backgroundImage}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Icon name="chevron-back" size={24} color="#1b1b1b" type="ionicon" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          พูดคุยกับคุณ : {userData ? userData.username : "ไม่พบข้อมูล"}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <MessageList messages={messages} />
      </View>

      <View style={{ marginBottom: hp(2), paddingTop: 2 }}>
        <View style={styles.containerMe}>
        <TextInput
              style={styles.input}
              placeholder="ส่งข้อความ"
              value={messageText}
              onChangeText={(text) => setMessageText(text)}
            />
           <TouchableOpacity style={{...styles.MeButton}} onPress={sendMessage}>
           <FontAwesome5 name="location-arrow" size={30} color="#E6F4F1" />
           </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    </CustomKeybordView>
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
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  TextW: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    margin: 6,
  },
  InputForm: {
    elevation: 3,
    shadowColor: "#757575",
    fontFamily: "Prompt-Regular",
    backgroundColor: "#f2f2f2",
    margin: 6,
    width: 300,
  },
  inputLabel: {
    fontFamily: "Prompt-Regular",
    color: "#88AED0",
    height: 50,
  },
  ButtonS: {
    borderRadius: 15,
    backgroundColor: "#66B8E6",
    padding: 10,
    margin: 6,
    borderRadius: 10,
    shadowColor: "rgba(0, 0, 0, 0.4)", // สีของเงา
    shadowOffset: { width: 0, height: 4 }, // ตำแหน่งเงา (x, y)
    shadowOpacity: 0.5, // ความทึบของเงา
    shadowRadius: 6, // รัศมีของเงา
    elevation: 500, // Android: การยกขึ้นจากพื้น
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  backButton: {
    marginRight: 10,
  },
  TextName: {
    fontWeight: "bold",
    fontSize: 24,
    color: "rgba(255, 255, 255, 0.8)",
    margin: 8,
  },

  username: {
    fontWeight: "bold",
    color: "#1b1b1b",
    marginBottom: 4,
  },
  containerMe: {
    height: 75,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    padding: 8,
    borderColor: "#e2e8f0", // Neutral color with a shade or intensity of 300
    borderRadius: "200%", // A large value to make it a full circle
    paddingLeft: 20, // Padding on the left side
  },
  input: {
    fontSize: hp(2),
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    borderRadius: 10,
    margin: 2,
    marginStart:18,
    color: 'white', 
  },
  MeButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#66B8E6", 
    padding: 10, 
    marginRight: 1, 
    marginTop: 5,
    borderRadius: "200%",
  },

});

export default ChatAdmin;
