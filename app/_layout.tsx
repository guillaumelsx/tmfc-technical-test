import { defaultConfig } from "@tamagui/config/v4";
import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { createTamagui, TamaguiProvider } from "tamagui";

const config = createTamagui(defaultConfig);

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <TamaguiProvider config={config}>
        <Stack screenOptions={{ headerShown: false }} />
      </TamaguiProvider>
    </KeyboardProvider>
  );
}
