import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Modal,
} from "react-native";
import { Card, Button } from "react-native-paper";
import { Icon } from "react-native-elements";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set, serverTimestamp } from "firebase/database";

const items = [
  {
    id: 1,
    name: "ส่วนท้อง",
    Title:
      "หากท่านฉีดยาตรงบริเวรส่วนทางโปรดกดที่นี่เพื่อเลือกตำแหน่งที่ท่านฉีดและกดยืนยันการฉีดยาอินซูลินของท่าน หมายเหตุ: โปรดระบุตำแหน่งให้ใกล้เคียงกับตัวเลขในรูปภาพ",
    image: require("../../assets/imgergraph/G1.png"),
    ButtomRow:
      "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44",
    //component: HyperAaugeI,
  },
  {
    id: 2,
    name: "ส่วนต้นขาซ้ายและขวา",
    Title:
      "หากท่านฉีดยาตรงบริเวรส่วนทางโปรดกดที่นี่เพื่อเลือกตำแหน่งที่ท่านฉีดและกดยืนยันการฉีดยาอินซูลินของท่าน หมายเหตุ: โปรดระบุตำแหน่งให้ใกล้เคียงกับตัวเลขในรูปภาพ ",
    image: require("../../assets/imgergraph/G2.png"),
    ButtomRow:
      "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50",
    //component: HyperAaugeI,
  },
];

const Graph = ({ navigation }) => {
  const [selectedButtonName, setSelectedButtonName] = useState(null);

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cardHeight, setCardHeight] = useState(new Animated.Value(220));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  

  const openModal = (itemId) => {
    setSelectedItemId(itemId);
    setIsModalVisible(true);
  };

  const handleCardPress = (itemId) => {
    console.log(`Card with ID ${itemId} pressed`);
    if (selectedCardId === itemId) {
      setSelectedCardId(null);
      Animated.timing(cardHeight, {
        toValue: 220,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setSelectedCardId(itemId);
      Animated.timing(cardHeight, {
        toValue: 850,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const onSaveButtonPress = () => {
    const auth = getAuth();
    const userId = auth.currentUser.phoneNumber;
  
    const db = getDatabase();
    const userRef = ref(db, `MedicalHistory/graphHistory/${userId}`);
  
    // Get the current timestamp in the timezone of Thailand
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
  
    // Format the date
    const formattedDate = `${day}/${month}/${year} , ${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')} น.`;
  
    const newGraphEntryRef = push(userRef);
  
    // Find the corresponding item from items array
    const selectedItem = items.find((item) => item.id === selectedItemId);
  
    const newData = {
      selectedItemId: selectedItem.name,
      selectedButtonName,
      timestamp: formattedDate,
    };
  
    set(newGraphEntryRef, newData)
      .then(() => {
        console.log("Graph data saved successfully");
        navigation.replace('GraphHistory');
      })
      .catch((error) => {
        console.error("Error saving graph data:", error.message);
      });
  
    setIsModalVisible(false);
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

      <ScrollView>
        <View style={{ flex: 1 }}>
          <View style={styles.View}>
            <Text style={styles.Textheader}>เลือกส่วนที่ท่านฉีดวันนี้</Text>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleCardPress(item.id)}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.Card,
                    {
                      height: selectedCardId === item.id ? cardHeight : 275,
                      width: 400,
                    },
                  ]}
                >
                  <Card.Cover source={item.image} style={styles.CardImage} />
                  <Card.Content>
                    <Text style={styles.CardTitle}>{item.name}</Text>
                    {selectedCardId === item.id && (
                      <Text style={styles.CardDescription}>{item.Title}</Text>
                    )}
                    {selectedCardId === item.id && (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        {item.ButtomRow.split(",").map((name) => (
                          <TouchableOpacity
                            key={name.trim()}
                            style={{ ...styles.Button, margin: 5 }}
                            onPress={() => {
                              openModal(item.id);
                              setSelectedButtonName(name.trim()); // เก็บชื่อปุ่มที่เลือก
                            }}
                          >
                            <Text style={styles.ButtonText}>{name.trim()}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </Card.Content>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal Section */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={{...styles.modalContent}}>
            {selectedItemId && (
              <>
                <Text style={{ color: "rgba(0, 0, 0, 8)", fontSize:18,fontWeight: "bold",marginBottom: 18,}}>{`คุณต้องการบันทึกที่ ${
                  items.find((item) => item.id === selectedItemId)?.name
                } ตำหน่งที่ ${selectedButtonName} หรือไม่ `}</Text>

                <Button style={styles.modalButton} onPress={() => onSaveButtonPress()}>
                  <Text style={{ color: "#213834", fontSize:16,fontWeight: "bold",}}>บันทึก</Text>
                  </Button>
                <Button onPress={() => setIsModalVisible(false)}><Text style={{ color: "rgba(0, 0, 0, 0.4)", fontSize:16,}}>ยกเลิก</Text></Button>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  Textheader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.8)",
    marginBottom: 16,
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
  Card: {
    marginBottom: 20,
    elevation: 5,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 1)",
    overflow: "hidden",
  },
  CardImage: {
    width: "100%",
    height: 220,
    marginBottom: 10,
    borderRadius: 0,
  },
  CardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  CardDescription: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.7)",
  },
  Button: {
    backgroundColor: "#66B8E6",
    width: 45,
    height: 45,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
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
    shadowRadius: 25,
    elevation: 5,
  },
  modalButton:{
    width: "auto",
    backgroundColor: "#42C08B",
    borderRadius: 5,
    padding: 8,
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 500,
  },
});

export default Graph;
