import { ArrowUp } from "@/assets/icons";
import { Colors } from "@/constants/Colors";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import { hapticImpact } from "@/utils/haptics";
import { BlurView } from "expo-blur";
import { ImpactFeedbackStyle } from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { LayoutChangeEvent, StyleSheet, useWindowDimensions } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Circle, View, XStack } from "tamagui";
import { ExpandableTextInput } from "./ExpandableTextInput";

interface MessageInputProps {
  text: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  headerHeight?: number;
}

export default function ChatInput({
  text,
  onChangeText,
  onSend,
  placeholder = "Text message",
  onLayout,
  headerHeight = 0,
}: MessageInputProps) {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { height: keyboardHeight } = useGradualAnimation();

  const fullHeight = useMemo(() => {
    const topPosition = headerHeight + 8;
    const bottomPosition = keyboardHeight.value + 8;
    const targetHeight = windowHeight - topPosition - bottomPosition;
    return targetHeight;
  }, [headerHeight, keyboardHeight.value, windowHeight]);

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
        <ExpandableTextInput
          value={text}
          onChangeText={onChangeText}
          placeholder={placeholder}
          fullHeight={fullHeight}
        >
          <InputActionsRow onSend={onSend} disabled={!text.trim()} />
        </ExpandableTextInput>

        <Animated.View style={[fakeView]} />
      </View>
    </>
  );
}

function InputActionsRow({ onSend, disabled }: { onSend: () => void; disabled: boolean }) {
  return (
    <XStack justifyContent="flex-end" alignItems="center" gap={8}>
      <Circle
        size={36}
        backgroundColor={disabled ? "transparent" : Colors.primary5}
        hitSlop={4}
        onPress={onSend}
        onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
        disabled={disabled}
      >
        <ArrowUp color={disabled ? Colors.primary50 : Colors.primary100} />
      </Circle>
    </XStack>
  );
}
