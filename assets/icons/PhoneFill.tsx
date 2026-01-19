import { Colors } from "@/constants/Colors";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function PhoneFill(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M20.6 16.677v2.65a1.762 1.762 0 01-1.203 1.68c-.234.079-.481.108-.727.086a17.535 17.535 0 01-7.637-2.712 17.24 17.24 0 01-5.31-5.299 17.456 17.456 0 01-2.716-7.657 1.763 1.763 0 011.048-1.774c.224-.1.467-.15.713-.15h2.655a1.772 1.772 0 011.77 1.518c.112.848.32 1.68.62 2.482a1.763 1.763 0 01-.399 1.863L8.29 10.486a14.146 14.146 0 005.31 5.299l1.124-1.122a1.77 1.77 0 011.867-.397c.803.299 1.637.506 2.486.618a1.772 1.772 0 011.522 1.793z"
        fill={Colors.primary100}
      />
    </Svg>
  );
}
