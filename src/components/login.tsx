"use client"

import { useState } from "react"
import { Mail, Send, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { signInWithAzure, signInWithMagicLink } from "@/lib/server"

export function Login() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address." })
      return
    }
    setIsLoading(true)
    await signInWithMagicLink(email)
    setIsLoading(false)
    setMessage({ type: "success", text: "Magic link sent! Please check your email." })
    // Here you would typically call your API to send the magic link or token
  }

  const handleAdminLogin = async () => {
    await signInWithAzure()
  }

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUserLogin}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          className="w-full" 
          onClick={handleUserLogin} 
          disabled={isLoading}
        >
          {isLoading ? (
            "Sending..."
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Send Magic Link
            </>
          )}
        </Button>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleAdminLogin}>
          <Key className="mr-2 h-4 w-4" /> Admin Login with Microsoft
        </Button>
      </CardFooter>
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className="mt-4 mx-4 mb-4">
          <AlertTitle>{message.type === "error" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </Card>
  )
}