import { ToolCallMessagePartComponent } from "@assistant-ui/react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"

export const ToolFallback: ToolCallMessagePartComponent = ({ toolName, argsText, result }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  return (
    <div className="aui-tool-fallback-root">
      <div className="aui-tool-fallback-bar">
        <CheckIcon className="aui-tool-fallback-icon" />
        <p className="aui-tool-fallback-title">
          Used tool: <b>{toolName}</b>
        </p>
        <Button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </div>
      {!isCollapsed && (
        <div className="aui-tool-fallback-details">
          <div className="aui-tool-fallback-args">
            <pre className="aui-pre-wrap">{argsText}</pre>
          </div>
          {result !== undefined && (
            <div className="aui-tool-fallback-result">
              <p className="aui-tool-fallback-result-title">Result:</p>
              <pre className="aui-pre-wrap">{typeof result === "string" ? result : JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


