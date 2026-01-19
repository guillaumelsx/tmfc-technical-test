import { ArrowUp } from "@/assets/icons";
import { Colors } from "@/constants/Colors";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import { hapticImpact } from "@/utils/haptics";
import { BlurView } from "expo-blur";
import { ImpactFeedbackStyle } from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import { LayoutChangeEvent, StyleSheet, TextInput } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Circle, View, XStack } from "tamagui";

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
  const inputRef = useRef<TextInput>(null);
  const { height } = useGradualAnimation();

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value) - bottomInset + 8,
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
        <View
          width="100%"
          // minHeight={56}
          borderRadius={24}
          borderWidth={1}
          paddingTop={24}
          paddingHorizontal={12}
          paddingBottom={8}
          gap={12}
          backgroundColor={Colors.white}
          borderColor={Colors.white}
          boxShadow="0 2px 24px 0 rgba(0, 44, 42, 0.08)"
          onPress={() => inputRef.current?.focus()}
        >
          <TextInput
            ref={inputRef}
            placeholder={placeholder}
            value={text}
            onChangeText={onChangeText}
            placeholderTextColor={Colors.primary50}
            style={{ fontSize: 16, fontWeight: "500", lineHeight: 19 }}
            cursorColor={Colors.primary100}
            selectionColor={Colors.primary100}
            multiline={true}
            scrollEnabled={false}
            // numberOfLines={1}
            // maxLength={1000}
            // returnKeyType="send"
            // onSubmitEditing={onSend}
          />
          {/* <TextArea
            unstyled
            placeholder={placeholder}
            value={text}
            onChangeText={onChangeText}
            placeholderTextColor={Colors.primary50}
            fontSize={16}
            fontWeight="500"
            cursorColor={Colors.primary100}
            selectionColor={Colors.primary100}
            scrollEnabled={false}
          /> */}

          <InputActions onSend={onSend} disabled={!text.trim()} />
        </View>

        <Animated.View style={[fakeView]} />
      </View>
    </>
  );
}

function InputActions({ onSend, disabled }: { onSend: () => void; disabled: boolean }) {
  return (
    <XStack justifyContent="flex-end" alignItems="center" gap={8}>
      <Circle
        size={36}
        backgroundColor={Colors.primary5}
        hitSlop={4}
        onPress={onSend}
        onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
        disabled={disabled}
      >
        <ArrowUp />
      </Circle>
    </XStack>
  );
}
