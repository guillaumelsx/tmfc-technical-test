export enum MessageRole {
  User = "user",
  Client = "client",
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  updatedAt: string;
}
