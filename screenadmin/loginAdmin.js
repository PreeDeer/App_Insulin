import * as React from "react";

//import { useState, useRef } from "react";
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
  AppRegistry,
  ImageBackground,
  Pressable,
  Modal,
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

import {
  get,
  ref,
  query,
  orderByChild,
  equalTo,
  getDatabase,
} from "firebase/database";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import { initializeApp, getApp } from "firebase/app";
import { Icon } from "react-native-elements";
import { FontAwesome5 } from "@expo/vector-icons";

const loginAdmin = ({ navigation, route }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const auth = getAuth();

  const handleLoginAdmin = async () => {
    //navigation.navigate('HomeAdmin');
    try {
      // ตรวจสอบว่าอีเมลและรหัสผ่านไม่ว่าง
      if (!email || !password) {
        Alert.alert("กรุณากรอกอีเมลและรหัสผ่าน");
        return;
      }
  
      // ทำการล็อกอินด้วย email และ password ที่ผู้ใช้กรอก
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      // หากล็อกอินสำเร็จ
      const user = userCredential.user;
      console.log('เข้าสู่ระบบสำเร็จ:', user.uid);
  
      // Pass adminEmail to the HomeAdmin screen using navigation parameters
      navigation.navigate('HomeAdmin', { email});
  
    } catch (error) {
      Alert.alert('เข้าสู่ระบบล้มเหลว:', error.message);
    }
  };
  

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.backgroundImage}>
        <View style={styles.View}>
          <Text style={styles.Textheader}>Login</Text>

          <TextInput
            left={<TextInput.Icon icon="account" disabled />}
            autoFocus
            autoCompleteType="text"
            placeholderTextColor="#A4A6A8"
            mode={"flat"}
            placeholder="e-mail"
            placeholderStyle={styles.InputForm}
            style={styles.InputForm}
            labelStyle={styles.inputLabel}
            value={email}
            onChangeText={(email) => setEmail(email)}
            selectionColor="#88AED0"
            cursorColor="#88AED0"
            underlineColor="rgba(255, 255, 255, 0)"
            activeUnderlineColor="rgba(255, 255, 255, 0)"
            outlineColor="#88AED0"
            activeOutlineColor="#88AED0"
            textColor="#1b1b1b"
            height="90"
          />
          <TextInput
            left={<TextInput.Icon icon="lock" disabled />}
            autoFocus
            autoCompleteType="password"
            secureTextEntry={true}
            placeholderTextColor="#A4A6A8"
            mode={"flat"}
            placeholder="รหัสผ่าน"
            placeholderStyle={styles.InputForm}
            style={styles.InputForm}
            labelStyle={styles.inputLabel}
            value={password}
            onChangeText={(password) => setPassword(password)}
            selectionColor="#88AED0"
            cursorColor="#88AED0"
            underlineColor="rgba(255, 255, 255, 0)"
            activeUnderlineColor="rgba(255, 255, 255, 0)"
            outlineColor="#88AED0"
            activeOutlineColor="#88AED0"
            textColor="#1b1b1b"
            height="90"
          />

          <TouchableOpacity style={styles.ButtonS} onPress={handleLoginAdmin}>
            <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
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
  InputForm: {
    elevation: 3,
    shadowColor: "#757575",
    fontFamily: "Prompt-Regular",
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    margin: 6,
    width: 300,
  },
  inputLabel: {
    fontFamily: "Prompt-Regular",
    color: "#88AED0",
    height: 50,
  },
  ButtonS: {
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#ade2ff",
    padding: 20,
    margin: 6,
    borderRadius: 10,
    width: 300,
    shadowColor: "rgba(0, 0, 0, 0.4)", // สีของเงา
    shadowOffset: { width: 0, height: 4 }, // ตำแหน่งเงา (x, y)
    shadowOpacity: 0.5, // ความทึบของเงา
    shadowRadius: 6, // รัศมีของเงา
    elevation: 500, // Android: การยกขึ้นจากพื้น
  },
  Textheader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default loginAdmin;
