import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import { Icon } from "react-native-elements";

const ReadHistoryUsersG = ({ navigation, route }) => {

  const [userData, setUserData] = useState(null);
  const [graphHistory, setGraphHistory] = useState([]);

  useEffect(() => {
    if (route.params && route.params.userData) {
      const { userData } = route.params;
      setUserData(userData);
      const phoneNumber = userData.phoneNumber;

      const db = getDatabase();
      const historyRef = ref(db, `MedicalHistory/graphHistory/${phoneNumber}`);

      get(historyRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const historyData = snapshot.val();
            setGraphHistory(Object.values(historyData));
          }
        })
        .catch((error) => {
          console.error("Error fetching graph history:", error);
        });
    }
  }, [route.params]);

  return (
    <SafeAreaView style={styles.backgroundImage}>
      <TouchableOpacity
        style={styles.BackButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <Icon name="chevron-back" size={24} color="#1b1b1b" type="ionicon" />
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.TextW}>ประวัติการฉีดยา</Text>
        {userData && <Text>{`คุณ : ${userData.username}`}</Text>}
        <FlatList
          data={graphHistory}
          keyExtractor={(item) =>
            item.timestamp ? item.timestamp.toString() : ""
          }
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.Text}>เวลา: {item.timestamp}</Text>
              <Text style={styles.Text}>ส่วน: {item.selectedItemId}</Text>
              <Text style={styles.Text}>ตำแหน่งที่: {item.selectedButtonName}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
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
    width: 350,
    margin: 8,
    marginTop: 18,
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
  TextW: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(36, 68, 85, 0.8)",
    margin: 6,
    marginTop: 25,
  },
  Text: {
    fontSize: 14,
    marginStart: 18,
  },
});

export default ReadHistoryUsersG;
