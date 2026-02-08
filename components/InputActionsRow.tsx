import { ArrowUp } from "@/assets/icons";
import { Colors } from "@/constants/Colors";
import { hapticImpact } from "@/utils/haptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import { Circle, XStack } from "tamagui";

interface InputActionsRowProps {
  disabled: boolean;
  onSend: () => void;
}

export default function InputActionsRow({ disabled, onSend }: InputActionsRowProps) {
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
