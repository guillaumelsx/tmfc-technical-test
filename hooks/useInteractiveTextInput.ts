import { TextInput } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { KeyboardController, useKeyboardState } from "react-native-keyboard-controller";
import { type SharedValue, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export default function useInteractiveTextInput(
  inputRef: React.RefObject<TextInput | null>,
  isExpanded: SharedValue<boolean>,
) {
  const { isVisible: isKeyboardVisible } = useKeyboardState();
  const hasTriggeredGesture = useSharedValue(false);

  function handleFocus() {
    inputRef.current?.focus();
  }

  function handleDismiss() {
    KeyboardController.dismiss();
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
          scheduleOnRN(handleFocus);
        } else if (!isExpanded.value) {
          isExpanded.value = true;
        }
      } else if (isSwipeDown) {
        hasTriggeredGesture.value = true;
        if (isExpanded.value) {
          isExpanded.value = false;
        } else if (isKeyboardVisible) {
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

  return { gesture: composedGesture };
}
