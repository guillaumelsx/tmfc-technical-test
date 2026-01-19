import { Colors } from "@/constants/Colors";
import { Text as TamaguiText, TextProps } from "tamagui";

export const Text = (props: TextProps) => <TamaguiText color={Colors.primary100} {...props} />;

export const Heading5 = (props: TextProps) => <Text fontSize={16} fontWeight="600" {...props} />;

export const Paragraph1 = (props: TextProps) => <Text fontSize={16} fontWeight="500" {...props} />;

export const Paragraph3 = (props: TextProps) => <Text fontSize={12} fontWeight="500" {...props} />;

export const Paragraph3Bold = (props: TextProps) => (
  <Text fontSize={12} fontWeight="600" {...props} />
);
