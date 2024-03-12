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
  Modal
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
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword
} from "firebase/auth";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import { initializeApp, getApp } from "firebase/app";
import { Icon } from "react-native-elements";
import { FontAwesome5 } from '@expo/vector-icons';
//--------------------------------------------------------------------------------//

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = React.useState();
  const auth = getAuth();
  const app = getApp();
  const recaptchaVerifier = React.useRef(null);
  const [verificationId, setVerificationId] = React.useState();

  const firebaseConfig = app ? app.options : undefined;
  const [message, showMessage] = React.useState();
  const attemptInvisibleVerification = true;

  const handleLogin = async () => {
    //navigation.navigate('Home');
    // Check if the phone number exists in the 'users' database
    const phoneNumberExists = await checkPhoneNumberExists(phoneNumber);
    const formattedPhoneNumber = phoneNumber.startsWith("0")
      ? `+66${phoneNumber.substring(1)}`
      : phoneNumber;

    if (phoneNumberExists) {
      try {
        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
          formattedPhoneNumber,
          recaptchaVerifier.current
        );
        setVerificationId(verificationId);
        navigation.replace("OTP", {
          verificationId,
          auth,
          phoneNumber: formattedPhoneNumber,
        });
      } catch (err) {
        Alert.alert("Verification Error", `Error: ${err.message}`);
      }
    } else {
      Alert.alert(
        "หมายเลขดังกล่าวยังไม่ถูกลงทะเบียน",
        "ไม่พบบัญชีผู้ใช้ กรุณาสมัครสมาชิก."
      );
    }
  };

  const checkPhoneNumberExists = async (phoneNumber) => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    try {
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const phoneNumbers = Object.values(userData).map(
          (user) => user.phoneNumber
        );

        // Check if the phone number or its formatted version exists
        return (
          phoneNumbers.includes(phoneNumber) ||
          phoneNumbers.includes(`+66${phoneNumber.substring(1)}`)
        );
      }

      return false;
    } catch (error) {
      console.error("Error checking phone number:", error);
      return false; // Assume phone number doesn't exist on error
    }
  };

  const handleSignUp = () => {
    // ทำตามที่คุณต้องการเมื่อคลิกที่ลิงก์สมัครสมาชิก
    console.log("Redirecting to sign-up screen");
    navigation.navigate("Register");
  };
  //--------------------------------------------------------------------------------//

  const handleLogigAdmin = () => {
    console.log("Navigating to loginAdmin");
    navigation.navigate("loginAdmin");
  };

  return (
    <ImageBackground
      source={require("../../assets/bg.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.backgroundImage}>
        
        <TouchableOpacity
          style={styles.BackButton}
          onPress={handleLogigAdmin}
        >
          <FontAwesome5 name="address-card" size={24} color="#374955" />
        </TouchableOpacity>


        <View style={styles.View}>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={app.options}
          />

          <Text style={styles.Textheader}>Login</Text>

          <TextInput
            left={<TextInput.Icon icon="phone" disabled />}
            keyboardType="phone-pad"
            autoFocus
            autoCompleteType="tel"
            placeholderTextColor="#A4A6A8"
            mode={"flat"}
            placeholder="เบอร์โทรศัพท์"
            placeholderStyle={styles.InputForm}
            style={styles.InputForm}
            labelStyle={styles.inputLabel}
            value={phoneNumber}
            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
            selectionColor="#88AED0"
            cursorColor="#88AED0"
            underlineColor="rgba(255, 255, 255, 0)"
            activeUnderlineColor="rgba(255, 255, 255, 0)"
            outlineColor="#88AED0"
            activeOutlineColor="#88AED0"
            textColor="#1b1b1b"
            height="90"
          />

          <TouchableOpacity
            style={styles.ButtonS}
            disabled={!phoneNumber}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>

          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Text style={styles.signUpLink}>
              หากท่านยังไม่สมัครบัญชีผู้ใช้งาน
            </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLinkBt}>โปรดคลิ๊กสมัครที่นี่</Text>
            </TouchableOpacity>
          </View>
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
    resizeMode: "cover", // ให้รูปภาพปรับขนาดเพื่อครอบคลุมพื้นที่ทั้งหมด
    justifyContent: "center",
  },
  Textheader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 16,
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
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  BackButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(255, 255, 255, 0.8)", 
    width: 45,
    height: 45,
    zIndex: 1,
  },
  
  signUpLink: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.8)",
    marginTop: 18,
  },
  signUpLinkBt: {
    fontSize: 14,
    color: "rgba(0, 87, 174, 1)",
    marginTop: 18,
    margin: 6,
  },
});

export default Login;
