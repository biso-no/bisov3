"use client"

import { useEffect, useState } from "react"
import { Search, Download, ExternalLink, BookOpen, FileText, Video, Lightbulb, Users, Newspaper, ArrowRight, Filter, Star, Clock } from "lucide-react"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { format } from "date-fns"
import { getResources } from "../actions"
import type { Resource } from "@/lib/types/alumni"


// Mock data for news
const news = [
  {
    id: "news-001",
    title: "BISO Alumni Network Launches New Mentoring Platform",
    summary: "The BISO Alumni Network has launched a new mentoring platform to facilitate connections between alumni and current students.",
    date: "2023-08-10",
    author: "BISO Alumni Office",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    url: "#"
  },
  {
    id: "news-002",
    title: "Alumni Spotlight: Maria Olsen Named CEO of Tech Innovator",
    summary: "BISO graduate Maria Olsen has been appointed CEO of one of Norway's fastest-growing technology companies.",
    date: "2023-08-05",
    author: "BISO Alumni Magazine",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    url: "#"
  },
  {
    id: "news-003",
    title: "Annual Alumni Survey Results: Career Trends and Insights",
    summary: "The results of our annual alumni survey reveal interesting trends in career development and industry shifts among graduates.",
    date: "2023-07-20",
    author: "BISO Research Team",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    url: "#"
  },
];

// Helper function to get icon by resource type
function getResourceTypeIcon(type: string) {
  switch (type) {
    case "Guide":
    case "Report":
      return FileText;
    case "Webinar":
    case "Video":
      return Video;
    case "Toolkit":
      return Lightbulb;
    case "Podcast":
      return Users;
    case "Case Study":
      return BookOpen;
    default:
      return FileText;
  }
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [resources, setResources] = useState<Resource[]>([])

  useEffect(() => {
    const fetchResources = async () => {
      const resources = await getResources()
      setResources(resources)
    }
    fetchResources()
  }, [])
  
  const categories = Array.from(new Set(resources.map(resource => resource.category)))
  const types = Array.from(new Set(resources.map(resource => resource.type)))
  
  const filteredResources = resources.filter(resource => {
    // Search query filter
    if (searchQuery && 
        !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    
    // Category filter
    if (selectedCategory && resource.category !== selectedCategory) {
      return false
    }
    
    // Type filter
    if (selectedType && resource.type !== selectedType) {
      return false
    }
    
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alumni Resources</h1>
        <p className="text-muted-foreground mt-2">
          Access exclusive content, tools, and insights to support your professional development
        </p>
      </div>
      
      <Card className="border-none bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search resources by title, description, or tags..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType || "all"} onValueChange={(value) => setSelectedType(value === "all" ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="news">News & Updates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources" className="space-y-6">
          {filteredResources.length > 0 ? (
            <>
              {filteredResources.filter(r => r.featured).length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Featured Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredResources.filter(r => r.featured).map((resource) => (
                      <FeaturedResourceCard key={resource.$id} resource={resource} />
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-bold mb-4">All Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.filter(r => !r.featured).map((resource) => (
                    <ResourceCard key={resource.$id} resource={resource} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Card className="bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium">No resources found</p>
                <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSelectedType(null);
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="news">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline" asChild className="gap-2">
                <Link href="/alumni/news">
                  <span>View All News</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-muted/10 border-primary/10 mt-8">
        <CardHeader>
          <CardTitle>Request Resources</CardTitle>
          <CardDescription>
            Can&apos;t find what you&apos;re looking for? Let us know what resources would be helpful.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/alumni/resources/request">
              Submit Resource Request
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

interface ResourceCardProps {
  resource: Resource
}

function ResourceCard({ resource }: ResourceCardProps) {
  const ResourceIcon = getResourceTypeIcon(resource.type);
  
  return (
    <Card className="overflow-hidden border-primary/10 hover:border-primary/20 transition-colors h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-md flex items-center justify-center bg-primary/10">
            <ResourceIcon className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium truncate">
              <Link 
                href={`/alumni/resources/${resource.$id}`}
                className="hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                {resource.title}
              </Link>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {resource.category} • {resource.type}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2 flex-1">
          {resource.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {format(new Date(resource.publishedDate), "MMM d, yyyy")}
          </div>
          
          <div>
            {resource.format === "PDF" || resource.format === "ZIP Archive" ? (
              <Button size="sm" variant="ghost" className="h-8" asChild>
                <Link href={resource.downloadUrl || "#"}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  <span>Download</span>
                </Link>
              </Button>
            ) : (
              <Button size="sm" variant="ghost" className="h-8" asChild>
                <Link href={resource.watchUrl || resource.listenUrl || "#"}>
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  <span>View</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FeaturedResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden border-primary/10 hover:border-primary/20 transition-colors group">
      <div className="relative h-36 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url(${resource.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <Badge 
            variant="outline" 
            className={cn(
              "bg-background/80 backdrop-blur-sm font-medium",
              resource.category === "Career Development" && "border-blue-500/50 text-blue-500",
              resource.category === "Market Insights" && "border-green-500/50 text-green-500",
              resource.category === "Finance" && "border-amber-500/50 text-amber-500",
              resource.category === "Marketing" && "border-pink-500/50 text-pink-500",
              resource.category === "Leadership" && "border-purple-500/50 text-purple-500",
              resource.category === "Entrepreneurship" && "border-red-500/50 text-red-500",
            )}
          >
            {resource.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-primary/10 flex-shrink-0">
            <ResourceIcon resource={resource} className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-medium text-lg truncate">{resource.title}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{resource.description}</p>
        
        <div className="flex items-center justify-between gap-3 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{format(new Date(resource.publishedDate), "MMM d, yyyy")}</span>
          </div>
          <div>
            <Badge variant="outline" className="bg-muted/30">
              {resource.format}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t bg-muted/20">
        {resource.format === "PDF" || resource.format === "ZIP Archive" ? (
          <Button asChild className="w-full gap-1">
            <Link href={resource.downloadUrl || "#"}>
              <Download className="h-4 w-4" />
              <span>Download Resource</span>
            </Link>
          </Button>
        ) : (
          <Button asChild className="w-full gap-1">
            <Link href={resource.watchUrl || resource.listenUrl || "#"}>
              <ExternalLink className="h-4 w-4" />
              <span>View Resource</span>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

interface NewsCardProps {
  news: typeof news[0]
}

function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="overflow-hidden border-primary/10 hover:border-primary/20 transition-colors group">
      <div className="relative h-40 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url(${news.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
      </div>
      
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">
          {format(new Date(news.date), "MMM d, yyyy")}
        </div>
        <h3 className="font-medium text-lg mt-2 line-clamp-2">
          <Link 
            href={news.url || "#"}
            className="hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            {news.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{news.summary}</p>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t bg-muted/20">
        <Button variant="outline" asChild className="w-full">
          <Link href={news.url || "#"}>
            <Newspaper className="h-4 w-4 mr-2" />
            <span>Read Full Story</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper component to get the correct icon for a resource
function ResourceIcon({ resource, className }: { resource: Resource, className?: string }) {
  const IconComponent = getResourceTypeIcon(resource.type);
  return <IconComponent className={className} />;
} 