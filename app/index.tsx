import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessagesList from "@/components/ChatMessagesList";
import { mockClient } from "@/constants/client";
import { Colors } from "@/constants/Colors";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useState } from "react";
import { StatusBar } from "react-native";
import { View } from "tamagui";

export default function ChatScreen() {
  const [text, setText] = useState("");
  const { messages, addMessage, getMessageProps } = useChatMessages(mockClient);
  const [inputContainerHeight, setInputContainerHeight] = useState(0);

  function handleSend() {
    addMessage(text);
    setText("");
  }

  return (
    <View flex={1}>
      <StatusBar barStyle="dark-content" />

      <ChatHeader client={mockClient} />

      <View flex={1} backgroundColor={Colors.white}>
        <ChatMessagesList
          messages={messages}
          getMessageProps={getMessageProps}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: inputContainerHeight + 8 }}
        />
      </View>

      <ChatInput
        text={text}
        onChangeText={setText}
        onSend={handleSend}
        placeholder={`Text ${mockClient.name.split(" ")[0]}`}
        onLayout={(event) => setInputContainerHeight(event.nativeEvent.layout.height)}
      />
    </View>
  );
}
