import { Colors } from "@/constants/Colors";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function ChevronLeft(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M6.703 12.85c-.432-.529-.4-1.31.093-1.804l6.902-6.901.102-.093a1.348 1.348 0 011.897 1.897l-.092.102-5.95 5.95 5.95 5.948a1.349 1.349 0 01-1.907 1.906l-6.902-6.902-.093-.102z"
        fill={Colors.primary100}
      />
    </Svg>
  );
}
