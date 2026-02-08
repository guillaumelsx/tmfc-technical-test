import { initialMessages } from "@/constants/messages";
import type { Client } from "@/types/client";
import { type Message, MessageRole } from "@/types/message";
import { getInitials } from "@/utils/user";
import { formatISO } from "date-fns";
import { useState } from "react";

const USER_AVATAR_URL = "https://avatars.githubusercontent.com/u/43066859";

export interface UseChatMessagesResult {
  messages: Message[];
  addMessage: (content: string) => void;
  getMessageProps: (
    message: Message,
    index: number,
  ) => {
    showAvatar: boolean;
    showTimestamp: boolean;
    avatarUrl?: string;
    avatarInitials?: string;
    marginTop: number;
  };
}

export function useChatMessages(client: Client): UseChatMessagesResult {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  function addMessage(content: string) {
    if (!content.trim()) {
      return;
    }

    const now = new Date();
    setMessages([
      ...messages,
      {
        id: Math.random().toString(36),
        role: MessageRole.User,
        content,
        createdAt: formatISO(now),
        updatedAt: formatISO(now),
      },
    ]);
  }

  function getMessageProps(message: Message, index: number) {
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const isLastInGroup = nextMessage?.role !== message.role;
    const isFirstInGroup = previousMessage?.role !== message.role;

    // Calculate spacing: 24 between groups, 8 within same group
    const marginTop = index === 0 ? 0 : isFirstInGroup ? 24 : 8;

    if (message.role === MessageRole.User) {
      return {
        showAvatar: isLastInGroup,
        showTimestamp: isLastInGroup,
        avatarUrl: USER_AVATAR_URL,
        avatarInitials: undefined,
        marginTop,
      };
    }

    return {
      showAvatar: isLastInGroup,
      showTimestamp: isLastInGroup,
      avatarUrl: client.avatarUrl,
      avatarInitials: getInitials(client.name),
      marginTop,
    };
  }

  return {
    messages,
    addMessage,
    getMessageProps,
  };
}
