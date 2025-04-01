"use client"

import { useState } from "react"
import { 
  Bell, 
  Lock, 
  UserRound, 
  Globe, 
  Mail, 
  Moon, 
  Sun, 
  Smartphone, 
  HelpCircle, 
  LogOut,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="notifications" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto bg-muted/50 p-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>
        
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-events">Events and activities</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive emails about upcoming alumni events
                      </p>
                    </div>
                    <Switch id="email-events" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-messages">Messages</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive emails when you get a new message
                      </p>
                    </div>
                    <Switch id="email-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-jobs">Job opportunities</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive emails about new job postings
                      </p>
                    </div>
                    <Switch id="email-jobs" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-newsletters">Newsletters</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive monthly alumni newsletters
                      </p>
                    </div>
                    <Switch id="email-newsletters" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">In-App Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-messages">Messages</Label>
                      <p className="text-xs text-muted-foreground">
                        Show notification when you receive a new message
                      </p>
                    </div>
                    <Switch id="app-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-mentions">Mentions</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when someone mentions you
                      </p>
                    </div>
                    <Switch id="app-mentions" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-events">Events</Label>
                      <p className="text-xs text-muted-foreground">
                        Reminders for events you&apos;re attending
                      </p>
                    </div>
                    <Switch id="app-events" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Digest</h3>
                <div className="space-y-2">
                  <Label>How often would you like to receive notification summaries?</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your information and how it&apos;s used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Profile Visibility</h3>
                <RadioGroup defaultValue="all_alumni" className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="all_alumni" id="all_alumni" className="mt-1" />
                    <Label htmlFor="all_alumni" className="grid gap-1 font-normal">
                      <span>All Alumni</span>
                      <span className="text-xs text-muted-foreground">
                        Your profile is visible to all members of the alumni network
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="connections" id="connections" className="mt-1" />
                    <Label htmlFor="connections" className="grid gap-1 font-normal">
                      <span>Connections Only</span>
                      <span className="text-xs text-muted-foreground">
                        Only your connections can view your full profile
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="limited" id="limited" className="mt-1" />
                    <Label htmlFor="limited" className="grid gap-1 font-normal">
                      <span>Limited Profile</span>
                      <span className="text-xs text-muted-foreground">
                        Only show basic information to other alumni
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Information Visibility</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-email">Show email address</Label>
                    <Switch id="show-email" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-phone">Show phone number</Label>
                    <Switch id="show-phone" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-education">Show education details</Label>
                    <Switch id="show-education" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-work">Show work experience</Label>
                    <Switch id="show-work" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-location">Show current location</Label>
                    <Switch id="show-location" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Communication Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-messages">Allow direct messages</Label>
                    <Switch id="allow-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-connections">Allow connection requests</Label>
                    <Switch id="allow-connections" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Privacy Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Manage your personal data and privacy options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Download Your Data</p>
                    <p className="text-sm text-muted-foreground">
                      Get a copy of all your personal data
                    </p>
                  </div>
                  <Button variant="outline">Export Data</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Account Deletion</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all your data
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your alumni portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Theme Mode</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className={cn(
                    "cursor-pointer border-2 rounded-lg p-3 space-y-2 flex flex-col items-center",
                    "border-primary bg-background"
                  )}>
                    <Sun className="h-6 w-6 text-amber-500" />
                    <span className="text-sm font-medium">Light</span>
                  </div>
                  
                  <div className={cn(
                    "cursor-pointer border-2 rounded-lg p-3 space-y-2 flex flex-col items-center",
                    "border-muted"
                  )}>
                    <Moon className="h-6 w-6 text-blue-500" />
                    <span className="text-sm font-medium">Dark</span>
                  </div>
                  
                  <div className={cn(
                    "cursor-pointer border-2 rounded-lg p-3 space-y-2 flex flex-col items-center",
                    "border-muted"
                  )}>
                    <div className="flex">
                      <Sun className="h-6 w-6 text-amber-500" />
                      <Moon className="h-6 w-6 text-blue-500 -ml-2" />
                    </div>
                    <span className="text-sm font-medium">System</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Font Size</h3>
                <RadioGroup defaultValue="medium" className="grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroupItem value="small" id="small-font" className="sr-only" />
                    <Label
                      htmlFor="small-font"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-background p-3"
                    >
                      <span className="text-xs mb-2">Small</span>
                      <span className="text-sm">Aa</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="medium" id="medium-font" className="sr-only" />
                    <Label
                      htmlFor="medium-font"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-primary bg-background p-3"
                    >
                      <span className="text-xs mb-2">Medium</span>
                      <span className="text-base">Aa</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="large" id="large-font" className="sr-only" />
                    <Label
                      htmlFor="large-font"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-background p-3"
                    >
                      <span className="text-xs mb-2">Large</span>
                      <span className="text-lg">Aa</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Color Accent</h3>
                <RadioGroup defaultValue="blue" className="grid grid-cols-4 gap-4">
                  {[
                    { value: "blue", color: "bg-blue-500" },
                    { value: "green", color: "bg-green-500" },
                    { value: "violet", color: "bg-violet-500" },
                    { value: "orange", color: "bg-orange-500" },
                  ].map((item) => (
                    <div key={item.value}>
                      <RadioGroupItem
                        value={item.value}
                        id={`${item.value}-color`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`${item.value}-color`}
                        className="flex flex-col space-y-3 cursor-pointer items-center justify-between rounded-lg border-2 border-muted p-3"
                      >
                        <div className={`h-5 w-5 rounded-full ${item.color}`} />
                        <span className="text-xs capitalize">{item.value}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button>Apply Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 