import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, { type SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "tamagui";
import InputActionsRow from "./InputActionsRow";
import InteractiveTextInput from "./InteractiveTextInput";

interface MessageInputProps {
  text: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  keyboardHeight: SharedValue<number>;
}

const KEYBOARD_GAP = 8;

export default function ChatInput({
  text,
  onChangeText,
  onSend,
  placeholder = "Text message",
  onLayout,
  keyboardHeight,
}: MessageInputProps) {
  const { bottom: bottomInset } = useSafeAreaInsets();

  const fakeView = useAnimatedStyle(() => {
    const keyboardOffset = Math.max(keyboardHeight.value - bottomInset + KEYBOARD_GAP, 0);
    return {
      height: keyboardOffset,
    };
  }, [bottomInset]);

  return (
    <>
      {/* Footer Gradient/Blur */}
      <View width="100%" height={96} position="absolute" bottom={0} zIndex={1}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.00)", "rgba(255, 255, 255, 0.60)"]}
          locations={[0, 0.7]}
          style={StyleSheet.absoluteFill}
        />
        <BlurView intensity={8} tint="light" style={StyleSheet.absoluteFill} />
      </View>

      {/* Input Container */}
      <View width="100%" position="absolute" bottom={0} zIndex={2}>
        <View paddingTop={8} paddingHorizontal={16} paddingBottom={bottomInset} onLayout={onLayout}>
          <InteractiveTextInput value={text} placeholder={placeholder} onChangeText={onChangeText}>
            <InputActionsRow disabled={!text.trim()} onSend={onSend} />
          </InteractiveTextInput>
        </View>

        <Animated.View style={fakeView} />
      </View>
    </>
  );
}
