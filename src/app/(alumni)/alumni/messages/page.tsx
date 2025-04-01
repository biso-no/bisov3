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
    <div className="flex h-[calc(100vh-130px)]">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-r-border flex flex-col">
        <div className="p-4 border-b border-b-border space-y-4">
          <h1 className="text-xl font-bold tracking-tight">Messages</h1>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {conversations.reduce((count, conv) => count + conv.unreadCount, 0) > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {conversations.reduce((count, conv) => count + conv.unreadCount, 0)}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-4 text-center">
              <p>Loading conversations...</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
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
                        "p-4 hover:bg-muted/50 cursor-pointer flex items-center gap-3 transition-colors",
                        isActive && "bg-muted"
                      )}
                      onClick={() => setActiveConversationId(conversation.$id)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={otherParticipant.avatarUrl} alt={otherParticipant.name} />
                          <AvatarFallback>{otherParticipant.name?.slice(0, 2) || "?"}</AvatarFallback>
                        </Avatar>
                        
                        {/* We'd need to implement real-time status tracking in a production app */}
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-muted" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{otherParticipant.name}</h3>
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessage
                              ? formatConversationTimestamp(new Date(conversation.lastMessage.$createdAt))
                              : ""}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <p className={cn(
                            "text-sm truncate",
                            conversation.unreadCount > 0 
                              ? "text-foreground font-medium" 
                              : "text-muted-foreground"
                          )}>
                            {conversation.lastMessage && currentUser && conversation.lastMessage.sender === currentUser.userId && (
                              <span className="mr-1">You:</span>
                            )}
                            {conversation.lastMessage?.content || "No messages yet"}
                          </p>
                          
                          {conversation.unreadCount > 0 && (
                            <Badge className="ml-2 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p>No conversations found</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t border-t-border">
          <Button variant="outline" className="w-full" onClick={handleNewConversation}>
            <MessageSquare className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>
      
      {/* Main Conversation Area */}
      {activeConversation ? (
        <div className="hidden md:flex flex-col flex-1">
          {/* Conversation Header */}
          <div className="p-4 border-b border-b-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeConversation.participants.length > 0 && (
                <Avatar>
                  <AvatarImage 
                    src={activeConversation.participants.find(p => 
                      currentUser && p.userId !== currentUser.userId
                    )?.avatarUrl} 
                    alt={getParticipantName()} 
                  />
                  <AvatarFallback>{getParticipantName().slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
              
              <div>
                <h2 className="font-medium">{getParticipantName()}</h2>
                <p className="text-xs text-muted-foreground">
                  {/* We'd need to implement real-time status tracking in a production app */}
                  Last active recently
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Conversation Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {groupedMessages.map((group) => (
                <div key={group.date.toISOString()} className="space-y-4">
                  <div className="relative">
                    <Separator />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
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
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={sender.avatarUrl} alt={sender.name} />
                            <AvatarFallback>{sender.name?.slice(0, 2) || "?"}</AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={cn(
                          "rounded-2xl p-3",
                          isCurrentUser 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        )}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground min-w-[50px]">
                          <span>{formatMessageTimestamp(new Date(message.$createdAt))}</span>
                          {isCurrentUser && (
                            <div className="ml-1">
                              {message.read 
                                ? <CheckCheck className="h-3 w-3" /> 
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
                <div className="text-center text-muted-foreground my-10">
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Send a message to start the conversation</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="p-4 border-t border-t-border">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Paperclip className="h-4 w-4" />
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
                className="flex-1"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              <Button variant="ghost" size="icon" className="rounded-full">
                <Smile className="h-4 w-4" />
              </Button>
              
              <Button 
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
        <div className="hidden md:flex flex-col items-center justify-center flex-1 p-4">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Your Messages</h2>
          <p className="text-muted-foreground text-center mb-6">
            Select a conversation to view messages or start a new one
          </p>
          <Button onClick={handleNewConversation}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Start New Conversation
          </Button>
        </div>
      )}
      
      {/* Empty State for Mobile */}
      <div className="flex flex-col items-center justify-center flex-1 p-4 md:hidden">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium mb-2">Your Messages</h2>
        <p className="text-muted-foreground text-center mb-6">
          Select a conversation to view messages or start a new one
        </p>
        <Button onClick={handleNewConversation}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Start New Conversation
        </Button>
      </div>
    </div>
  )
}