import MessageItem from "@/components/MessageItem";
import { UseChatMessagesResult } from "@/hooks/useChatMessages";
import type { Message } from "@/types/message";
import type { FlashListProps, FlashListRef } from "@shopify/flash-list";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

interface ChatMessagesListProps extends Omit<
  FlashListProps<Message>,
  | "data"
  | "renderItem"
  | "keyExtractor"
  | "ListFooterComponent"
  | "maintainVisibleContentPosition"
  | "keyboardShouldPersistTaps"
> {
  messages: Message[];
  getMessageProps: UseChatMessagesResult["getMessageProps"];
  keyboardHeight: SharedValue<number>;
  inputContainerHeight: number;
}

const KEYBOARD_GAP = 8;
const LIST_BOTTOM_GAP = 8;
const AUTOSCROLL_THRESHOLD = 24;

export default function ChatMessagesList({
  messages,
  getMessageProps,
  keyboardHeight,
  inputContainerHeight,
  ...flashListProps
}: ChatMessagesListProps) {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const listRef = useRef<FlashListRef<Message>>(null);
  const isNearBottomRef = useRef(true);

  const updateIsNearBottom = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    isNearBottomRef.current = distanceFromBottom <= AUTOSCROLL_THRESHOLD;
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      updateIsNearBottom(event);
      flashListProps.onScroll?.(event);
    },
    [flashListProps, updateIsNearBottom],
  );

  const scrollToBottom = useCallback(() => {
    if (!isNearBottomRef.current) return;
    listRef.current?.scrollToEnd({ animated: false });
  }, []);

  const footerAnimatedStyle = useAnimatedStyle(() => {
    const keyboardOffset = Math.max(keyboardHeight.value - bottomInset + KEYBOARD_GAP, 0);
    return {
      height: inputContainerHeight + LIST_BOTTOM_GAP + keyboardOffset,
    };
  }, [bottomInset, inputContainerHeight]);

  useAnimatedReaction(
    () => keyboardHeight.value,
    (current, previous) => {
      if (current === previous) return;
      scheduleOnRN(scrollToBottom);
    },
    [],
  );

  return (
    <FlashList
      ref={listRef}
      data={messages}
      renderItem={({ item, index }) => (
        <MessageItem message={item} {...getMessageProps(item, index)} />
      )}
      keyExtractor={(item) => item.id}
      ListFooterComponent={<Animated.View style={footerAnimatedStyle} />}
      style={{ flex: 1, ...flashListProps.style }}
      onScroll={handleScroll}
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
