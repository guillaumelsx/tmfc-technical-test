import MessageItem from "@/components/MessageItem";
import { UseChatMessagesResult } from "@/hooks/useChatMessages";
import type { Message } from "@/types/message";
import type { FlashListProps } from "@shopify/flash-list";
import { FlashList } from "@shopify/flash-list";

interface ChatMessagesListProps extends Omit<
  FlashListProps<Message>,
  | "data"
  | "renderItem"
  | "keyExtractor"
  | "maintainVisibleContentPosition"
  | "keyboardShouldPersistTaps"
> {
  messages: Message[];
  getMessageProps: UseChatMessagesResult["getMessageProps"];
}

export default function ChatMessagesList({
  messages,
  getMessageProps,
  ...flashListProps
}: ChatMessagesListProps) {
  return (
    <FlashList
      data={messages}
      renderItem={({ item, index }) => (
        <MessageItem message={item} {...getMessageProps(item, index)} />
      )}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, ...flashListProps.style }}
      maintainVisibleContentPosition={{
        autoscrollToBottomThreshold: 0.2,
        startRenderingFromBottom: true,
      }}
      // keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always" // tapping outside the input will not dismiss the keyboard
      showsVerticalScrollIndicator={false}
      {...flashListProps}
    />
  );
}
