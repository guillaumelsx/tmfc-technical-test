import { Avatar as AvatarIcon } from "@/assets/icons";
import { Colors } from "@/constants/Colors";
import { Circle, Image } from "tamagui";
import { Paragraph3Bold } from "./Text";

interface AvatarProps {
  size?: number;
  avatarUrl?: string;
  avatarInitials?: string;
}

export default function Avatar({ size = 28, avatarUrl, avatarInitials }: AvatarProps) {
  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        width={size}
        height={size}
        borderRadius={size / 2}
        objectFit="cover"
      />
    );
  }

  if (avatarInitials) {
    return (
      <Circle
        size={size}
        backgroundColor={Colors.primary5}
        justifyContent="center"
        alignItems="center"
      >
        <Paragraph3Bold color={Colors.green100}>{avatarInitials}</Paragraph3Bold>
      </Circle>
    );
  }

  return <AvatarIcon width={size} height={size} />;
}
