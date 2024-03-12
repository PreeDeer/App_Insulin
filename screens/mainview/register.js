import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  AppRegistry,
  ImageBackground,
  Pressable,
  ScrollView,
  Modal,
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
  List,
} from "react-native-paper";

import { getDatabase, ref, set, push } from "firebase/database";

import { Icon } from "react-native-elements";
import Constants from "expo-constants";

const Register = ({ navigation }) => {

  const [registeredUserId, setRegisteredUserId] = useState("");

  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [maxsugar, setmaxsugar] = useState("");
  const [minsugar, setminsugar] = useState("");
  const [insulinType, setInsulinType] = useState("");
  const [insulinUnits, setInsulinUnits] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  const insulinTypes = ["แอสพาร์ท อินซูลิน (โนโวแรปิด)","เรกุลาร์ อินซูลิน (แอคตร้าปิด) ","เอ็นพีเอ็ช (อินซูเลทาร์ต) ","ดีทีเมียร์ อินซูลิน (เลวีเมียร์)","อินซูลิน กลาร์จีน (แลนตัส)","มิกซ์ทาร์ด 30","โนโวมิกซ์ 30"];

  const handleDropdownPress = () => {
    setModalVisible(true);
  };

  const handleItemPress = (item) => {
    setInsulinType(item);
    setModalVisible(false);
  };

  const handleRegister = () => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    const formattedPhoneNumber = phoneNumber.startsWith("0")
      ? `+66${phoneNumber.substring(1)}`
      : phoneNumber;

    const userData = {
      username,
      phoneNumber: formattedPhoneNumber,
      gender,
      birthDate,
      weight,
      height,
      maxsugar,
      minsugar,
      insulinType,
      insulinUnits,
    };

    const newUserKey = push(usersRef).key;

    set(ref(db, `users/${newUserKey}`), userData)
      .then(() => {
        console.log("User registered and data stored in the database:", userData);
        setRegisteredUserId(newUserKey); 

        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Error storing user data:", error);
      });

    Alert.alert("ลงทะเบียนสำเร็จ", "เข้าสู่ระบบได้เลย.");
  };

  return (
    <ImageBackground
      source={require("../../assets/bg.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.backgroundImage}>
        <View style={styles.itemContainer}>
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.View}>
              <Text style={styles.Textheader}>สมัครสมาชิก</Text>
            </View>

            <Text style={styles.Textheader}>ข้อมูลส่วนตัว</Text>
            <Text style={styles.TextheaderTi}>ชื่อผู้ใช้ :</Text>
            <TextInput
              placeholderTextColor="#A4A6A8"
              mode={"flat"}
              placeholder="ชื่อ - สกุล"
              style={styles.inputForm}
              labelStyle={styles.inputLabel}
              selectionColor="#88AED0"
              cursorColor="#88AED0"
              underlineColor="rgba(255, 255, 255, 0)"
              activeUnderlineColor="rgba(255, 255, 255, 0)"
              outlineColor="#88AED0"
              activeOutlineColor="#88AED0"
              textColor="#1b1b1b"
              height="90"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
            <Text style={styles.TextheaderTi}>เบอร์โทรศัพท์ :</Text>
            <TextInput
              keyboardType="phone-pad"
              placeholderTextColor="#A4A6A8"
              mode={"flat"}
              placeholder="เบอร์โทรศัพท์"
              style={styles.inputForm}
              labelStyle={styles.inputLabel}
              selectionColor="#88AED0"
              cursorColor="#88AED0"
              underlineColor="rgba(255, 255, 255, 0)"
              activeUnderlineColor="rgba(255, 255, 255, 0)"
              outlineColor="#88AED0"
              activeOutlineColor="#88AED0"
              textColor="#1b1b1b"
              height="90"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
            />
            <Text style={styles.TextheaderTi}>เพศ :</Text>
            <TextInput
              placeholderTextColor="#A4A6A8"
              mode={"flat"}
              placeholder="เพศ"
              style={styles.inputForm}
              labelStyle={styles.inputLabel}
              selectionColor="#88AED0"
              cursorColor="#88AED0"
              underlineColor="rgba(255, 255, 255, 0)"
              activeUnderlineColor="rgba(255, 255, 255, 0)"
              outlineColor="#88AED0"
              activeOutlineColor="#88AED0"
              textColor="#1b1b1b"
              height="90"
              value={gender}
              onChangeText={(text) => setGender(text)}
            />

            <Text style={styles.TextheaderTi}>วันเกิด :</Text>
            <TextInput
              placeholderTextColor="#A4A6A8"
              mode={"flat"}
              placeholder="วัน/เดือน/ปีเกิด"
              style={styles.inputForm}
              labelStyle={styles.inputLabel}
              selectionColor="#88AED0"
              cursorColor="#88AED0"
              underlineColor="rgba(255, 255, 255, 0)"
              activeUnderlineColor="rgba(255, 255, 255, 0)"
              outlineColor="#88AED0"
              activeOutlineColor="#88AED0"
              textColor="#1b1b1b"
              height="90"
              value={birthDate}
              onChangeText={(text) => setBirthDate(text)}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <Text style={{ ...styles.TextheaderTi, width: 125, margin: 18 }}>
                น้ำหนัก :{" "}
              </Text>
              <Text style={{ ...styles.TextheaderTi, width: 125, margin: 18 }}>
                ส่วนสูง :{" "}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <TextInput
                placeholderTextColor="#A4A6A8"
                mode={"flat"}
                placeholder="น้ำหนัก"
                style={{ ...styles.inputForm, width: 125 }}
                labelStyle={styles.inputLabel}
                selectionColor="#88AED0"
                cursorColor="#88AED0"
                underlineColor="rgba(255, 255, 255, 0)"
                activeUnderlineColor="rgba(255, 255, 255, 0)"
                outlineColor="#88AED0"
                activeOutlineColor="#88AED0"
                textColor="#1b1b1b"
                height="90"
                value={weight}
                onChangeText={(text) => setWeight(text)}
              />

              <TextInput
                placeholderTextColor="#A4A6A8"
                mode={"flat"}
                placeholder="ส่วนสูง"
                style={{ ...styles.inputForm, width: 125 }}
                labelStyle={styles.inputLabel}
                selectionColor="#88AED0"
                cursorColor="#88AED0"
                underlineColor="rgba(255, 255, 255, 0)"
                activeUnderlineColor="rgba(255, 255, 255, 0)"
                outlineColor="#88AED0"
                activeOutlineColor="#88AED0"
                textColor="#1b1b1b"
                height="90"
                value={height}
                onChangeText={(text) => setHeight(text)}
              />
            </View>

            <Text style={styles.Textheader}>ข้อมูลรักษา</Text>
            <Text style={styles.TextheaderTi}>ระดับน้ำตาลในเลือด</Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <TextInput
                placeholderTextColor="#A4A6A8"
                mode={"flat"}
                placeholder="mg/dL"
                style={{ ...styles.inputForm, width: 125 }}
                labelStyle={styles.inputLabel}
                selectionColor="#88AED0"
                cursorColor="#88AED0"
                underlineColor="rgba(255, 255, 255, 0)"
                activeUnderlineColor="rgba(255, 255, 255, 0)"
                outlineColor="#88AED0"
                activeOutlineColor="#88AED0"
                textColor="#1b1b1b"
                height="90"
                value={minsugar}
                onChangeText={(text) => setminsugar(text)}
              />
              <Text style={{ ...styles.Textheader, paddingTop: 20 }}> - </Text>
              <TextInput
                placeholderTextColor="#A4A6A8"
                mode={"flat"}
                placeholder="mg/dL"
                style={{ ...styles.inputForm, width: 125 }}
                labelStyle={styles.inputLabel}
                selectionColor="#88AED0"
                cursorColor="#88AED0"
                underlineColor="rgba(255, 255, 255, 0)"
                activeUnderlineColor="rgba(255, 255, 255, 0)"
                outlineColor="#88AED0"
                activeOutlineColor="#88AED0"
                textColor="#1b1b1b"
                height="90"
                value={maxsugar}
                onChangeText={(text) => setmaxsugar(text)}
              />
            </View>

            <Text style={styles.label}>โปรดเลือกชนิดยาอินซูลิน</Text>
            <TextInput
              right={
                <TextInput.Icon
                  icon={({ size, color }) => (
                    <List.Icon icon="menu-down" color={color} size={size} />
                  )}
                  onPress={handleDropdownPress}
                  style={{ marginTop: 45, marginRight: 15 }}
                />
              }
              placeholderTextColor="#A4A6A8"
              mode="flat"
              placeholder="โปรดเลือกชนิดยาอินซูลิน"
              style={styles.inputForm}
              labelStyle={styles.inputLabel}
              selectionColor="#88AED0"
              cursorColor="#88AED0"
              underlineColor="rgba(255, 255, 255, 0)"
              activeUnderlineColor="rgba(255, 255, 255, 0)"
              outlineColor="#88AED0"
              activeOutlineColor="#88AED0"
              textColor="#1b1b1b"
              height={90}
              value={insulinType}
              onChangeText={(text) => setInsulinType(text)}
            />

            <Text style={styles.TextheaderTi}>จำนวนยูนิต</Text>
            <TextInput
              placeholderTextColor="#A4A6A8"
              mode={"flat"}
              placeholder="จำนวนยูนิต"
              style={styles.inputForm}
              labelStyle={styles.inputLabel}
              selectionColor="#88AED0"
              cursorColor="#88AED0"
              underlineColor="rgba(255, 255, 255, 0)"
              activeUnderlineColor="rgba(255, 255, 255, 0)"
              outlineColor="#88AED0"
              activeOutlineColor="#88AED0"
              textColor="#1b1b1b"
              height="90"
              value={insulinUnits}
              onChangeText={(text) => setInsulinUnits(text)}
            />
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.ButtonS} onPress={handleRegister}>
          <Text style={styles.buttonText}>สมัครสมาชิก</Text>
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.View}>
              <FlatList
                data={insulinTypes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemModal}
                    onPress={() => handleItemPress(item)}
                  >
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ marginLeft: 250 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
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
    alignItems: "center",
  },
  Textheader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 16,
    marginTop: 8,
    margin: 18,
  },
  TextheaderTi: {
    fontSize: 18,
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 1,
    marginTop: 8,
    margin: 18,
  },
  inputForm: {
    backgroundColor: "rgb(255, 255, 255)",
    borderColor: "gray",
    borderWidth: 1,
    padding: 20,
    margin: 12,
    borderTopLeftRadius: "200%",
    borderTopRightRadius: "200%",
    borderBottomLeftRadius: "200%",
    borderBottomRightRadius: "200%",
    width: 300,
    height: 25,
  },
  inputLabel: {
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
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 500,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: 300,
  },

  itemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    padding: 30,
    paddingHorizontal: 3,
    backgroundColor: "white",
    borderRadius: 25,
    shadowColor: "#000", // สีของเงา
    shadowOffset: { width: 0, height: 2 }, // ตำแหน่งเงา (x, y)
    shadowOpacity: 0.2, // ความทึบของเงา
    shadowRadius: 5, // รัศมีของเงา
    elevation: 5, // Android: การยกขึ้นจากพื้น
  },
  modalContainer: {
    flex: 1,
    width: "auto",
    margin: 30,
    marginTop: 100,
    marginBottom: 100,
    padding: 18,
    paddingHorizontal: 3,
    backgroundColor: "white",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  itemModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    padding: 18,
    paddingHorizontal: 3,
  },
  itemText: {
    fontSize: 18,
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 1,
    marginTop: 8,
  },
});

export default Register;
