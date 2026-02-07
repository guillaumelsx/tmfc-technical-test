import { Colors } from "@/constants/Colors";
import { useExpandableTextInput } from "@/hooks/useExpandableTextInput";
import { useRef } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

interface ExpandableTextInputProps {
  value: TextInputProps["value"];
  onChangeText: TextInputProps["onChangeText"];
  placeholder: TextInputProps["placeholder"];
  fullHeight: number;
  children?: React.ReactNode;
}

export function ExpandableTextInput({
  value,
  onChangeText,
  placeholder,
  fullHeight,
  children,
}: ExpandableTextInputProps) {
  const inputRef = useRef<TextInput>(null);

  const { animatedStyle, gesture, onContentSizeChange, expanded } = useExpandableTextInput({
    inputRef,
    lineHeight: 19,
    maxLines: 6,
    fullHeight,
  });

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={{
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
        }}
      >
        <Animated.View style={[{ overflow: "hidden" }, animatedStyle]}>
          <TextInput
            ref={inputRef}
            multiline
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.primary50}
            cursorColor={Colors.primary100}
            selectionColor={Colors.primary100}
            style={{ flex: 1, fontSize: 16, fontWeight: "500", lineHeight: 19 }}
            onContentSizeChange={(e) => onContentSizeChange(e.nativeEvent.contentSize.height)}
            scrollEnabled={expanded.value}
          />
        </Animated.View>

        {children}
      </View>
    </GestureDetector>
  );
}
