import * as React from "react";
import { useState, useEffect } from "react";
import { StatusBar, Modal, View, Text, TouchableOpacity } from "react-native";
import {
  StyleSheet,
  Alert,
  TextInput as RNTextInput,
  SafeAreaView,
} from "react-native";
import {
  Button,
  TextInput,
  Provider as PaperProvider,
} from "react-native-paper";
import {
  getDatabase,
  ref,
  get,
} from "firebase/database";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Icon } from "react-native-elements";

const Sugargrade = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState("");
  const [maxsugar, setMaxsugar] = useState("");
  const [minsugar, setMinsugar] = useState("");

  const [resultsugar, setResultsugar] = useState("");
  const [error, setError] = useState("");

  const [modalLowVisible, setModalLowVisible] = useState(false);
  const [modalNormalVisible, setModalNormalVisible] = useState(false);

  const isFocused = useIsFocused();
  const auth = getAuth();

  const fetchUserDataByPhoneNumber = async () => {
    const userPhoneNumber = auth.currentUser.phoneNumber;

    if (userPhoneNumber) {
      const db = getDatabase();
      const usersRef = ref(db, "users");

      try {
        const usersSnapshot = await get(usersRef);

        if (usersSnapshot.exists()) {
          const users = usersSnapshot.val();
          const userKey = Object.keys(users).find(
            (key) => users[key].phoneNumber === userPhoneNumber
          );

          if (userKey) {
            const userData = users[userKey];
            return userData;
          } else {
            throw new Error("User not found");
          }
        } else {
          throw new Error("No users found");
        }
      } catch (error) {
        throw new Error("Error fetching user data: " + error.message);
      }
    } else {
      throw new Error("User phone number not available");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserDataByPhoneNumber();

        if (userData) {
          setUsername(userData.username || "");
          setMaxsugar(userData.maxsugar || "");
          setMinsugar(userData.minsugar || "");
        } else {
          setUsername("");
          setMaxsugar("");
          setMinsugar("");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      } else {
        // User is not logged in, navigate to login screen
        navigation.navigate("Login");
      }
    });

    return unsubscribe; // Cleanup the subscription when the component unmounts
  }, [isFocused, navigation]);

  const handleResult = () => {
    const inputValue = resultsugar;
    const minSugarValue = parseFloat(minsugar);
    const inputValueNumber = parseFloat(inputValue);

    if (inputValue.trim() === "") {
      setError("โปรดใส่ค่าน้ำตาลในเลือดที่วัดได้");
    } else if (!isNaN(minSugarValue) && !isNaN(inputValueNumber)) {
      if (inputValueNumber < minSugarValue) {
        setModalLowVisible(true);
        setError("");
      } else {
        setModalNormalVisible(true);
        setError("");
      }
    } else {
      setError("โปรดกรอกข้อมูลเฉพาะตัวเลข");
    }
  };

  return (
    <SafeAreaView style={styles.backgroundImage}>
      <TouchableOpacity
        style={styles.BackButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <Icon name="chevron-back" size={24} color="#1b1b1b" type="ionicon" />
      </TouchableOpacity>

      <View style={styles.View}>
        <View
          style={{
            ...styles.itemContainer,
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <Text style={styles.TextTitle}>ตรวจน้ำตาลในเลือด</Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "gray",
                marginTop: 30,
              }}
            >
              {minsugar !== null && minsugar !== ""
                ? minsugar
                : (userData && userData.minsugar) || "mg/dL"}
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "gray",
                marginTop: 30,
              }}
            >
              -
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "gray",
                marginTop: 30,
              }}
            >
              {maxsugar !== null && maxsugar !== ""
                ? maxsugar
                : (userData && userData.maxsugar) || "mg/dL"}
            </Text>
            <Text
              style={{ fontSize: 22, color: "gray", marginTop: 38, margin: 4 }}
            >
              {" "}
              mg/dL
            </Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: "gray",
              marginTop: 45,
              margin: 4,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            "
            เมื่อทำการตรวจน้ำตาลในเลือดแล้วกรุณากรอกข้อมูลน้ำตาลที่ได้วัดได้จากเครื่องเพื่อประเมิน
            "
          </Text>

          <TextInput
            placeholderTextColor="#A4A6A8"
            mode={"flat"}
            placeholder="mg/dL"
            style={{
              ...styles.inputForm,
              width: 250,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 25,
              borderColor: error ? "red" : "rgb(109, 162, 222)",
            }}
            labelStyle={styles.inputLabel}
            selectionColor="#88AED0"
            cursorColor="#88AED0"
            underlineColor="rgba(255, 255, 255, 0)"
            activeUnderlineColor="rgba(255, 255, 255, 0)"
            outlineColor="#88AED0"
            activeOutlineColor="#88AED0"
            textColor="#1b1b1b"
            height="90"
            value={resultsugar}
            onChangeText={(text) => {
              setResultsugar(text);
              setError("");
            }}
          />
          {error ? (
            <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={{ ...styles.ButtonS, width: 175, marginTop: 45 }}
            onPress={handleResult}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#003358",
                padding: 4,
              }}
            >
              ตรวจผล
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Section */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalNormalVisible}
        onRequestClose={() => {
          setModalNormalVisible(!modalNormalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ปกติ! คุณสามารถฉีดยาอินซูลินได้เลย
            </Text>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalNormalVisible(!modalNormalVisible);
                navigation.navigate("Graph");
              }}
            >
              <Text style={styles.textStyle}>ไปหน้าบันทึกตำแหน่ง</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalNormalVisible(!modalNormalVisible);
              }}
            >
              <Text style={styles.textStyle}>ยกเลิก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalLowVisible}
        onRequestClose={() => {
          setModalLowVisible(!modalLowVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
            อันตราย! โปรดเพิ่มน้ำตาลในเลือด และรอ 15 นาทีก่อนตรวจใหม่อีกครั้ง
            </Text>

            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalLowVisible(!modalLowVisible);
              }}
            >
              <Text style={styles.textStyle}>ยกเลิก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* End of Modal Section */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  View: {
    flex: 1,
    paddingBottom: 35,
    paddingTop: 35,
    width: "auto",
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
    width: "auto",
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
  inputForm: {
    fontSize: 20,
    backgroundColor: "rgb(255, 255, 255)",
    borderWidth: 2,
    borderColor: "rgb(109, 162, 222)",
    padding: 20,
    margin: 12,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    height: 25,
  },
  inputLabel: {
    color: "#88AED0",
    height: 50,
  },
  TextTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 16,
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
  // Styles for Modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 2,
    padding: 12,
    elevation: 2,
    marginVertical: 10,
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 500,
  },
  textStyle: {
    fontSize: 16,
    color: "white",
    //fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  // End of Styles for Modal
});

export default Sugargrade;
