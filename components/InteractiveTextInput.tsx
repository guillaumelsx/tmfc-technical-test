import { Colors } from "@/constants/Colors";
import useInteractiveTextInput from "@/hooks/useInteractiveTextInput";
import { GlassView } from "expo-glass-effect";
import { useRef } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";

const INPUT_LINE_HEIGHT = 19;
const MAX_COLLAPSED_LINES = 6;
const MAX_INPUT_HEIGHT = INPUT_LINE_HEIGHT * MAX_COLLAPSED_LINES;

interface InteractiveTextInputProps {
  value: TextInputProps["value"];
  placeholder: TextInputProps["placeholder"];
  onChangeText: TextInputProps["onChangeText"];
  children?: React.ReactNode;
}

export default function InteractiveTextInput({
  value,
  placeholder,
  onChangeText,
  children,
}: InteractiveTextInputProps) {
  const inputRef = useRef<TextInput>(null);
  const { gesture } = useInteractiveTextInput(inputRef);

  return (
    <GestureDetector gesture={gesture}>
      <GlassView isInteractive style={[styles.container]}>
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={Colors.primary50}
          style={[styles.input]}
          cursorColor={Colors.primary100}
          selectionColor={Colors.primary100}
          multiline={true}
        />

        {children}
      </GlassView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 24,
    // borderWidth: 1,
    paddingTop: 24,
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 12,
    // backgroundColor: Colors.white,
    // borderColor: Colors.white,
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
