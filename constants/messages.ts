import { MessageRole, type Message } from "@/types/message";
import { createDate } from "@/utils/date";

export const initialMessages: Message[] = [
  {
    id: "1",
    role: MessageRole.User,
    content: "Can you please update all the due dates on Linear please",
    createdAt: createDate(9, 11, new Date("2026-03-10")),
    updatedAt: createDate(9, 11, new Date("2026-03-10")),
  },
  {
    id: "2",
    role: MessageRole.Client,
    content: "Hey, what's up about my apartment project?",
    createdAt: createDate(10, 54),
    updatedAt: createDate(10, 54),
  },
  {
    id: "3",
    role: MessageRole.User,
    content:
      "I've transferred the documents to my lawyers. Please get the missing document to me before 2pm tomorrow. Thanks, A ✌️",
    createdAt: createDate(9, 11),
    updatedAt: createDate(9, 11),
  },
  {
    id: "4",
    role: MessageRole.User,
    content: "Done",
    createdAt: createDate(9, 11),
    updatedAt: createDate(9, 11),
  },
  {
    id: "5",
    role: MessageRole.Client,
    content: "When can we visit these appartments?",
    createdAt: createDate(10, 54),
    updatedAt: createDate(10, 54),
  },
  {
    id: "6",
    role: MessageRole.Client,
    content: "I will call you this afternoon to check that everything is in order",
    createdAt: createDate(10, 54),
    updatedAt: createDate(10, 54),
  },
  {
    id: "7",
    role: MessageRole.User,
    content: "Hi Romain, I'm George I'll be in charge of the visit today",
    createdAt: createDate(13, 10),
    updatedAt: createDate(13, 10),
  },
];
