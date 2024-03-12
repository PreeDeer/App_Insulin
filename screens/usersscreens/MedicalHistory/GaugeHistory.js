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
import { getDatabase, ref, get } from "firebase/database";
import { Icon } from "react-native-elements";

const GaugeHistory = ({ navigation, route }) => {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [userId, setUserId] = useState(null);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  useEffect(() => {
    const auth = getAuth();
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const userId = user.phoneNumber;
        setUserId(userId);
  
        const db = getDatabase();
        const userHistoryRef = ref(db, `MedicalHistory/assessmentHistory/${userId}`);
  
        // Fetch assessment history data
        get(userHistoryRef)
          .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
              const historyArray = Object.values(data);
              setAssessmentHistory(historyArray.reverse()); // Reverse the array
            }
          })
          .catch((error) => {
            console.error("Error fetching assessment history:", error.message);
          });
      } else {
        // User is signed out
        setUserId(null);
        setAssessmentHistory([]);
      }
    });
  
    // Unsubscribe from onAuthStateChanged when component unmounts
    return () => unsubscribe();
  }, []);
  

  return (
    <SafeAreaView style={styles.backgroundImage}>
      <TouchableOpacity
        style={styles.BackButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <Icon name="chevron-back" size={24} color="#1b1b1b" type="ionicon" />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text style={styles.TextW}>ประวัติการประเมิน</Text>
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
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    margin: 8,
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

export default GaugeHistory;
