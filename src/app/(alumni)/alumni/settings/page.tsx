"use client"

import { useState, useEffect } from "react"
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
import { PageHeader } from "@/components/ui/page-header"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications")
  
  // Set document title
  useEffect(() => {
    document.title = "Settings | BISO";
  }, []);

  return (
    <div className="relative min-h-screen pb-12 bg-primary-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-gold-default/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      <div className="container pt-8 pb-8 space-y-6">
        <PageHeader
          gradient
          heading="Settings"
          subheading="Manage your account settings and preferences"
        />
        
        <Tabs defaultValue="notifications" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 glass-dark backdrop-blur-md border border-secondary-100/20 p-1">
            <TabsTrigger 
              value="notifications" 
              className={cn(
                "flex items-center gap-2 data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                activeTab === "notifications" ? "bg-gradient-to-r from-blue-accent/70 to-secondary-100/70 text-white rounded font-medium" : "text-gray-400"
              )}
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className={cn(
                "flex items-center gap-2 data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                activeTab === "privacy" ? "bg-gradient-to-r from-blue-accent/70 to-secondary-100/70 text-white rounded font-medium" : "text-gray-400"
              )}
            >
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className={cn(
                "flex items-center gap-2 data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full",
                activeTab === "appearance" ? "bg-gradient-to-r from-blue-accent/70 to-secondary-100/70 text-white rounded font-medium" : "text-gray-400"
              )}
            >
              <Sun className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4 animate-in fade-in-50 duration-300">
            <Card variant="glass-dark" className="border border-secondary-100/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-accent" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-secondary-100 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Email Notifications</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-events" className="text-white">Events and activities</Label>
                        <p className="text-xs text-gray-400">
                          Receive emails about upcoming alumni events
                        </p>
                      </div>
                      <Switch id="email-events" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-messages" className="text-white">Messages</Label>
                        <p className="text-xs text-gray-400">
                          Receive emails when you get a new message
                        </p>
                      </div>
                      <Switch id="email-messages" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-jobs" className="text-white">Job opportunities</Label>
                        <p className="text-xs text-gray-400">
                          Receive emails about new job postings
                        </p>
                      </div>
                      <Switch id="email-jobs" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-newsletters" className="text-white">Newsletters</Label>
                        <p className="text-xs text-gray-400">
                          Receive monthly alumni newsletters
                        </p>
                      </div>
                      <Switch id="email-newsletters" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-secondary-100 flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    <span>In-App Notifications</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-messages" className="text-white">Messages</Label>
                        <p className="text-xs text-gray-400">
                          Show notification when you receive a new message
                        </p>
                      </div>
                      <Switch id="app-messages" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-mentions" className="text-white">Mentions</Label>
                        <p className="text-xs text-gray-400">
                          Notify when someone mentions you
                        </p>
                      </div>
                      <Switch id="app-mentions" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-events" className="text-white">Events</Label>
                        <p className="text-xs text-gray-400">
                          Reminders for events you&apos;re attending
                        </p>
                      </div>
                      <Switch id="app-events" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-blue-accent flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>Notification Digest</span>
                  </h3>
                  <div className="space-y-2 p-2 hover:bg-white/5 rounded-md transition-colors">
                    <Label className="text-white">How often would you like to receive notification summaries?</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="mt-2 bg-primary-90/30 border-white/10">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="glass-dark border-secondary-100/20">
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="daily">Daily digest</SelectItem>
                        <SelectItem value="weekly">Weekly digest</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-white/10 pt-4">
                <Button variant="glass">Reset to Default</Button>
                <Button variant="gradient">Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4 animate-in fade-in-50 duration-300">
            <Card variant="glass-dark" className="border border-secondary-100/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-blue-accent" />
                  <span>Privacy Settings</span>
                </CardTitle>
                <CardDescription>
                  Control who can see your information and how it&apos;s used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-secondary-100 flex items-center">
                    <UserRound className="h-4 w-4 mr-2" />
                    <span>Profile Visibility</span>
                  </h3>
                  <RadioGroup defaultValue="all_alumni" className="space-y-3">
                    <div className="flex items-start space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
                      <RadioGroupItem value="all_alumni" id="all_alumni" className="mt-1" />
                      <Label htmlFor="all_alumni" className="grid gap-1 font-normal">
                        <span className="text-white">All Alumni</span>
                        <span className="text-xs text-gray-400">
                          Your profile is visible to all members of the alumni network
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
                      <RadioGroupItem value="connections" id="connections" className="mt-1" />
                      <Label htmlFor="connections" className="grid gap-1 font-normal">
                        <span className="text-white">Connections Only</span>
                        <span className="text-xs text-gray-400">
                          Only your connections can view your full profile
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
                      <RadioGroupItem value="limited" id="limited" className="mt-1" />
                      <Label htmlFor="limited" className="grid gap-1 font-normal">
                        <span className="text-white">Limited Profile</span>
                        <span className="text-xs text-gray-400">
                          Only show basic information to other alumni
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-blue-accent flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Information Visibility</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <Label htmlFor="show-email" className="text-white">Show email address</Label>
                      <Switch id="show-email" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <Label htmlFor="show-phone" className="text-white">Show phone number</Label>
                      <Switch id="show-phone" />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <Label htmlFor="show-education" className="text-white">Show education details</Label>
                      <Switch id="show-education" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <Label htmlFor="show-work" className="text-white">Show work experience</Label>
                      <Switch id="show-work" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <Label htmlFor="show-location" className="text-white">Show current location</Label>
                      <Switch id="show-location" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-secondary-100 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Communication Preferences</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <Label htmlFor="allow-messages" className="text-white">Allow direct messages</Label>
                      <Switch id="allow-messages" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <Label htmlFor="allow-connections" className="text-white">Allow connection requests</Label>
                      <Switch id="allow-connections" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-white/10 pt-4">
                <Button variant="glass">Cancel</Button>
                <Button variant="gradient">Save Privacy Settings</Button>
              </CardFooter>
            </Card>
            
            <Card variant="glass-dark" className="border border-secondary-100/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-gold-default" />
                  <span>Data & Privacy</span>
                </CardTitle>
                <CardDescription>
                  Manage your personal data and privacy options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    <div>
                      <p className="font-medium text-white">Download Your Data</p>
                      <p className="text-sm text-gray-400">
                        Get a copy of all your personal data
                      </p>
                    </div>
                    <Button variant="glass">
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    <div>
                      <p className="font-medium text-white">Account Deletion</p>
                      <p className="text-sm text-gray-400">
                        Permanently delete your account and all your data
                      </p>
                    </div>
                    <Button variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                      <LogOut className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4 animate-in fade-in-50 duration-300">
            <Card variant="glass-dark" className="border border-secondary-100/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Sun className="h-5 w-5 mr-2 text-blue-accent" />
                  <span>Theme Settings</span>
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your alumni portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-secondary-100 flex items-center">
                    <Moon className="h-4 w-4 mr-2" />
                    <span>Theme Mode</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={cn(
                      "cursor-pointer border-2 rounded-lg p-3 space-y-2 flex flex-col items-center glass-dark backdrop-blur-md transition-all duration-300 hover:border-blue-accent/70",
                      "border-white/10 bg-primary-90/30"
                    )}>
                      <Sun className="h-6 w-6 text-amber-500" />
                      <span className="text-sm font-medium text-white">Light</span>
                    </div>
                    
                    <div className={cn(
                      "cursor-pointer border-2 rounded-lg p-3 space-y-2 flex flex-col items-center glass-dark backdrop-blur-md transition-all duration-300 hover:border-blue-accent/70",
                      "border-blue-accent bg-primary-90/30"
                    )}>
                      <Moon className="h-6 w-6 text-blue-accent" />
                      <span className="text-sm font-medium text-white">Dark</span>
                    </div>
                    
                    <div className={cn(
                      "cursor-pointer border-2 rounded-lg p-3 space-y-2 flex flex-col items-center glass-dark backdrop-blur-md transition-all duration-300 hover:border-blue-accent/70",
                      "border-white/10 bg-primary-90/30"
                    )}>
                      <div className="flex">
                        <Sun className="h-6 w-6 text-amber-500" />
                        <Moon className="h-6 w-6 text-blue-accent -ml-2" />
                      </div>
                      <span className="text-sm font-medium text-white">System</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-blue-accent flex items-center">
                    <span className="mr-2 text-lg font-bold">Aa</span>
                    <span>Font Size</span>
                  </h3>
                  <RadioGroup defaultValue="medium" className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="small" id="small-font" className="sr-only" />
                      <Label
                        htmlFor="small-font"
                        className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-white/10 glass-dark bg-primary-90/30 p-3 hover:border-blue-accent/70 transition-all duration-300"
                      >
                        <span className="text-xs mb-2 text-gray-400">Small</span>
                        <span className="text-sm text-white">Aa</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="medium" id="medium-font" className="sr-only" />
                      <Label
                        htmlFor="medium-font"
                        className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-blue-accent glass-dark bg-primary-90/30 p-3 hover:border-blue-accent transition-all duration-300"
                      >
                        <span className="text-xs mb-2 text-gray-400">Medium</span>
                        <span className="text-base text-white">Aa</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="large" id="large-font" className="sr-only" />
                      <Label
                        htmlFor="large-font"
                        className="flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-white/10 glass-dark bg-primary-90/30 p-3 hover:border-blue-accent/70 transition-all duration-300"
                      >
                        <span className="text-xs mb-2 text-gray-400">Large</span>
                        <span className="text-lg text-white">Aa</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gold-default flex items-center">
                    <span className="h-4 w-4 mr-2 rounded-full bg-gradient-to-r from-blue-accent to-gold-default"></span>
                    <span>Color Accent</span>
                  </h3>
                  <RadioGroup defaultValue="blue" className="grid grid-cols-4 gap-4">
                    {[
                      { value: "blue", gradient: "bg-gradient-to-r from-blue-500 to-blue-600" },
                      { value: "green", gradient: "bg-gradient-to-r from-green-500 to-green-600" },
                      { value: "violet", gradient: "bg-gradient-to-r from-violet-500 to-violet-600" },
                      { value: "gold", gradient: "bg-gradient-to-r from-gold-default to-gold-strong" },
                    ].map((item) => (
                      <div key={item.value}>
                        <RadioGroupItem
                          value={item.value}
                          id={`${item.value}-color`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`${item.value}-color`}
                          className="flex flex-col space-y-3 cursor-pointer items-center justify-between rounded-lg border-2 border-white/10 glass-dark p-3 hover:border-blue-accent/70 transition-all duration-300"
                        >
                          <div className={`h-5 w-full rounded-full ${item.gradient}`} />
                          <span className="text-xs capitalize text-white">{item.value}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-white/10 pt-4">
                <Button variant="glass">Reset to Default</Button>
                <Button variant="gradient">Apply Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 