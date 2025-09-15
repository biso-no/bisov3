"use client"

import { useState } from "react"
import { MessageSquareIcon, XIcon } from "lucide-react"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { AssistantChatTransport } from "@assistant-ui/react-ai-sdk"
import { useChatRuntime } from "@assistant-ui/react-ai-sdk"
import { Thread } from "@/components/assistant-ui/thread"
import { Button } from "@/components/ui/button"

type AssistantFABProps = {
  api: string
  tooltip?: string
}

export function AssistantFAB({ api, tooltip = "Ask AI" }: AssistantFABProps) {
  const [open, setOpen] = useState(false)

  // Ensure system/tools forwarding by using AssistantChatTransport
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({ api }),
  })

  return (
    <div className="aui-fab-root">
      {!open && (
        <Button
          className="aui-fab-button"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label={tooltip}
          title={tooltip}
        >
          <MessageSquareIcon />
        </Button>
      )}

      {open && (
        <div className="aui-fab-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="aui-fab-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aui-fab-modal-header">
              <span className="aui-fab-modal-title">Assistant</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <XIcon />
              </Button>
            </div>
            <div className="aui-fab-modal-body">
              <AssistantRuntimeProvider runtime={runtime}>
                <Thread />
              </AssistantRuntimeProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


