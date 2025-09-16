"use client";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";

export const PublicProviders = ({ children }: { children: React.ReactNode }) => {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/public-assistant",
    }),
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
};