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

const ReadHistoryUsersA = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);

  useEffect(() => {
    console.log("route.params in useEffect:", route.params);
    if (route.params && route.params.userData) {
      // ดึงข้อมูล userData จาก route.params
      const { userData } = route.params;
      setUserData(userData);

      // Fetch assessment history data
      const db = getDatabase();
      const phoneNumber = userData.phoneNumber;
      const historyRef = ref(
        db,
        `MedicalHistory/assessmentHistory/${phoneNumber}`
      );
      const historyQuery = query(historyRef);

      get(historyQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const historyData = snapshot.val();
            setAssessmentHistory(Object.values(historyData));
          }
        })
        .catch((error) => {
          console.error("Error fetching assessment history:", error);
        });
    }
  }, [route.params]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>เวลา: {item.formattedTimestamp}</Text>
      <Text>
        อาการที่ระบุ:{" "}
        {item.selectedItems.map((selectedItem) => selectedItem.name).join(", ")}
      </Text>
      {/* เพิ่มส่วนที่ต้องการแสดงเพิ่มเติมตามความต้องการ */}
    </View>
  );

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
        <Text style={styles.TextW}>ประวัติการประเมิน</Text>
        {userData && <Text>{`คุณ : ${userData.username}`}</Text>}
        <FlatList
          data={assessmentHistory}
          keyExtractor={(item) =>
            item.timestamp ? item.timestamp.toString() : ""
          }
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.Text}>เวลา: {item.formattedTimestamp}</Text>
              <Text style={styles.Text}>
                อาการที่ระบุ:{" "}
                {item.selectedItems
                  .map((selectedItem) => selectedItem.name)
                  .join(", ")}
              </Text>
              {/* Add other fields as needed */}
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
    margin: 6,
    marginStart: 18,
  },
});

export default ReadHistoryUsersA;
