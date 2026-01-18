import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import MessageItem from "@/components/MessageItem";
import { Message, MessageRole } from "@/types/message";
import { hapticImpact } from "@/utils/haptics";
import { FlashList } from "@shopify/flash-list";
import { ImpactFeedbackStyle } from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const initialMessages: Message[] = [
  {
    id: "1",
    role: MessageRole.User,
    content: "Hello, how are you?",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    role: MessageRole.Client,
    content: "I am good, thank you!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();

  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const addMessage = () => {
    setMessages([
      ...messages,
      {
        id: Math.random().toString(36),
        role: MessageRole.User,
        content: text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    setText("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={(Platform.OS === "ios" ? insets.top : 0) + 16}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <FlashList
          data={messages}
          renderItem={({ item }) => <MessageItem message={item} />}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          maintainVisibleContentPosition={{
            autoscrollToBottomThreshold: 0.2,
            startRenderingFromBottom: true,
          }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        />
      </View>

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          value={text}
          onChangeText={setText}
        />
        <Pressable
          style={styles.button}
          onPress={addMessage}
          onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
        >
          <Text style={styles.buttonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  content: {
    width: "100%",
    flex: 1,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#e0e0e0",
    borderRadius: 16,
    gap: 8,
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#FFE016",
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonPressed: {
    transform: [{ translateY: 1 }],
    opacity: 0.8,
  },
  buttonText: {
    color: "#002C2A",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    flex: 1,
    height: "100%",
  },
  listContent: {
    padding: 16,
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
});
