"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  Phone, 
  Video, 
  Info, 
  Paperclip, 
  Send, 
  Smile, 
  MoreVertical, 
  Image as ImageIcon, 
  FilePlus,
  ChevronRight,
  User,
  Check,
  CheckCheck,
  Clock,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { format, isToday, isYesterday, isSameWeek, subDays } from "date-fns"
import { getUserConversations, getConversationMessages, sendMessage, createOrGetConversation } from "../actions"
import { EnrichedConversation, Message, UserProfile } from "@/lib/types/alumni"
import { getCurrentUserProfile } from "../actions"

// Helper function to format conversation timestamps
function formatConversationTimestamp(date: Date) {
  if (isToday(date)) {
    return format(date, "h:mm a");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (isSameWeek(date, new Date())) {
    return format(date, "EEE");
  } else {
    return format(date, "MMM d");
  }
}

// Helper function to format message timestamps
function formatMessageTimestamp(date: Date) {
  return format(date, "h:mm a");
}

// Helper function to group messages by date
function groupMessagesByDate(messages: Message[]) {
  const groups: Record<string, Message[]> = {};
  
  messages.forEach(message => {
    const dateKey = format(new Date(message.$createdAt), "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });
  
  return Object.entries(groups).map(([date, messages]) => ({
    date: new Date(date),
    messages
  }));
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [messageText, setMessageText] = useState("");
  const [conversations, setConversations] = useState<EnrichedConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConversationMessages, setActiveConversationMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Set document title
  useEffect(() => {
    document.title = "Messages | BISO";
  }, []);
  
  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      try {
        setIsLoading(true);
        const userProfile = await getCurrentUserProfile();
        setCurrentUser(userProfile);
        
        const userConversations = await getUserConversations();
        setConversations(userConversations);
        
        // Set the first conversation as active if there are any
        if (userConversations.length > 0 && !activeConversationId) {
          setActiveConversationId(userConversations[0].$id);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadConversations();
  }, []);
  
  // Load messages for active conversation
  useEffect(() => {
    if (!activeConversationId) return;
    
    async function loadMessages() {
      try {
        const messages = await getConversationMessages(activeConversationId);
        setActiveConversationMessages(messages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    }
    
    loadMessages();
  }, [activeConversationId]);
  
  // Filter conversations based on search and active tab
  const filteredConversations = conversations.filter(conversation => {
    // Check if all participants have name property
    if (!conversation.participants.every(p => p.name)) {
      return false;
    }
    
    const matchesSearch = searchQuery === "" || 
      conversation.participants.some(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    if (activeTab === "unread") {
      return matchesSearch && conversation.unreadCount > 0;
    }
    
    return matchesSearch;
  });
  
  // Get active conversation object
  const activeConversation = activeConversationId 
    ? conversations.find(c => c.$id === activeConversationId) 
    : null;
  
  // Group messages by date
  const groupedMessages = groupMessagesByDate(activeConversationMessages);
  
  // Format participant name for header
  const getParticipantName = () => {
    if (!activeConversation) return "";
    
    // Get other participants (excluding current user)
    const otherParticipants = activeConversation.participants.filter(p => 
      currentUser && p.userId !== currentUser.userId
    );
    
    if (otherParticipants.length === 0) return "No participants";
    if (otherParticipants.length === 1) return otherParticipants[0].name;
    
    return `${otherParticipants[0].name} and ${otherParticipants.length - 1} others`;
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversationId || !currentUser) return;
    
    try {
      await sendMessage(activeConversationId, messageText);
      
      // Optimistically update UI
      const newMessage: Message = {
        $id: `temp-${Date.now()}`,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $permissions: [],
        $collectionId: '',
        $databaseId: '',
        content: messageText,
        sender: currentUser.userId,
        read: false,
        conversationId: activeConversationId
      };
      
      setActiveConversationMessages(prev => [...prev, newMessage]);
      setMessageText("");
      
      // Reload messages to get the actual message from the server
      const messages = await getConversationMessages(activeConversationId);
      setActiveConversationMessages(messages);
      
      // Reload conversations to update last message
      const userConversations = await getUserConversations();
      setConversations(userConversations);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  // Handle creating a new conversation
  const handleNewConversation = async () => {
    // This would typically open a modal to select users
    // For now, we'll just simulate creating a conversation with a fake user ID
    try {
      const newConversation = await createOrGetConversation(["fake-user-id"]);
      setActiveConversationId(newConversation.$id);
      
      // Reload conversations
      const userConversations = await getUserConversations();
      setConversations(userConversations);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
      </div>
      
      <div className="container pt-8 pb-8">
        <div className="rounded-xl overflow-hidden border border-secondary-100/20 glass-dark backdrop-blur-sm shadow-card">
          <div className="flex h-[calc(100vh-200px)]">
            {/* Conversations Sidebar */}
            <div className="w-full md:w-80 lg:w-96 border-r border-secondary-100/20 flex flex-col">
              <div className="p-4 border-b border-secondary-100/20 space-y-4">
                <h1 className="text-xl font-bold tracking-tight text-white">Messages</h1>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    className="pl-8 bg-primary-90/50 border-secondary-100/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 glass-dark border border-secondary-100/20 p-1">
                    <TabsTrigger 
                      value="all"
                      className="data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger 
                      value="unread" 
                      className="relative data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
                    >
                      Unread
                      {conversations.reduce((count, conv) => count + conv.unreadCount, 0) > 0 && (
                        <Badge variant="gradient" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {conversations.reduce((count, conv) => count + conv.unreadCount, 0)}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <ScrollArea className="flex-1">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center p-8 h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-accent mb-2"></div>
                    <p className="text-gray-300">Loading conversations...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-secondary-100/20">
                    {filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => {
                        // Find the other participant (not the current user)
                        const otherParticipant = conversation.participants.find(
                          p => currentUser && p.userId !== currentUser.userId
                        ) || conversation.participants[0];
                        
                        const isActive = conversation.$id === activeConversationId;
                        
                        return (
                          <div 
                            key={conversation.$id}
                            className={cn(
                              "p-4 hover:bg-blue-accent/5 cursor-pointer flex items-center gap-3 transition-all",
                              isActive && "bg-blue-accent/10"
                            )}
                            onClick={() => setActiveConversationId(conversation.$id)}
                          >
                            <div className="relative group">
                              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-blue-accent/40 to-secondary-100/20 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                              <Avatar className="h-10 w-10 border border-secondary-100/20 relative shadow-sm group-hover:shadow-glow-sm transition-all duration-300">
                                <AvatarImage src={otherParticipant.avatarUrl} alt={otherParticipant.name} />
                                <AvatarFallback className="bg-primary-80 text-white">{otherParticipant.name?.slice(0, 2) || "?"}</AvatarFallback>
                              </Avatar>
                              
                              {/* Online status indicator */}
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-primary-90 bg-emerald-500" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium truncate text-white">{otherParticipant.name}</h3>
                                <span className="text-xs text-gray-400">
                                  {conversation.lastMessage
                                    ? formatConversationTimestamp(new Date(conversation.lastMessage.$createdAt))
                                    : ""}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between mt-1">
                                <p className={cn(
                                  "text-sm truncate",
                                  conversation.unreadCount > 0 
                                    ? "text-white font-medium" 
                                    : "text-gray-400"
                                )}>
                                  {conversation.lastMessage && currentUser && conversation.lastMessage.sender === currentUser.userId && (
                                    <span className="mr-1">You:</span>
                                  )}
                                  {conversation.lastMessage?.content || "No messages yet"}
                                </p>
                                
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="gradient" className="ml-2 h-5 flex items-center justify-center">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-300">No conversations found</p>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
              
              <div className="p-4 border-t border-secondary-100/20">
                <Button variant="gradient" className="w-full" onClick={handleNewConversation}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              </div>
            </div>
            
            {/* Main Conversation Area */}
            {activeConversation ? (
              <div className="hidden md:flex flex-col flex-1">
                {/* Conversation Header */}
                <div className="p-4 border-b border-secondary-100/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activeConversation.participants.length > 0 && (
                      <div className="relative group">
                        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-blue-accent/40 to-secondary-100/20 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <Avatar className="h-10 w-10 border border-secondary-100/20 relative shadow-sm group-hover:shadow-glow-sm transition-all duration-300">
                          <AvatarImage 
                            src={activeConversation.participants.find(p => 
                              currentUser && p.userId !== currentUser.userId
                            )?.avatarUrl}
                            alt={getParticipantName()} 
                          />
                          <AvatarFallback className="bg-primary-80 text-white">{getParticipantName().slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        {/* Online status indicator */}
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-primary-90 bg-emerald-500" />
                      </div>
                    )}
                    
                    <div>
                      <h2 className="font-medium text-white">{getParticipantName()}</h2>
                      <p className="text-xs text-gray-400">
                        Online
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="glass" size="icon" className="border border-secondary-100/20 hover:bg-blue-accent/10">
                      <Phone className="h-4 w-4 text-blue-accent" />
                    </Button>
                    <Button variant="glass" size="icon" className="border border-secondary-100/20 hover:bg-secondary-100/10">
                      <Video className="h-4 w-4 text-secondary-100" />
                    </Button>
                    <Button variant="glass" size="icon" className="border border-secondary-100/20 hover:bg-gold-default/10">
                      <Info className="h-4 w-4 text-gold-default" />
                    </Button>
                  </div>
                </div>
                
                {/* Conversation Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-6">
                    {groupedMessages.map((group) => (
                      <div key={group.date.toISOString()} className="space-y-4">
                        <div className="relative">
                          <Separator className="bg-secondary-100/20" />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-90 px-2 text-xs text-gray-400">
                            {isToday(group.date) 
                              ? "Today" 
                              : isYesterday(group.date) 
                                ? "Yesterday" 
                                : format(group.date, "MMMM d, yyyy")}
                          </div>
                        </div>
                        
                        {group.messages.map((message) => {
                          const isCurrentUser = currentUser && message.sender === currentUser.userId;
                          
                          // Find the sender in participants
                          const sender = activeConversation.participants.find(p => p.userId === message.sender);
                          
                          return (
                            <div 
                              key={message.$id} 
                              className={cn(
                                "flex items-end gap-2 max-w-[80%]",
                                isCurrentUser ? "ml-auto" : "mr-auto"
                              )}
                            >
                              {!isCurrentUser && sender && (
                                <Avatar className="h-8 w-8 border border-secondary-100/20">
                                  <AvatarImage src={sender.avatarUrl} alt={sender.name} />
                                  <AvatarFallback className="bg-primary-80 text-white">{sender.name?.slice(0, 2) || "?"}</AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div className={cn(
                                "rounded-2xl p-3",
                                isCurrentUser 
                                  ? "bg-gradient-to-br from-blue-accent/80 to-blue-accent/60 text-white shadow-glow-sm" 
                                  : "glass border border-secondary-100/20"
                              )}>
                                <p className="text-sm">{message.content}</p>
                              </div>
                              
                              <div className="flex items-center text-xs text-gray-400 min-w-[50px]">
                                <span>{formatMessageTimestamp(new Date(message.$createdAt))}</span>
                                {isCurrentUser && (
                                  <div className="ml-1">
                                    {message.read 
                                      ? <CheckCheck className="h-3 w-3 text-blue-accent" /> 
                                      : <Check className="h-3 w-3" />}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    
                    {activeConversationMessages.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="h-16 w-16 text-secondary-100/30 mb-4" />
                        <p className="text-white">No messages yet</p>
                        <p className="text-sm text-gray-400 mt-1">Send a message to start the conversation</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Message Input */}
                <div className="p-4 border-t border-secondary-100/20">
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="glass" size="icon" className="rounded-full border border-secondary-100/20 hover:bg-blue-accent/10">
                          <Paperclip className="h-4 w-4 text-blue-accent" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          <span>Image</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FilePlus className="mr-2 h-4 w-4" />
                          <span>Document</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-primary-90/50 border-secondary-100/20"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    <Button variant="glass" size="icon" className="rounded-full border border-secondary-100/20 hover:bg-secondary-100/10">
                      <Smile className="h-4 w-4 text-secondary-100" />
                    </Button>
                    
                    <Button 
                      variant="gradient"
                      size="icon" 
                      className="rounded-full"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State when no conversation is selected */
              <div className="hidden md:flex flex-col items-center justify-center flex-1 p-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
                  <div className="relative z-10 p-5 rounded-full glass border border-secondary-100/20">
                    <MessageSquare className="h-12 w-12 text-blue-accent" />
                  </div>
                </div>
                <h2 className="text-xl font-medium mb-2 text-white">Your Messages</h2>
                <p className="text-gray-300 text-center mb-6 max-w-md">
                  Select a conversation to view messages or start a new one to connect with other alumni
                </p>
                <Button variant="gradient" onClick={handleNewConversation}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start New Conversation
                </Button>
              </div>
            )}
            
            {/* Empty State for Mobile */}
            <div className="flex flex-col items-center justify-center flex-1 p-8 md:hidden">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
                <div className="relative z-10 p-5 rounded-full glass border border-secondary-100/20">
                  <MessageSquare className="h-12 w-12 text-blue-accent" />
                </div>
              </div>
              <h2 className="text-xl font-medium mb-2 text-white">Your Messages</h2>
              <p className="text-gray-300 text-center mb-6">
                Select a conversation to view messages
              </p>
              <Button variant="gradient" onClick={handleNewConversation}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Start New Conversation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}