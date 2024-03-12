import * as React from 'react';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
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
  Dimensions,
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

import Constants from 'expo-constants';
import { getDatabase, ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { getAuth, PhoneAuthProvider, signInWithCredential, onAuthStateChanged, signOut } from "firebase/auth";
import { TextInput as RNTextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { Icon } from "react-native-elements";

const items = [
  {
    id: 1,
    name: "ประเมินน้ำตาลในเลือดสูง",
    boutton: "คลิ๊กที่นี่",
    image: require("../../assets/images/1.png"),
    component: 'HyperAaugeI',
  },
  {
    id: 2,
    name: "ประเมินน้ำตาลในเลือดต่ำ",
    boutton: "คลิ๊กที่นี่",
    image: require("../../assets/images/2.png"),
    component: 'HypoAaugeI',
  },
  {
    id: 3,
    name: "วัดระดับน้ำตาลในเลือด",
    boutton: "คลิ๊กที่นี่",
    image: require("../../assets/images/3.png"),
    component: 'Sugargrade',
  },
  {
    id: 4,
    name: "ปรึกษากับคุณหมอ",
    boutton: "คลิ๊กที่นี่",
    image: require("../../assets/images/4.png"),
    component: 'Chatusers',

  },
];

const Home = ({ navigation,route }) => {
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
      const usersRef = ref(db, 'users');

      try {
        const usersSnapshot = await get(usersRef);

        if (usersSnapshot.exists()) {
          const users = usersSnapshot.val();
          const userKey = Object.keys(users).find(key => users[key].phoneNumber === userPhoneNumber);

          if (userKey) {
            const userData = users[userKey];
            //
            userData.userID = userKey;
            return userData;
          } else {
            throw new Error('User not found');
          }
        } else {
          throw aError('No users found');
        }
      } catch (error) {
        throw new Error('Error fetching user data: ' + error.message);
      }
    } else {
      throw new Error('User phone number not available');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserDataByPhoneNumber();

        if (userData) {
          userData.userID = auth.currentUser.uid;
          setUserData(userData);
          
          setUsername(userData.username || '');
          setPhoneNumber(userData.phoneNumber || '');
          setGender(userData.gender || '');
          setBirthDate(userData.birthDate || '');
          setWeight(userData.weight || '');
          setHeight(userData.height || '');
          setmaxsugar(userData.maxsugar || '');
          setminsugar(userData.minsugar || ''); 
          setInsulinType(userData.insulinType || '');
          setInsulinUnits(userData.insulinUnits || '');
        } else {
          setUsername('');
          setPhoneNumber('');
          setGender('');
          setBirthDate('');
          setWeight('');
          setHeight('');
          setmaxsugar('');
          setminsugar(''); 
          setInsulinType('');
          setInsulinUnits('');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      } else {
        // User is not logged in, navigate to login screen
        navigation.navigate('Login'); // Change 'Login' to the actual name of your login screen
      }
    });

    return unsubscribe; // Cleanup the subscription when the component unmounts

  }, [isFocused, navigation]);

  const handleItemClick = async (item) => {
    try {
      const userData = await fetchUserDataByPhoneNumber();
      if (userData) {
        const userId = auth.currentUser.uid;
        if (item.component === 'HyperAaugeI') {
          navigation.navigate('HyperAaugeI', { userData });
        }
        if (item.component === 'HypoAaugeI') {
          navigation.navigate('HypoAaugeI', { userData });
        }
        if (item.component === 'Sugargrade') {
          navigation.navigate('Sugargrade', { userData });
        }
        if (item.component === 'Chatusers') {
          navigation.navigate('Chatusers', { userData });
        } else {
          console.warn(`No navigation logic defined for component: ${item.component}`);
        }
      } else {
        console.error('User data not available');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  
  return (
    //--------------------------------------------------------------------------------//
    <SafeAreaView style={styles.backgroundImage}>
      <View style={styles.headerview}>
        <Text style={styles.TextW}>ยินดีต้อนรับ</Text>

        <Text style={styles.TextName}>{(username !== null && username !== '') ? username : (userData && userData.username) || 'ชื่อ-สกุล'}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Text style={{ ...styles.Textheaddata2, width: 125}}>ระดับน้ำตาลในเลือด</Text>
        <Text style={{ ...styles.Textheaddata2, width: 50}}>   </Text>
        <Text style={styles.Textheaddata2}>ชนิดยา : </Text>
        <Text style={styles.Textheaddata2}>{(insulinType !== null && insulinType !== '') ? insulinType : (userData && userData.insulinType) || 'ชนิดยาอินซูลิน'}</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Text style={styles.Textheaddata2}>{(minsugar !== null && minsugar !== '') ? minsugar : (userData && userData.minsugar) || 'mg/dL'}</Text>
        <Text style={styles.Textheaddata2}>-</Text>
        <Text style={styles.Textheaddata2}>{(maxsugar !== null && maxsugar !== '') ? maxsugar : (userData && userData.maxsugar) || 'mg/dL'}</Text>
        <Text style={styles.Textheaddata}>   </Text>
        <Text style={styles.Textheaddata2}>จำนวน</Text>
        <Text style={styles.Textheaddata2}>{(insulinUnits !== null && insulinUnits !== '') ? insulinUnits : (userData && userData.insulinUnits) || 'จำนวน ... ยูนิต'}</Text>
        <Text style={styles.Textheaddata2}>ยูนิต</Text>
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={styles.itemContainer}>
                <View>
                  <Image
                    source={item.image}
                    style={{
                      width: 125,
                      height: 125,
                      marginBottom: 2,
                      alignSelf: "center",
                    }}
                  />
                  <Text style={styles.TexttitleB}>{item.name}</Text>
                  <Button
                    mode="contained" // ใช้ mode="contained" เพื่อทำให้เป็นปุ่มมีพื้นหลัง
                    style={{ backgroundColor: "#ade2ff", marginTop: 10 }}
                    onPress={() => handleItemClick(item)}
                    >
                    <Text
                      style={{ fontSize: 14, color: "rgba(36, 68, 85, 0.8)" }}
                    >
                      {item.boutton}
                    </Text>
                  </Button>
                </View>
              </TouchableOpacity>
            );
          }}
        />
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

  headerview: {
    //หัวแสดงชื่อ
    alignItems: "center",
    backgroundColor: "rgba(173, 226, 255, 1)",
    width: "100%",
    height: 200,
    //borderTopLeftRadius: 15,
    //borderTopRightRadius: 15,
    borderBottomLeftRadius: "200%",
    borderBottomRightRadius: "200%",
  },

  Textheader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 16,
  },
  TextW: {
    //Twellcome
    fontSize: 18,
    color: "rgba(36, 68, 85, 0.8)",
    margin: 6,
    marginTop: 25,
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
    elevation: 5,
    marginTop: 45,
    marginLeft: 25,
    flexDirection: "row",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 30,
    height: 30,
  },
  TextName: {
    fontWeight: "bold",
    fontSize: 24,
    color: "rgba(36, 68, 85, 0.8)",
    margin: 6,
  },
  Textheaddata: {
    //เว้นห่างๆ
    fontSize: 14,
    color: "rgba(36, 68, 85, 0.8)",
    marginTop: 8,
    margin: 50,
    marginBottom: 3,
  },
  Textheaddata2: {
    //ข้อความย่อยๆ
    fontSize: 14,
    color: "rgba(36, 68, 85, 0.8)",
    marginTop: 8,
    margin: 5,
    marginBottom: 3,
  },

  //////////////////////////////////////////
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
  container: {
    flex: 1,
  },
  TexttitleB: {
    fontSize: 16,
    color: "rgba(36, 68, 85, 0.8)",
  },
  ButtonTexttitle: {
    fontSize: 14,
    marginTop: 10,
    color: "rgba(36, 68, 85, 0.8)",
  },


});

export default Home;