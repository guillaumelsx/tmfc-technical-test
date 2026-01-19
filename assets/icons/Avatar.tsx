import { Colors } from "@/constants/Colors";
import * as React from "react";
import Svg, { Path, Rect, SvgProps } from "react-native-svg";

export default function Avatar(props: SvgProps) {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none" {...props}>
      <Rect width={36} height={36} rx={18} fill={Colors.primary5} />
      <Path
        d="M12 14.453c0 3.828 2.667 6.703 6.094 6.73 3.427.028 6.094-2.902 6.094-6.73 0-3.593-2.694-6.578-6.094-6.578-3.4 0-6.122 2.985-6.095 6.578zM6.75 28.98c2.709 2.888 6.854 4.712 11.166 4.712 4.298 0 8.458-1.824 11.166-4.712-1.962-3.11-6.301-4.961-11.166-4.961-4.906 0-9.231 1.879-11.166 4.96z"
        fill={Colors.primary100}
      />
    </Svg>
  );
}
