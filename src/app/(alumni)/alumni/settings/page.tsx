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
  Shield,
  Loader2,
  Users,
  Handshake
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
import { 
  fetchUserSubscriptions, 
  updateSubscriptionStatus, 
  fetchPrivacySettings,
  updatePrivacySettings,
  UserPrivacySettings
} from "../actions"
import { toast } from "@/components/ui/use-toast"

interface Subscription {
  $id?: string;
  user_id: string;
  topic: string;
  subscribed: boolean;
  subscriber_id?: string;
}

// Using our local interface to match the backend UserPrivacySettings
interface PrivacyConfig {
  profileVisibility: 'all_alumni' | 'connections' | 'limited';
  showEmail: boolean;
  showPhone: boolean;
  showEducation: boolean;
  showWork: boolean;
  showLocation: boolean;
  showSocial: boolean;
  allowMessages: boolean;
  allowConnections: boolean;
  allowMentoring: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [subscriptions, setSubscriptions] = useState<Record<string, Subscription>>({})
  const [loading, setLoading] = useState(true)
  const [updatingTopic, setUpdatingTopic] = useState<string | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState<PrivacyConfig>({
    profileVisibility: 'all_alumni',
    showEmail: true,
    showPhone: false,
    showEducation: true,
    showWork: true,
    showLocation: true,
    showSocial: true,
    allowMessages: true,
    allowConnections: true,
    allowMentoring: true
  })
  const [privacyLoading, setPrivacyLoading] = useState(true)
  const [savingPrivacy, setSavingPrivacy] = useState(false)
  
  // Set document title
  useEffect(() => {
    document.title = "Settings | BISO";
  }, []);

  // Load user subscription settings
  useEffect(() => {
    async function loadSubscriptions() {
      try {
        setLoading(true);
        const userSubs = await fetchUserSubscriptions();
        setSubscriptions(userSubs);
      } catch (error) {
        console.error('Failed to load subscription settings:', error);
        toast({
          title: "Error",
          description: "Failed to load your notification preferences",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadSubscriptions();
  }, []);

  // Load user privacy settings
  useEffect(() => {
    async function loadPrivacySettings() {
      try {
        setPrivacyLoading(true);
        const settings = await fetchPrivacySettings();
        setPrivacySettings(settings);
      } catch (error) {
        console.error('Failed to load privacy settings:', error);
        toast({
          title: "Error",
          description: "Failed to load your privacy settings",
          variant: "destructive"
        });
      } finally {
        setPrivacyLoading(false);
      }
    }
    
    loadPrivacySettings();
  }, []);

  // Handle subscription toggle
  const handleSubscriptionToggle = async (topic: string, subscribe: boolean) => {
    try {
      setUpdatingTopic(topic);
      
      const success = await updateSubscriptionStatus(topic, subscribe, 'email');
      
      if (success) {
        // Update local state
        setSubscriptions(prev => ({
          ...prev,
          [topic]: {
            ...prev[topic] || { topic, user_id: "" },
            subscribed: subscribe
          }
        }));
        
        toast({
          title: subscribe ? "Subscribed" : "Unsubscribed",
          description: `You have ${subscribe ? 'subscribed to' : 'unsubscribed from'} ${topic.replace('alumni_', '')} notifications`,
        });
      } else {
        throw new Error("Failed to update subscription");
      }
    } catch (error) {
      console.error(`Failed to ${subscribe ? 'subscribe to' : 'unsubscribe from'} ${topic}:`, error);
      toast({
        title: "Error",
        description: `Failed to update your notification preferences`,
        variant: "destructive"
      });
      
      // Revert the local state change in case of error
      const prevValue = subscriptions[topic]?.subscribed ?? false;
      setSubscriptions(prev => ({
        ...prev,
        [topic]: {
          ...prev[topic] || { topic, user_id: "" },
          subscribed: prevValue
        }
      }));
    } finally {
      setUpdatingTopic(null);
    }
  };

  // Handle privacy setting change
  const handlePrivacyChange = (key: keyof PrivacyConfig, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle saving privacy settings
  const handleSavePrivacy = async () => {
    try {
      setSavingPrivacy(true);
      
      // Cast our local state to match the API interface
      const success = await updatePrivacySettings(privacySettings);
      
      if (success) {
        toast({
          title: "Privacy Settings Saved",
          description: "Your privacy settings have been updated successfully",
        });
      } else {
        throw new Error("Failed to update privacy settings");
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to save privacy settings",
        variant: "destructive"
      });
    } finally {
      setSavingPrivacy(false);
    }
  };

  // Reset privacy settings to default
  const handleResetPrivacy = async () => {
    if (privacyLoading || savingPrivacy) return;
    
    try {
      setSavingPrivacy(true);
      
      // Reset to default values
      const defaultSettings: PrivacyConfig = {
        profileVisibility: 'all_alumni',
        showEmail: true,
        showPhone: false,
        showEducation: true,
        showWork: true,
        showLocation: true,
        showSocial: true,
        allowMessages: true,
        allowConnections: true,
        allowMentoring: true
      };
      
      setPrivacySettings(defaultSettings);
      
      // Update in database
      const success = await updatePrivacySettings(defaultSettings);
      
      if (success) {
        toast({
          title: "Reset Complete",
          description: "Your privacy settings have been reset to default",
        });
      } else {
        throw new Error("Failed to reset privacy settings");
      }
    } catch (error) {
      console.error('Error resetting privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to reset privacy settings",
        variant: "destructive"
      });
    } finally {
      setSavingPrivacy(false);
    }
  };

  // Handle saving all preferences
  const handleSavePreferences = async () => {
    setSaveLoading(true);
    
    try {
      // Any additional save logic here
      
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // Reset preferences to default
  const handleResetPreferences = async () => {
    if (loading || saveLoading) return;
    
    const defaultTopics = ["alumni_newsletters", "alumni_jobs", "alumni_messages", "alumni_events"];
    setSaveLoading(true);
    
    try {
      // Reset all to subscribed
      for (const topic of defaultTopics) {
        if (!subscriptions[topic]?.subscribed) {
          await updateSubscriptionStatus(topic, true, 'email');
        }
      }
      
      // Update local state
      const updatedSubs: Record<string, Subscription> = {};
      for (const topic of defaultTopics) {
        updatedSubs[topic] = {
          ...subscriptions[topic] || { topic, user_id: "" },
          subscribed: true
        };
      }
      
      setSubscriptions(updatedSubs);
      
      toast({
        title: "Reset Complete",
        description: "Your notification preferences have been reset to default",
      });
    } catch (error) {
      console.error('Error resetting preferences:', error);
      toast({
        title: "Error",
        description: "Failed to reset preferences",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // Helper to check if subscription is enabled
  const isSubscribed = (topic: string) => subscriptions[topic]?.subscribed ?? false;

  return (
    <div className="relative min-h-screen pb-12 bg-primary-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-gold-default/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      <div className="container p-8 space-y-6">
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
                <CardTitle className="text-xl flex items-center text-secondary-100">
                  <Bell className="h-5 w-5 mr-2 text-blue-accent" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading && (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-accent" />
                    <span className="ml-2 text-gray-400">Loading your preferences...</span>
                  </div>
                )}
                
                {!loading && (
                  <>
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
                          <div className="flex items-center">
                            {updatingTopic === 'alumni_events' && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-accent" />
                            )}
                            <Switch 
                              id="email-events" 
                              checked={isSubscribed('alumni_events')}
                              disabled={loading || updatingTopic === 'alumni_events'}
                              onCheckedChange={(checked) => handleSubscriptionToggle('alumni_events', checked)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-messages" className="text-white">Messages</Label>
                            <p className="text-xs text-gray-400">
                              Receive emails when you get a new message
                            </p>
                          </div>
                          <div className="flex items-center">
                            {updatingTopic === 'alumni_messages' && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-accent" />
                            )}
                            <Switch 
                              id="email-messages" 
                              checked={isSubscribed('alumni_messages')}
                              disabled={loading || updatingTopic === 'alumni_messages'}
                              onCheckedChange={(checked) => handleSubscriptionToggle('alumni_messages', checked)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-jobs" className="text-white">Job opportunities</Label>
                            <p className="text-xs text-gray-400">
                              Receive emails about new job postings
                            </p>
                          </div>
                          <div className="flex items-center">
                            {updatingTopic === 'alumni_jobs' && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-accent" />
                            )}
                            <Switch 
                              id="email-jobs" 
                              checked={isSubscribed('alumni_jobs')}
                              disabled={loading || updatingTopic === 'alumni_jobs'}
                              onCheckedChange={(checked) => handleSubscriptionToggle('alumni_jobs', checked)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-newsletters" className="text-white">Newsletters</Label>
                            <p className="text-xs text-gray-400">
                              Receive monthly alumni newsletters
                            </p>
                          </div>
                          <div className="flex items-center">
                            {updatingTopic === 'alumni_newsletters' && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-accent" />
                            )}
                            <Switch 
                              id="email-newsletters" 
                              checked={isSubscribed('alumni_newsletters')}
                              disabled={loading || updatingTopic === 'alumni_newsletters'}
                              onCheckedChange={(checked) => handleSubscriptionToggle('alumni_newsletters', checked)}
                            />
                          </div>
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
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-white/10 pt-4">
                <Button 
                  variant="glass" 
                  disabled={loading || saveLoading}
                  onClick={handleResetPreferences}
                >
                  {saveLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Reset to Default
                </Button>
                <Button 
                  variant="gradient" 
                  disabled={loading || saveLoading}
                  onClick={handleSavePreferences}
                >
                  {saveLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4 animate-in fade-in-50 duration-300">
            <Card variant="glass-dark" className="border border-secondary-100/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-secondary-100">
                  <Lock className="h-5 w-5 mr-2 text-blue-accent" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control who can see your information and how it&apos;s used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {privacyLoading && (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-accent" />
                    <span className="ml-2 text-gray-400">Loading your privacy settings...</span>
                  </div>
                )}
                
                {!privacyLoading && (
                  <>
                    <div className="p-3 border border-blue-accent/30 rounded-md bg-blue-accent/10">
                      <p className="text-sm text-white">
                        <strong>Privacy Notice:</strong> Your privacy choices affect how your profile appears to other alumni. 
                        By enabling more visibility options, you increase your chances of making meaningful connections in our community.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-secondary-100 flex items-center">
                        <UserRound className="h-4 w-4 mr-2" />
                        <span>Profile Visibility</span>
                      </h3>
                      <RadioGroup 
                        value={privacySettings.profileVisibility} 
                        onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                        className="space-y-3"
                      >
                        <div className="flex items-start space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
                          <RadioGroupItem value="all_alumni" id="all_alumni" className="mt-1 border-white text-white" />
                          <Label htmlFor="all_alumni" className="grid gap-1 font-normal">
                            <span className="text-white">All Alumni</span>
                            <span className="text-xs text-gray-400">
                              Your profile is visible to all members of the alumni network
                            </span>
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
                          <RadioGroupItem value="connections" id="connections" className="mt-1 border-white text-white" />
                          <Label htmlFor="connections" className="grid gap-1 font-normal">
                            <span className="text-white">Connections Only</span>
                            <span className="text-xs text-gray-400">
                              Only your connections can view your full profile
                            </span>
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 p-2 hover:bg-white/5 rounded-md transition-colors">
                          <RadioGroupItem value="limited" id="limited" className="mt-1 border-white text-white" />
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
                          <Switch 
                            id="show-email" 
                            checked={privacySettings.showEmail}
                            onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                          <Label htmlFor="show-phone" className="text-white">Show phone number</Label>
                          <Switch 
                            id="show-phone" 
                            checked={privacySettings.showPhone}
                            onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                          <Label htmlFor="show-education" className="text-white">Show education details</Label>
                          <Switch 
                            id="show-education" 
                            checked={privacySettings.showEducation}
                            onCheckedChange={(checked) => handlePrivacyChange('showEducation', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                          <Label htmlFor="show-work" className="text-white">Show work experience</Label>
                          <Switch 
                            id="show-work" 
                            checked={privacySettings.showWork}
                            onCheckedChange={(checked) => handlePrivacyChange('showWork', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                          <Label htmlFor="show-location" className="text-white">Show current location</Label>
                          <Switch 
                            id="show-location" 
                            checked={privacySettings.showLocation}
                            onCheckedChange={(checked) => handlePrivacyChange('showLocation', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                          <Label htmlFor="show-social" className="text-white">Show social media profiles</Label>
                          <Switch 
                            id="show-social" 
                            checked={privacySettings.showSocial}
                            onCheckedChange={(checked) => handlePrivacyChange('showSocial', checked)}
                          />
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
                          <Switch 
                            id="allow-messages" 
                            checked={privacySettings.allowMessages}
                            onCheckedChange={(checked) => handlePrivacyChange('allowMessages', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                          <Label htmlFor="allow-connections" className="text-white">Allow connection requests</Label>
                          <Switch 
                            id="allow-connections" 
                            checked={privacySettings.allowConnections}
                            onCheckedChange={(checked) => handlePrivacyChange('allowConnections', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                          <Label htmlFor="allow-mentoring" className="text-white">Allow mentoring requests</Label>
                          <Switch 
                            id="allow-mentoring" 
                            checked={privacySettings.allowMentoring}
                            onCheckedChange={(checked) => handlePrivacyChange('allowMentoring', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-white/10 pt-4">
                <Button 
                  variant="glass" 
                  disabled={privacyLoading || savingPrivacy}
                  onClick={handleResetPrivacy}
                >
                  {savingPrivacy ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Reset to Default
                </Button>
                <Button 
                  variant="gradient" 
                  disabled={privacyLoading || savingPrivacy}
                  onClick={handleSavePrivacy}
                >
                  {savingPrivacy ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Privacy Settings
                </Button>
              </CardFooter>
            </Card>
            
            <Card variant="glass-dark" className="border border-secondary-100/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-secondary-100">
                  <Shield className="h-5 w-5 mr-2 text-gold-default" />
                  Data & Privacy
                </CardTitle>
                <CardDescription>
                  Manage your personal data and privacy options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border border-gold-default/30 rounded-md bg-gold-default/10 mb-4">
                  <p className="text-sm text-white">
                    <strong>Data Processing Notice:</strong> We process your data in accordance with our privacy policy and applicable data protection laws.
                    You have the right to access, rectify, port, and erase your data. Data is retained according to your selected data retention period.
                  </p>
                </div>
              
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    <div>
                      <p className="font-medium text-white">Data Retention</p>
                      <p className="text-sm text-gray-400">
                        Control how long we keep your data
                      </p>
                    </div>
                    <Select defaultValue="indefinite">
                      <SelectTrigger className="w-[180px] bg-primary-90/30 border-white/10">
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent className="glass-dark border-secondary-100/20">
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                        <SelectItem value="1year">1 Year After Inactivity</SelectItem>
                        <SelectItem value="2years">2 Years After Inactivity</SelectItem>
                        <SelectItem value="5years">5 Years After Inactivity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
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

            <Card variant="glass-dark" className="border border-secondary-100/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-secondary-100">
                  <Lock className="h-5 w-5 mr-2 text-blue-accent" />
                  Advanced Privacy Controls
                </CardTitle>
                <CardDescription>
                  Control how your data is used by our site and third parties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-blue-accent flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      <span>Cookie Preferences</span>
                    </h3>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="essential-cookies" className="text-white">Essential Cookies</Label>
                        <p className="text-xs text-gray-400">
                          Required for the website to function properly
                        </p>
                      </div>
                      <Switch id="essential-cookies" checked disabled />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="functional-cookies" className="text-white">Functional Cookies</Label>
                        <p className="text-xs text-gray-400">
                          Enhance your experience by remembering your preferences
                        </p>
                      </div>
                      <Switch id="functional-cookies" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="analytics-cookies" className="text-white">Analytics Cookies</Label>
                        <p className="text-xs text-gray-400">
                          Help us understand how you use our site
                        </p>
                      </div>
                      <Switch id="analytics-cookies" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-cookies" className="text-white">Marketing Cookies</Label>
                        <p className="text-xs text-gray-400">
                          Used to tailor ads to your interests
                        </p>
                      </div>
                      <Switch id="marketing-cookies" />
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gold-default flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      <span>Third-Party Integrations</span>
                    </h3>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="social-sharing" className="text-white">Social Media Sharing</Label>
                        <p className="text-xs text-gray-400">
                          Allow content to be shared to social networks
                        </p>
                      </div>
                      <Switch id="social-sharing" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="analytics-tracking" className="text-white">Analytics Tracking</Label>
                        <p className="text-xs text-gray-400">
                          Allow tracking of your usage for insights
                        </p>
                      </div>
                      <Switch id="analytics-tracking" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
                      <div className="space-y-0.5">
                        <Label htmlFor="personalized-content" className="text-white">Personalized Content</Label>
                        <p className="text-xs text-gray-400">
                          Allow us to show you personalized content based on your interests
                        </p>
                      </div>
                      <Switch id="personalized-content" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-white/10 pt-4">
                <Button variant="glass">Reset to Default</Button>
                <Button variant="gradient">Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4 animate-in fade-in-50 duration-300">
            <Card variant="glass-dark" className="border border-secondary-100/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-secondary-100">
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