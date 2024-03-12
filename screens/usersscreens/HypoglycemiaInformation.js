import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HypoglycemiaInformation = ({ navigation, router }) => {
  return (
    <SafeAreaView style={styles.backgroundImage}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Icon name="chevron-back" size={24} color="#1b1b1b" type="ionicon" />
        </TouchableOpacity>
        <Text style={styles.headerText}>อาการน้ำตาลในเลือดต่ำ</Text>
      </View>

      <ScrollView>
        <View style={styles.itemContainer}>
          <Image
            source={require("../../assets/hypo.png")}
            style={styles.imageS}
          />
        </View>
      </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    marginRight: 10,
  },
  itemContainer: {
    width: wp('100%'), // 100% of screen width
    justifyContent: "center",
    alignItems: "center",
  },
  imageS: {
    width: wp('100%'), // 100% of screen width
    height: hp('100%'), // Adjust the percentage as needed
    resizeMode: "cover",
  },
});

export default HypoglycemiaInformation;
