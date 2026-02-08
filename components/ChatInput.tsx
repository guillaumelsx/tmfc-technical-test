import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
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
}

export default function ChatInput({
  text,
  onChangeText,
  onSend,
  placeholder = "Text message",
  onLayout,
}: MessageInputProps) {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { height: keyboardHeight } = useGradualAnimation();

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(keyboardHeight.value) - bottomInset + 8,
    };
  }, []);

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
      <View
        width="100%"
        position="absolute"
        bottom={0}
        zIndex={2}
        paddingTop={8}
        paddingHorizontal={16}
        paddingBottom={bottomInset}
        onLayout={onLayout}
      >
        <InteractiveTextInput value={text} placeholder={placeholder} onChangeText={onChangeText}>
          <InputActionsRow disabled={!text.trim()} onSend={onSend} />
        </InteractiveTextInput>

        <Animated.View style={[fakeView]} />
      </View>
    </>
  );
}
