import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageItem from "@/components/MessageItem";
import { Colors } from "@/constants/Colors";
import { mockClient } from "@/constants/client";
import { useChatMessages } from "@/hooks/useChatMessages";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { StatusBar } from "react-native";
import { View } from "tamagui";

export default function ChatScreen() {
  const [text, setText] = useState("");
  const { messages, addMessage, getMessageProps } = useChatMessages(mockClient);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [inputContainerHeight, setInputContainerHeight] = useState(0);

  function handleSend() {
    addMessage(text);
    setText("");
  }

  return (
    <View flex={1}>
      <StatusBar barStyle="dark-content" />

      <ChatHeader
        client={mockClient}
        onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
      />

      <View flex={1} backgroundColor={Colors.white}>
        <FlashList
          data={messages}
          renderItem={({ item, index }) => (
            <MessageItem message={item} {...getMessageProps(item, index)} />
          )}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: inputContainerHeight + 8,
          }}
          maintainVisibleContentPosition={{
            autoscrollToBottomThreshold: 0.2,
            startRenderingFromBottom: true,
          }}
          // keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always" // tapping outside the input will not dismiss the keyboard
          showsVerticalScrollIndicator={false}
        />
      </View>

      <ChatInput
        text={text}
        onChangeText={setText}
        onSend={handleSend}
        placeholder={`Text ${mockClient.name.split(" ")[0]}`}
        onLayout={(event) => setInputContainerHeight(event.nativeEvent.layout.height)}
        headerHeight={headerHeight}
      />
    </View>
  );
}
