import { ChevronLeft, PhoneFill } from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { Heading5, Paragraph3 } from "@/components/Text";
import { Colors } from "@/constants/Colors";
import { Client } from "@/types/client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, XStack, YStack } from "tamagui";

interface ChatHeaderProps {
  client: Client;
  onBackPress?: () => void;
  onCallPress?: () => void;
}

export default function ChatHeader({ client, onBackPress, onCallPress }: ChatHeaderProps) {
  const { top: topInset } = useSafeAreaInsets();

  return (
    <XStack
      alignItems="center"
      paddingTop={topInset + 8}
      paddingHorizontal={20}
      paddingBottom={16}
      gap={8}
      backgroundColor={Colors.white}
      boxShadow="0 2px 24px 0 rgba(0, 44, 42, 0.08)"
      zIndex={1}
    >
      <HeaderButton icon={<ChevronLeft />} onPress={onBackPress} />

      <XStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        height={44}
        paddingVertical={4}
        paddingHorizontal={12}
        gap={8}
      >
        <Avatar size={36} avatarUrl={client.avatarUrl} avatarInitials={undefined} />

        <YStack>
          <Heading5>{client.name}</Heading5>
          <Paragraph3 color={Colors.primary60}>{client.company}</Paragraph3>
        </YStack>
      </XStack>

      <HeaderButton icon={<PhoneFill />} onPress={onCallPress} />
    </XStack>
  );
}

function HeaderButton({ icon, onPress }: { icon: React.ReactNode; onPress?: () => void }) {
  return (
    <View width={44} height={44} justifyContent="center" alignItems="center" onPress={onPress}>
      {icon}
    </View>
  );
}
