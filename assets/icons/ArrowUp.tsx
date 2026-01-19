import { Colors } from "@/constants/Colors";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function ArrowUp(props: SvgProps) {
  return (
    <Svg width={23} height={23} viewBox="0 0 23 23" fill="none" {...props}>
      <Path
        d="M10.51 3.778a1.173 1.173 0 011.57.08l5.248 5.25a1.173 1.173 0 01-1.657 1.659l-3.25-3.25v10.296a1.172 1.172 0 01-2.343 0V7.518L6.83 10.767a1.173 1.173 0 01-1.658-1.659l5.25-5.25.09-.08z"
        fill={Colors.primary100}
      />
    </Svg>
  );
}
