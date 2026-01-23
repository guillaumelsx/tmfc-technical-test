import { ArrowUp } from "@/assets/icons";
import { Colors } from "@/constants/Colors";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import { hapticImpact } from "@/utils/haptics";
import { BlurView } from "expo-blur";
import { ImpactFeedbackStyle } from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, TextInput, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { KeyboardController, useKeyboardState } from "react-native-keyboard-controller";
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { Circle, View, XStack } from "tamagui";

const INITIAL_CONTAINER_HEIGHT = 106;

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
  const inputRef = useRef<TextInput>(null);
  const { height: keyboardHeight } = useGradualAnimation();
  const { isVisible: isKeyboardVisible } = useKeyboardState();
  const isExpanded = useSharedValue(false);
  const hasTriggeredGesture = useSharedValue(false);
  const [isExpandedState, setIsExpandedState] = useState(false);

  useAnimatedReaction(
    () => isExpanded.value,
    (expanded) => {
      scheduleOnRN(setIsExpandedState, expanded);
    },
  );

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(keyboardHeight.value) - bottomInset + 8,
    };
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (isExpanded.value) {
      const topPosition = headerHeight + 8;
      const bottomPosition = keyboardHeight.value + 8;
      const targetHeight = windowHeight - topPosition - bottomPosition;
      return {
        height: withTiming(targetHeight, {
          duration: 250,
          easing: Easing.out(Easing.ease),
        }),
      };
    }
    return {
      height: withTiming(INITIAL_CONTAINER_HEIGHT, {
        duration: 250,
        easing: Easing.out(Easing.ease),
      }),
    };
  }, [windowHeight, bottomInset, headerHeight]);

  function handleFocus() {
    inputRef.current?.focus();
  }

  function handleDismiss() {
    KeyboardController.dismiss();
  }

  function handleExpand() {
    isExpanded.value = true;
  }

  function handleCollapse() {
    isExpanded.value = false;
  }

  const panGesture = Gesture.Pan()
    .activeOffsetY([-15, 15])
    .onUpdate((event) => {
      "worklet";
      if (hasTriggeredGesture.value) return;

      const swipeThreshold = 20;
      const isSwipeUp = event.translationY < -swipeThreshold;
      const isSwipeDown = event.translationY > swipeThreshold;

      if (isSwipeUp) {
        hasTriggeredGesture.value = true;
        if (!isKeyboardVisible) {
          // Keyboard not open -> focus input to open keyboard
          scheduleOnRN(handleFocus);
        } else if (!isExpanded.value) {
          // Keyboard open but not expanded -> expand to full height
          scheduleOnRN(handleExpand);
        }
      } else if (isSwipeDown) {
        hasTriggeredGesture.value = true;
        if (isExpanded.value) {
          // Expanded -> collapse to regular height
          scheduleOnRN(handleCollapse);
        } else if (isKeyboardVisible) {
          // Not expanded but keyboard open -> dismiss keyboard
          scheduleOnRN(handleDismiss);
        }
      }
    })
    .onEnd(() => {
      "worklet";
      hasTriggeredGesture.value = false;
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    "worklet";
    if (!isKeyboardVisible) {
      scheduleOnRN(handleFocus);
    }
  });

  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

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
        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[
              {
                height: INITIAL_CONTAINER_HEIGHT,
                width: "100%",
                borderRadius: 24,
                borderWidth: 1,
                paddingTop: 24,
                paddingHorizontal: 12,
                paddingBottom: 8,
                gap: 12,
                backgroundColor: Colors.white,
                borderColor: Colors.white,
                shadowColor: "rgb(0, 44, 42)",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 24,
                elevation: 8,
                flex: 1,
              },
              containerAnimatedStyle,
            ]}
          >
            <TextInput
              ref={inputRef}
              placeholder={placeholder}
              value={text}
              onChangeText={onChangeText}
              placeholderTextColor={Colors.primary50}
              style={{ fontSize: 16, fontWeight: "500", lineHeight: 19, flex: 1 }}
              cursorColor={Colors.primary100}
              selectionColor={Colors.primary100}
              multiline={true}
              scrollEnabled={isExpandedState}
            />

            <InputActions onSend={onSend} disabled={!text.trim()} />
          </Animated.View>
        </GestureDetector>

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
