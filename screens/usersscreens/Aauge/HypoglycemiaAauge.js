import * as React from "react";
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
} from "react-native";

import {
  Button,
  TextInput,
  Avatar,
  Provider as PaperProvider,
  DefaultTheme,
  configureFonts,
  MD2LightTheme,
  Checkbox,
  DataTable,
} from "react-native-paper";

//--------------------------------------------------------------------------------//
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, serverTimestamp } from "firebase/database";
import { Icon } from "react-native-elements";
import {
  ListgaugeHypo1,
  ListgaugeHypo2,
} from "../../../components/categoriesData ";

const numberOfItemsPerPageList = [1, 2, 3, 4];

const items = [
  {
    id: 1,
    key: "assessment1",
    name: " -1- ",
  },
  {
    id: 2,
    key: "assessment2",
    name: " -2- ",
  },
];

const HypoAaugeI = ({ navigation }) => {
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

  const listgaugeHypo1Part1 = ListgaugeHypo1.slice(
    0,
    Math.ceil(ListgaugeHypo1.length / 2)
  );
  const listgaugeHypo1Part2 = ListgaugeHypo1.slice(
    Math.ceil(ListgaugeHypo1.length / 2)
  );

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const [checkedItems, setCheckedItems] = React.useState([]);

  const handleCheckboxToggle = (itemId) => {
    setCheckedItems((prevCheckedItems) => {
      if (prevCheckedItems.includes(itemId)) {
        return prevCheckedItems.filter((id) => id !== itemId);
      } else {
        return [...prevCheckedItems, itemId];
      }
    });
  };

  const renderItem = ({ item }) => (
    <View key={item.id} style={{ ...styles.checkboxContainer, width: 175 }}>
      <Checkbox
        status={checkedItems.includes(item.id) ? "checked" : "unchecked"}
        onPress={() => handleCheckboxToggle(item.id)}
        color={"#ff5733"}
        uncheckedColor={"#4caf50"}
        borderColor={"#A4A6A8"}
        borderWidth={1}
      />
      <Text style={styles.checkboxLabel}>{item.name}</Text>
    </View>
  );

  const renderFlatList = () => {
    if (page === 0) {
      return (
        <FlatList
          data={[...listgaugeHypo1Part1, ...listgaugeHypo1Part2]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          {ListgaugeHypo2.map((item) => (
            <View
              key={item.id}
              style={{ ...styles.checkboxContainer, alignItems: "flex-start" }}
            >
              <Checkbox
                status={checkedItems.includes(item.id) ? "checked" : "unchecked"}
                onPress={() => handleCheckboxToggle(item.id)}
                color={"#ff5733"}
                uncheckedColor={"#4caf50"}
                borderColor={"#A4A6A8"}
                borderWidth={1}
              />
              <Text style={styles.checkboxLabel}>{item.name}</Text>
            </View>
          ))}
        </View>
      );
    }
  };

  const handleSave = () => {
    const combinedItems = [...ListgaugeHypo1, ...ListgaugeHypo2];
    const selectedItems = combinedItems.filter((item) =>
      checkedItems.includes(item.id)
    );
    const sumOfNum = selectedItems.reduce((sum, item) => sum + item.num, 0);
  
    console.log("Combined Items:", combinedItems);
    console.log("Selected Items:", selectedItems);
    console.log("Sum of num:", sumOfNum);
  
    const auth = getAuth();
    const userId = auth.currentUser.phoneNumber;
  
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
  

    const formattedDate = `${day}/${month}/${year} , ${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')} น.`;
  
    const newAssessmentEntry = {
      //timestamp: serverTimestamp(),
      formattedTimestamp: formattedDate,
      sumOfNum: sumOfNum,
      selectedItems: selectedItems,
    };
  
    const db = getDatabase();
    const userRef = ref(db, `MedicalHistory/assessmentHistory/${userId}`);
  
    push(userRef, newAssessmentEntry)
      .then(() => {
        console.log("Assessment history saved successfully");
  
        let alertMessage;
        if (sumOfNum >= 2) {
          alertMessage =
            "อาการของคุณมีน้ำตาลในเลือดน้อยเกินไป";
          Alert.alert("ผลแบบประเมินของคุณ", alertMessage, [
            {
              text: "ไปหน้าตรวจน้ำตาลในเลือด",
              onPress: () => navigation.replace("Sugargrade"),
            },
          ]);
        } else {
          alertMessage = "น้ำตาลในเลือดอยู่ในภาวะปกติ! สามารถเช็คระดับน้ำตาลในเลือดของคุณได้เลย";
          Alert.alert("ผลแบบประเมินของคุณ", alertMessage, [
            {
              text: "ไปหน้าตรวจน้ำตาลในเลือด",
              onPress: () => navigation.replace("Sugargrade"),
            },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error saving assessment history:", error.message);
      });
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

      <View style={{ ...styles.itemContainer, margin: 18 }}>
        <View style={{ alignItems: "center", justifyContent: "center", padding: 16 }}>
          <Text>{items[page]?.name}</Text>
        </View>
        {renderFlatList()}
      </View>

      <DataTable>
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          showFastPaginationControls
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          onItemsPerPageChange={onItemsPerPageChange}
          selectPageDropdownLabel={"Rows per page"}
        />
      </DataTable>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity style={styles.ButtonS} onPress={handleSave}>
          <Text style={styles.buttonText}>บันทึก</Text>
        </TouchableOpacity>
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 18,
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  ButtonS: {
    alignItems: "center",
    backgroundColor: "#ade2ff",
    padding: 20,
    borderRadius: 15,
    borderRadius: 10,
    width: 125,
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 500,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
});

export default HypoAaugeI;
