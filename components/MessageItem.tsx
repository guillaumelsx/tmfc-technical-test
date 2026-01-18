import { Message, MessageRole } from "@/types/message";
import { StyleSheet, Text, View } from "react-native";

const MessageItem = ({ message }: { message: Message }) => {
  return (
    <View
      style={[styles.container, message.role === MessageRole.User ? styles.right : styles.left]}
    >
      <Text
        style={[
          styles.text,
          message.role === MessageRole.User ? styles.textRight : styles.textLeft,
        ]}
      >
        {message.content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  left: {
    marginRight: "auto",
    backgroundColor: "#fdfdfd",
  },
  right: {
    marginLeft: "auto",
    backgroundColor: "#007bff",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
  },
  textLeft: {
    color: "#000",
  },
  textRight: {
    color: "#fff",
  },
});

export default MessageItem;
