import * as React from "react";
import { useState, useEffect } from "react";

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
  Card,
} from "react-native-paper";

//--------------------------------------------------------------------------------//
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { Icon } from "react-native-elements";

const Proflie = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);

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
          throw aError("No users found");
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
          setPhoneNumber(userData.phoneNumber || "");
          setGender(userData.gender || "");
          setBirthDate(userData.birthDate || "");
          setWeight(userData.weight || "");
          setHeight(userData.height || "");
          setmaxsugar(userData.maxsugar || "");
          setminsugar(userData.minsugar || "");
          setInsulinType(userData.insulinType || "");
          setInsulinUnits(userData.insulinUnits || "");
        } else {
          setUsername("");
          setPhoneNumber("");
          setGender("");
          setBirthDate("");
          setWeight("");
          setHeight("");
          setmaxsugar("");
          setminsugar("");
          setInsulinType("");
          setInsulinUnits("");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      } else {
        navigation.navigate("Login"); 
      }
    });

    return unsubscribe; 
  }, [isFocused, navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login"); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    //--------------------------------------------------------------------------------//
    <SafeAreaView style={styles.backgroundImage}>
      <TouchableOpacity
        style={styles.BackButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <Icon name="chevron-back" size={24} color="#1b1b1b" type="ionicon" />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <View style={{ ...styles.itemContainer }}>
          <Text style={styles.Textheader}>ข้อมูลส่วนตัว</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.Textmain }}>ชื่อ : </Text>
            <Text style={styles.Textdata}>
              {" "}
              {username !== null && username !== ""
                ? username
                : (userData && userData.username) || "ชื่อ-สกุล"}{" "}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.Textmain }}>เพศ : </Text>
            <Text style={styles.Textdata}>
              {" "}
              {gender !== null && gender !== ""
                ? gender
                : (userData && userData.gender) || "เพศ"}{" "}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.Textmain }}>วันเดือนปีเกิด : </Text>
            <Text style={styles.Textdata}>
              {" "}
              {birthDate !== null && birthDate !== ""
                ? birthDate
                : (userData && userData.birthDate) || "วันเดือนปีเกิด"}{" "}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.Textmain }}>น้ำหนัก : </Text>
            <Text style={styles.Textdata}>
              {" "}
              {weight !== null && weight !== ""
                ? weight
                : (userData && userData.weight) || "น้ำหนัก"}{" "}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.Textmain }}>ส่วนสูง : </Text>
            <Text style={styles.Textdata}>
              {" "}
              {height !== null && height !== ""
                ? height
                : (userData && userData.height) || "ส่วนสูง"}{" "}
            </Text>
          </View>
          <Text style={styles.Textheader}>ข้อมูลการรักษา</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.Textmain }}>ค่าน้ำตาลในเลือด : </Text>
            <Text style={styles.Textdata}>
              {minsugar !== null && minsugar !== ""
                ? minsugar
                : (userData && userData.minsugar) || "mg/dL"}
            </Text>
            <Text style={styles.Textdata}>-</Text>
            <Text style={styles.Textdata}>
              {maxsugar !== null && maxsugar !== ""
                ? maxsugar
                : (userData && userData.maxsugar) || "mg/dL"}
            </Text>
            <Text style={styles.Textdata}>mg/dL</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.Textmain }}>ชนิดยาอินซูลิน : </Text>
            <Text style={styles.Textdata}>
              {insulinType !== null && insulinType !== ""
                ? insulinType
                : (userData && userData.insulinType) || "ชนิดยาอินซูลิน"}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.Textmain }}>จำนวนยูนิต : </Text>
            <Text style={styles.Textdata}>
              {insulinUnits !== null && insulinUnits !== ""
                ? insulinUnits
                : (userData && userData.insulinUnits) || "จำนวน ... ยูนิต"}
            </Text>
            <Text style={styles.Textdata}>ยูนิต</Text>
          </View>

          <View style={{ ...styles.View }}>
            <TouchableOpacity
              style={styles.LogoutButton}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <Text style={styles.LogoutButtonText}>ออกจากระบบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
  //--------------------------------------------------------------------------------//
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
  Textheader: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 16,
  },
  Textmain: {
    marginLeft: 18,
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 16,
  },
  Textdata: {
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.6)",
    marginBottom: 16,
  },
  LogoutButton: {
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#66B8E6",
    borderRadius: 5,
    padding: 8,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 500,
  },
  LogoutButtonText: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Proflie;
