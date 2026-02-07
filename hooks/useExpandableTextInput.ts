import { useEffect } from "react";
import { TextInput } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { KeyboardController, useKeyboardState } from "react-native-keyboard-controller";
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type Params = {
  inputRef: React.RefObject<TextInput | null>;
  lineHeight: number;
  maxLines?: number;
  fullHeight: number;
};

export function useExpandableTextInput({ inputRef, lineHeight, maxLines = 6, fullHeight }: Params) {
  const MAX_HEIGHT = maxLines * lineHeight;

  const { isVisible } = useKeyboardState();
  const keyboardVisible = useSharedValue(false);
  const fullHeightSV = useSharedValue(fullHeight);

  useEffect(() => {
    keyboardVisible.value = isVisible;
  }, [isVisible]);

  useEffect(() => {
    fullHeightSV.value = fullHeight;
  }, [fullHeight]);

  const collapsedHeight = useSharedValue(lineHeight);
  const animatedHeight = useSharedValue(lineHeight);
  const expanded = useSharedValue(false);

  const onContentSizeChange = (h: number) => {
    "worklet";
    const clamped = Math.min(h, MAX_HEIGHT);
    if (!expanded.value) {
      collapsedHeight.value = clamped;
      animatedHeight.value = clamped;
    }
  };

  const expand = () => {
    "worklet";
    expanded.value = true;
    animatedHeight.value = withTiming(fullHeightSV.value, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
  };

  const collapse = () => {
    "worklet";
    expanded.value = false;
    animatedHeight.value = withTiming(collapsedHeight.value, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
  };

  const focus = () => inputRef.current?.focus();
  const dismiss = () => KeyboardController.dismiss();

  const pan = Gesture.Pan().onEnd((e) => {
    if (e.translationY < -30) {
      if (!keyboardVisible.value) scheduleOnRN(focus);
      else expand();
    }
    if (e.translationY > 30) {
      if (expanded.value) collapse();
      else scheduleOnRN(dismiss);
    }
  });

  const tap = Gesture.Tap().onEnd(() => {
    if (!keyboardVisible.value) scheduleOnRN(focus);
  });

  const gesture = Gesture.Exclusive(pan, tap);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return { animatedStyle, gesture, onContentSizeChange, expanded };
}
