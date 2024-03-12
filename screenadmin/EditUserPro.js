import * as React from "react";
import { useState, useEffect } from "react";

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

import { Icon } from "react-native-elements";
import Constants from "expo-constants";

import {
  get,
  ref,
  query,
  orderByChild,
  equalTo,
  getDatabase,
  update,
} from "firebase/database";

//--------------------------------------------------------------------------------//
import { useNavigation, useIsFocused } from "@react-navigation/native";

const EditUserPro = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const insulinTypes = [
    "แอสพาร์ท อินซูลิน (โนโวแรปิด)",
    "เรกุลาร์ อินซูลิน (แอคตร้าปิด) ",
    "เอ็นพีเอ็ช (อินซูเลทาร์ต) ",
    "ดีทีเมียร์ อินซูลิน (เลวีเมียร์)",
    "อินซูลิน กลาร์จีน (แลนตัส)",
    "มิกซ์ทาร์ด 30",
    "โนโวมิกซ์ 30",
  ];

  useEffect(() => {
    if (route.params && route.params.userData) {
      setUserData(route.params.userData);

      const fetchData = async () => {
        try {
          const db = getDatabase();
          const usersRef = ref(db, "users");

          const usersSnapshot = await get(usersRef);

          if (usersSnapshot.exists()) {
            const usersData = usersSnapshot.val();
            const userId = route.params.userData.username;

            // ใช้ Object.keys เพื่อเข้าถึงข้อมูลของทุก user
            Object.keys(usersData).forEach((key) => {
              const user = usersData[key];
              if (user.username === userId) {
                setUsername(user.username || "");
                setPhoneNumber(user.phoneNumber || "");
                setGender(user.gender || "");
                setBirthDate(user.birthDate || "");
                setWeight(user.weight || "");
                setHeight(user.height || "");
                setmaxsugar(user.maxsugar || "");
                setminsugar(user.minsugar || "");
                setInsulinType(user.insulinType || "");
                setInsulinUnits(user.insulinUnits || "");
                return; // หากเจอ user ที่ตรงกันแล้วให้ออกจาก loop
              }
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          // Set loading to false once data is fetched
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [route.params]);

  const handleDropdownPress = () => {
    setModalVisible(true);
  };

  const handleItemPress = (item) => {
    setInsulinType(item);
    setModalVisible(false);
  };

  const handleSavePro = async () => {
    try {
      if (
        !username.trim() &&
        !phoneNumber.trim() &&
        !gender.trim() &&
        !birthDate.trim() &&
        !weight.trim() &&
        !height.trim() &&
        !maxsugar.trim() &&
        !minsugar.trim() &&
        !insulinType.trim() &&
        !insulinUnits.trim()
      ) {
        console.log('No changes to update.');
        Alert.alert('ไม่มีการเปลี่ยนแปลง', 'กรุณากรอกข้อมูลที่ต้องการเปลี่ยน');
        return;
      }
  
      const db = getDatabase();
      const usersRef = ref(db, 'users');
      const userQuery = query(usersRef, orderByChild('phoneNumber'), equalTo(phoneNumber));
      const userSnapshot = await get(userQuery);
  
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const userKey = Object.keys(userData)[0];
        const userRef = ref(db, `users/${userKey}`);
  
        const updatedData = {};
        if (username.trim()) {
          updatedData.username = username;
        }
  
        await update(userRef, updatedData);
  
        console.log('User data updated successfully:', updatedData);
        Alert.alert('บันทึกข้อมูลสำเร็จ', 'ข้อมูลถูกบันทึกเรียบร้อย');
        
        // Send the updated data back to the parent component
        navigation.navigate('HomeAdmin', { updatedData });
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('ผิดพลาด', 'มีข้อผิดพลาดในการปรับปรุงข้อมูลผู้ใช้');
    }
  };
  
  
  
  return (
    //--------------------------------------------------------------------------------//
    <SafeAreaView style={styles.backgroundImage}>
      <View style={styles.itemContainer}>
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.View}>
            <Text style={styles.Textheader}>ข้อมูลผู้ใช้งาน</Text>
          </View>

          <Text style={styles.Textheader}>ข้อมูลส่วนตัว</Text>
          <Text style={styles.TextheaderTi}>ชื่อผู้ใช้ :</Text>
          <TextInput
            right={
              <TextInput.Icon
                icon="pencil"
                color="#757575"
                style={{ marginTop: 45 }} // ปรับตำแหน่งตามที่ต้องการ
              />
            }
            placeholderTextColor="#A4A6A8"
            mode={"flat"}
            placeholder={userData ? userData.username : "ไม่พบข้อมูล"}
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
            right={
              <TextInput.Icon
                icon="pencil"
                color="#757575"
                style={{ marginTop: 45 }} // ปรับตำแหน่งตามที่ต้องการ
              />
            }
            keyboardType="phone-pad"
            placeholderTextColor="#A4A6A8"
            mode={"flat"}
            placeholder={userData ? userData.phoneNumber : "ไม่พบข้อมูล"}
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
            right={
              <TextInput.Icon
                icon="pencil"
                color="#757575"
                style={{ marginTop: 45 }} // ปรับตำแหน่งตามที่ต้องการ
              />
            }
            placeholderTextColor="#A4A6A8"
            mode={"flat"}
            placeholder={userData ? userData.gender : "ไม่พบข้อมูล"}
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
            right={
              <TextInput.Icon
                icon="pencil"
                color="#757575"
                style={{ marginTop: 45 }} // ปรับตำแหน่งตามที่ต้องการ
              />
            }
            placeholderTextColor="#A4A6A8"
            mode={"flat"}
            placeholder={userData ? userData.birthDate : "ไม่พบข้อมูล"}
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
              right={
                <TextInput.Icon
                  icon="pencil"
                  color="#757575"
                  style={{ marginTop: 45 }} // ปรับตำแหน่งตามที่ต้องการ
                />
              }
              placeholderTextColor="#A4A6A8"
              mode={"flat"}
              placeholder={userData ? userData.weight : "ไม่พบข้อมูล"}
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
              right={
                <TextInput.Icon
                  icon="pencil"
                  color="#757575"
                  style={{ marginTop: 45 }} // ปรับตำแหน่งตามที่ต้องการ
                />
              }
              placeholderTextColor="#A4A6A8"
              mode={"flat"}
              placeholder={userData ? userData.height : "ไม่พบข้อมูล"}
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
              right={
                <TextInput.Icon
                  icon="pencil"
                  color="#757575"
                  style={{ marginTop: 45 }} // ปรับตำแหน่งตามที่ต้องการ
                />
              }
              placeholderTextColor="#A4A6A8"
              mode={"flat"}
              placeholder={userData ? userData.minsugar : "mg/dL"}
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
              right={
                <TextInput.Icon
                  icon="pencil"
                  color="#757575"
                  style={{ marginTop: 45 }} // ปรับตำแหน่งตามที่ต้องการ
                />
              }
              placeholderTextColor="#A4A6A8"
              mode={"flat"}
              placeholder={userData ? userData.maxsugar : "mg/dL"}
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
            placeholder={userData ? userData.insulinType : "ไม่พบข้อมูล"}
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
            right={
              <TextInput.Icon
                icon="pencil"
                color="#757575"
                style={{ marginTop: 45 }} // ปรับตำแหน่งตามที่ต้องการ
              />
            }
            placeholderTextColor="#A4A6A8"
            mode={"flat"}
            placeholder={userData ? userData.insulinUnits : "ไม่พบข้อมูล"}
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
      <TouchableOpacity style={styles.ButtonS} onPress={handleSavePro}>
        <Text style={styles.buttonText}>บันทึกการแก้ไข</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
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
  );
  //--------------------------------------------------------------------------------//
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
    backgroundColor: "#fff",
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
    borderWidth: 2,
    borderColor: "#66B8E6",
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

export default EditUserPro;
