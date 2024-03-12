import React, { useEffect, useRef } from "react";
import { StyleSheet, View, SafeAreaView, Text } from "react-native";
import { Icon } from "react-native-elements";
import { Video } from "expo-av";
import { Asset } from "expo-asset";

const InstructionInsulin = ({ navigation, router }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoAsset = Asset.fromModule(require('../../../assets/video/instruction.mp4'));
        await videoAsset.downloadAsync();

        if (videoRef.current) {
          videoRef.current.loadAsync({ uri: videoAsset.localUri });
          videoRef.current.playAsync();
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();

    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.backgroundImage}>
      <View style={styles.BackButton}>
        <Icon
          name="chevron-back"
          size={24}
          color="#1b1b1b"
          type="ionicon"
          onPress={() => navigation.goBack()}
        />
      </View>
      <View
        style={{
          ...styles.itemContainer,
          width: "cover",
          padding: 16,
          alignItems: "center",
        }}
      >
        <Text style={styles.Text}>วิธีฉีดยาอินซูลินแบบปากกาด้วยตัวเอง</Text>
        <Video
          ref={videoRef}
          style={{ width: 300, height: 400 }}
          useNativeControls
          resizeMode="cover"
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
  Text: {
    fontWeight: "bold",
    fontSize: 20,
    color: "rgba(36, 68, 85, 0.8)",
    margin: 6,
    marginTop: 18,
    marginBottom: 18,
  },
});

export default InstructionInsulin;
