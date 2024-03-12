import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  AppRegistry,
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
} from "react-native-paper";

import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import Constants from "expo-constants";

import bgImg from "../../assets/bg.png";

const OTP = ({ navigation, route }) => {
  const [verificationCode, setVerificationCode] = React.useState("");
  const [message, showMessage] = React.useState();
  const attemptInvisibleVerification = true;

  const auth = route.params.auth;
  const verificationId = route.params.verificationId;
  const phoneNumber = route.params.phoneNumber;

  // Function to resend OTP
  const resendOtp = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const newVerificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      showMessage({ text: "OTP sent successfully" });
      setVerificationId(newVerificationId);
    } catch (err) {
      showMessage({ text: `Error: ${err.message}`, color: "red" });
    }
  };

  return (
    <ImageBackground source={bgImg} style={styles.backgroundStyle}>
      <View style={styles.View}>
        
        <TextInput
          left={<TextInput.Icon icon="email-receive-outline" disabled />}
          keyboardType="number-pad"
          placeholderTextColor="#A4A6A8"
          mode={"flat"}
          placeholder="ใส่ OTP ที่ได้รับ"
          placeholderStyle={styles.InputForm}
          style={styles.InputForm}
          labelStyle={styles.inputLabel}
          selectionColor="#88AED0"
          cursorColor="#88AED0"
          underlineColor="rgba(255, 255, 255, 0)"
          activeUnderlineColor="rgba(255, 255, 255, 0)"
          outlineColor="#88AED0"
          activeOutlineColor="#88AED0"
          textColor="#1b1b1b"
          height="90"
          onChangeText={setVerificationCode}
        />

        
        <Button
          mode="elevated"
          style={styles.LoginButton}
          labelStyle={styles.LoginButtonLabel}
          onPress={async () => {
            try {
              const credential = PhoneAuthProvider.credential(
                verificationId,
                verificationCode
              );
              await signInWithCredential(auth, credential);
              //Alert.alert('ยินดีต้อนรับเข้าสู่ระบบ');
              //showMessage({ text: "ยินดีต้อนรับเข้าสู่ระบบ" });
              navigation.replace("Navigationmenu", { phoneNumber });
            } catch (err) {
              if (err.code === "auth/code-expired") {
                Alert.alert('รหัสOTPมีปัญหา', `โปรดกดส่งรหัสOTPใหม่อีกครั้ง`);
              } else {
                Alert.alert("การยืนยันด้วยรหัสOTPไม่สำเร็จ", `Error: ${err.message}`);
              }
            }
          }}
        >
          เข้าสู่ระบบ
        </Button>
        <Text style={styles.textBtn} onPress={resendOtp}>
          ยังไม่ได้รับ OTP? คลิกที่นี่
        </Text>
        {message ? (
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { justifyContent: "center" }]}
            onPress={() => showMessage(undefined)}
          >
            <Text
              style={{
                color: message.color || "blue",
                fontSize: 17,
                textAlign: "center",
                margin: 20,
              }}
            >
              {message.text}
            </Text>
          </TouchableOpacity>
        ) : undefined}
            {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      </View>
    </ImageBackground>
  );
};

const styles = {
  backgroundStyle: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  View: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  InputForm: {
    elevation: 3,
    shadowColor: '#757575',
    fontFamily: 'Prompt-Regular',
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    margin: 6,
    width: 300,
  },
  LoginButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ade2ff",
    margin: 8,
    borderRadius: 10,
    width: 300,
    height: 65,
    shadowColor: "rgba(0, 0, 0, 0.4)", // สีของเงา
    shadowOffset: { width: 0, height: 4 }, // ตำแหน่งเงา (x, y)
    shadowOpacity: 0.5, // ความทึบของเงา
    shadowRadius: 6, // รัศมีของเงา
    elevation: 500, // Android: การยกขึ้นจากพื้น
  },
  LoginButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Prompt-Bold",
    verticalAlign: "middle",
    color: "#fff",
  },
  textBtn: {
    color: "#88AED0",
    fontFamily: "Prompt-Regular",
  },
};

export default OTP;
