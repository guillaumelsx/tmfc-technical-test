import { Colors } from "@/constants/Colors";
import useInteractiveTextInput from "@/hooks/useInteractiveTextInput";
import { BlurView } from "expo-blur";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, TextInput, useWindowDimensions } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolateColor,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { View } from "tamagui";
import InputActionsRow from "./InputActionsRow";

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

const INPUT_LINE_HEIGHT = 19;
const MAX_COLLAPSED_LINES = 6;
const MAX_INPUT_HEIGHT = INPUT_LINE_HEIGHT * MAX_COLLAPSED_LINES;
const KEYBOARD_GAP = 8;
const EXPAND_DURATION = 250;

interface MessageInputProps {
  text: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  keyboardHeight: SharedValue<number>;
  headerHeight: number;
}

export default function ChatInput({
  text,
  onChangeText,
  onSend,
  placeholder = "Text message",
  onLayout,
  keyboardHeight,
  headerHeight,
}: MessageInputProps) {
  const inputRef = useRef<TextInput>(null);
  const collapseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);

  const isExpanded = useSharedValue(false);
  const collapsedInnerHeight = useSharedValue(0);
  const containerTop = useSharedValue(0);
  const expandProgress = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const { gesture } = useInteractiveTextInput(inputRef, isExpanded);

  const { bottom: bottomInset } = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const handleExpandedChange = useCallback((value: boolean) => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    if (value) {
      setExpanded(true);
    } else {
      collapseTimeoutRef.current = setTimeout(() => {
        setExpanded(false);
        collapseTimeoutRef.current = null;
      }, EXPAND_DURATION);
    }
  }, []);

  useAnimatedReaction(
    () => isExpanded.value,
    (current, previous) => {
      if (current !== previous) {
        scheduleOnRN(handleExpandedChange, current);
      }
    },
    [],
  );

  // Reset expanded state when keyboard closes
  useAnimatedReaction(
    () => keyboardHeight.value,
    (current) => {
      if (current === 0 && isExpanded.value) {
        isExpanded.value = false;
      }
    },
    [],
  );

  // Animate container top based on expand/collapse state
  useAnimatedReaction(
    () => ({
      expanded: isExpanded.value,
      fakeH: Math.max(keyboardHeight.value - bottomInset + KEYBOARD_GAP, 0),
      innerH: collapsedInnerHeight.value,
    }),
    (current, previous) => {
      if (current.innerH === 0) return;
      const targetTop = current.expanded
        ? headerHeight
        : screenHeight - current.innerH - current.fakeH;

      const expandedChanged = previous && current.expanded !== previous.expanded;
      if (expandedChanged) {
        isAnimating.value = true;
        const timingConfig = { duration: EXPAND_DURATION, easing: Easing.out(Easing.ease) };
        expandProgress.value = withTiming(current.expanded ? 1 : 0, timingConfig);
        containerTop.value = withTiming(targetTop, timingConfig, (finished) => {
          if (finished) isAnimating.value = false;
        });
      } else if (!isAnimating.value) {
        containerTop.value = targetTop;
      }
    },
    [headerHeight, screenHeight, bottomInset],
  );

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    top: containerTop.value,
  }));

  const glassOverlayStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      expandProgress.value,
      [0, 1],
      ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"],
    ),
  }));

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
      <Animated.View
        style={[
          { width: "100%", position: "absolute", bottom: 0, zIndex: 2 },
          ready && containerAnimatedStyle,
        ]}
      >
        <View
          paddingTop={8}
          paddingHorizontal={16}
          paddingBottom={bottomInset}
          onLayout={(e) => {
            if (!expanded) {
              const height = e.nativeEvent.layout.height;
              collapsedInnerHeight.value = height;
              if (!ready) {
                const fakeH = Math.max(keyboardHeight.value - bottomInset + KEYBOARD_GAP, 0);
                containerTop.value = screenHeight - height - fakeH;
                setReady(true);
              }
              onLayout?.(e);
            }
          }}
          flex={expanded ? 1 : undefined}
        >
          <GestureDetector gesture={gesture}>
            <AnimatedGlassView
              isInteractive
              style={[styles.container, glassOverlayStyle, expanded && { flex: 1 }]}
            >
              <TextInput
                ref={inputRef}
                placeholder={placeholder}
                value={text}
                onChangeText={onChangeText}
                placeholderTextColor={Colors.primary50}
                style={[styles.input, expanded && { flex: 1, maxHeight: 99999 }]}
                cursorColor={Colors.primary100}
                selectionColor={Colors.primary100}
                multiline={true}
              />
              <InputActionsRow disabled={!text.trim()} onSend={onSend} />
            </AnimatedGlassView>
          </GestureDetector>
        </View>

        <Animated.View style={fakeView} />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 12,
    boxShadow: "0 2px 24px 0 rgba(0, 44, 42, 0.08)",
  },
  input: {
    maxHeight: MAX_INPUT_HEIGHT,
    padding: 0,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: INPUT_LINE_HEIGHT,
  },
});
