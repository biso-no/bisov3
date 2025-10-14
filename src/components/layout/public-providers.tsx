"use client";
import "@assistant-ui/styles/index.css";
import "@assistant-ui/styles/markdown.css";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { CampusProvider } from "../context/campus";

export const PublicProviders = ({ children }: { children: React.ReactNode }) => {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/public-assistant",
    }),
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <CampusProvider>
        {children}
      </CampusProvider>
    </AssistantRuntimeProvider>
  );
};
