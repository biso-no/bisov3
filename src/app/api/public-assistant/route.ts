import { openai } from "@ai-sdk/openai"
import { streamText, convertToModelMessages, tool, type UIMessage } from "ai"
import { z } from "zod"
import { listEvents } from "@/app/actions/events"
import { listJobs } from "@/app/actions/jobs"

export const maxDuration = 40

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToModelMessages(messages),
    tools: {
      search_events: tool({
        description: "Search public events",
        inputSchema: z.object({ campus: z.string().optional(), status: z.string().optional(), search: z.string().optional() }),
        execute: async (q) => {
          const events = await listEvents({ campus: q.campus, status: q.status, search: q.search, limit: 20 })
          return events?.map((e: any) => ({ id: e.$id, title: e.title, start_date: e.start_date, campus: e.campus }))
        },
      }),
      search_jobs: tool({
        description: "Search public jobs",
        inputSchema: z.object({ campus: z.string().optional(), status: z.string().optional(), query: z.string().optional() }),
        execute: async (q) => {
          const jobs = await listJobs({ campus: q.campus, status: q.status, query: q.query, limit: 20 })
          return jobs?.map((j: any) => ({ id: j.$id, title: j.title, campus: j.campus, type: j.type }))
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}


