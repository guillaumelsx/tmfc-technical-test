import { Colors } from "@/constants/Colors";
import { type Message, MessageRole } from "@/types/message";
import { formatMessageTime } from "@/utils/date";
import { View, type ViewProps, XStack, YStack } from "tamagui";
import Avatar from "./Avatar";
import { Paragraph1, Paragraph3 } from "./Text";

interface MessageItemProps extends ViewProps {
  message: Message;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  avatarUrl?: string;
  avatarInitials?: string;
}

export default function MessageItem({
  message,
  showAvatar = true,
  showTimestamp = true,
  avatarUrl,
  avatarInitials,
  ...props
}: MessageItemProps) {
  const isUser = message.role === MessageRole.User;

  function renderAvatar() {
    if (!showAvatar) {
      return <View width={28} />;
    }

    return <Avatar size={28} avatarUrl={avatarUrl} avatarInitials={avatarInitials} />;
  }

  return (
    <XStack
      justifyContent={isUser ? "flex-end" : "flex-start"}
      alignItems="flex-end"
      gap={4}
      {...props}
    >
      {!isUser && renderAvatar()}

      <View maxWidth="75%" alignItems={isUser ? "flex-end" : "flex-start"}>
        <YStack
          paddingHorizontal={16}
          paddingVertical={12}
          borderRadius={20}
          backgroundColor={isUser ? Colors.green5 : Colors.primary5}
          gap={4}
        >
          <Paragraph1>{message.content}</Paragraph1>
          {showTimestamp && (
            <Paragraph3 color={Colors.primary60} textAlign={isUser ? "right" : "left"}>
              {formatMessageTime(message.createdAt)}
            </Paragraph3>
          )}
        </YStack>
      </View>

      {isUser && renderAvatar()}
    </XStack>
  );
}
