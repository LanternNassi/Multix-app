import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { widthToDp } from "rn-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function Button({ title, onPress, style, textSize, icon_color }) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress = {onPress}>
      <Text
        style={[styles.text, { fontSize: textSize ? textSize : widthToDp(3.5) , color:icon_color?(icon_color):('white') },  ]}
      
      >
        {title}
      </Text>
      <Ionicons
            // style={styles.icon}
            name="cart"
            size={20}
            color={icon_color?(icon_color):('white')}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#C37AFF",
    padding: 5,
    width: widthToDp(20),
    flexDirection : 'row',
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 59,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});