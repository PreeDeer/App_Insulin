import * as React from "react";
import { useState, useEffect } from "react";
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
  FlatList,
  Dimensions,
  ScrollView,
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

import Constants from "expo-constants";
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
import { TextInput as RNTextInput } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { categoriesData } from "../../components/categoriesindex";
import { categoriesData2 } from "../../components/categoriesindex";
import { categoriesData3 } from "../../components/categoriesindex";

const Moremenu = ({ navigation }) => {
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

  const halfLength = Math.ceil(categoriesData3.length / 2);

  const firstHalfData = categoriesData3.slice(0, halfLength);
  const secondHalfData = categoriesData3.slice(halfLength);

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
            //
            userData.userID = userKey;
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
          userData.userID = auth.currentUser.uid;
          setUserData(userData);

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
        // User is not logged in, navigate to login screen
        navigation.navigate("Login"); // Change 'Login' to the actual name of your login screen
      }
    });

    return unsubscribe; // Cleanup the subscription when the component unmounts
  }, [isFocused, navigation]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.categoryContainerS3}
      onPress={() => handleItemClick(item)}
    >
      <Image source={item.image} style={styles.categoryImageS} />
      <Text style={styles.categoryTitle}>
        {item.title.split(" ").map((word, index) => (
          <Text key={index}>
            {word}
            {"\n"}
          </Text>
        ))}
      </Text>
    </TouchableOpacity>
  );

  const handleItemClick = async (item) => {
    try {
      const userData = await fetchUserDataByPhoneNumber();
      if (userData) {
        const userId = auth.currentUser.uid;

        // ตรวจสอบว่า item.component เป็นอะไรแล้วเปลี่ยน component ตาม
        switch (item.component) {
          case "HyperAaugeI":
            navigation.navigate("HyperAaugeI", { userData });
            break;
          case "HypoAaugeI":
            navigation.navigate("HypoAaugeI", { userData });
            break;
          case "Sugargrade":
            navigation.navigate("Sugargrade", { userData });
            break;
          case "Graph":
            navigation.navigate("Graph", { userData });
            break;
          case "Proflie":
            navigation.navigate("Proflie", { userData });
            break;
          case "Chatusers":
            navigation.navigate("Chatusers", { userData });
            break;
          case "GaugeHistory":
            navigation.navigate("GaugeHistory", { userData });
            break;
          case "GraphHistory":
            navigation.navigate("GraphHistory", { userData });
            break;
          case "HyperglycemiaInformation":
            navigation.navigate("HyperglycemiaInformation", { userData });
            break;
          case "HypoglycemiaInformation":
            navigation.navigate("HypoglycemiaInformation", { userData });
            break;
          case "KeepInsulin":
            navigation.navigate("KeepInsulin", { userData });
            break;
          case "ProvideInsulin":
            navigation.navigate("ProvideInsulin", { userData });
            break;
          case "IntructionInsulin":
            navigation.navigate("IntructionInsulin", { userData });
            break;
          case "TypeInsulin":
            navigation.navigate("TypeInsulin", { userData });
            break;
          default:
            console.warn(
              `No navigation logic defined for component: ${item.component}`
            );
        }
      } else {
        console.error("User data not available");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.backgroundImage}>
      <Text style={styles.headingText}>เมนูหลัก</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollViewContainer}
        showsHorizontalScrollIndicator={false}
      >
        {categoriesData.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryContainer}
            onPress={() => handleItemClick(cat)}
          >
            <Image source={cat.image} style={styles.categoryImage} />
            <Text style={styles.categoryTitle}>
              {cat.title.split(" ").map((word, index) => (
                <Text key={index}>
                  {word}
                  {"\n"}
                </Text>
              ))}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.headingText}>บริการเสริม</Text>
      <View style={styles.containerS}>
        <FlatList
          horizontal
          data={categoriesData2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryContainerS}
              onPress={() => handleItemClick(item)}
            >
              <Image source={item.image} style={styles.categoryImageS} />
              <Text style={styles.categoryTitle}>
                {item.title.split(" ").map((word, index) => (
                  <Text key={index}>
                    {word}
                    {"\n"}
                  </Text>
                ))}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatListContainerS}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Text style={styles.headingText}>สาระความรู้</Text>
      <View style={styles.containerS}>
        <FlatList
          horizontal
          data={firstHalfData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainerS}
          showsHorizontalScrollIndicator={false}
        />
        <FlatList
          horizontal
          data={secondHalfData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainerS}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headingText: {
    fontSize: wp(5),
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    left: 12,
    color: "rgba(0, 0, 0, 0.8)",
  },
  scrollViewContainer: {
    paddingHorizontal: 15,
    flexDirection: "row",
    marginVertical: 10,
  },
  categoryContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  categoryImage: {
    width: wp(20),
    height: wp(19),
    borderRadius: 10,
  },
  categoryTitle: {
    textAlign: "center",
    fontSize: wp(3),
    fontWeight: "bold",
    marginTop: 5,
    color: "rgba(0, 0, 0, 0.8)",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  //กรอบสีขาว
  containerS: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 4,
    overflow: "hidden",
  },
  listContainerS: {
    flex: 1,
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  flatListContainerS: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    paddingHorizontal: 5,
  },
  categoryContainerS: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    //flex: 1,
    flexDirection: "column",
  },
  categoryContainerS3: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: "column",
  },
  categoryImageS: {
    width: wp(12),
    height: wp(11),
    borderRadius: 10,
    margin: 8,
    padding: 15,
  },
});

export default Moremenu;
