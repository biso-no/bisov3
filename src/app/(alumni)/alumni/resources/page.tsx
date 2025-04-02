"use client"

import { useEffect, useState } from "react"
import { Search, Download, ExternalLink, BookOpen, FileText, Video, Lightbulb, Users, Newspaper, ArrowRight, Filter, Star, Clock, Calendar } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/ui/page-header"


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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set document title
    document.title = "Alumni Resources | BISO";
    
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const fetchedResources = await getResources();
        setResources(fetchedResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);
  
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
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
      </div>
      
      <section className="container p-8">
        <PageHeader
          gradient
          heading="Alumni Resources"
          subheading="Access exclusive content, tools, and insights to support your professional development"
        />
      
        <Card variant="glass-dark" className="border-0 overflow-hidden mt-8 group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-accent/10 via-secondary-100/10 to-blue-accent/10 opacity-20"></div>
          <CardContent className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-accent/20 via-secondary-100/20 to-blue-accent/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500"></div>
                <div className="absolute inset-0 rounded-md backdrop-blur-sm border border-secondary-100/20 group-hover:border-secondary-100/30 group-focus-within:border-secondary-100/50 transition-all duration-300"></div>
                
                <div className="relative flex items-center backdrop-blur-0">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-blue-accent/10 group-focus-within:bg-blue-accent/20 transition-all duration-300">
                    <Search className="h-3.5 w-3.5 text-blue-accent" />
                  </div>
                  <Input
                    type="search"
                    placeholder="Search resources by title, description, or tags..."
                    className="pl-12 pr-10 py-6 bg-transparent shadow-none border-0 h-12 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent' }}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 flex items-center justify-center rounded-full bg-primary-70/50 text-gray-300 hover:text-white hover:bg-blue-accent/30"
                      onClick={() => setSearchQuery("")}
                    >
                      <span className="sr-only">Clear search</span>
                      ×
                    </Button>
                  )}
                </div>
              </div>
              
              <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
                <SelectTrigger 
                  className="w-[180px] glass-dark border-secondary-100/20 group hover:border-secondary-100/30 text-gray-300 h-12 px-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-all duration-300">
                      <Filter className="h-3.5 w-3.5 text-secondary-100" />
                    </div>
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass-dark border-secondary-100/20 backdrop-blur-md">
                  <SelectItem value="all" className="focus:bg-blue-accent/20">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="focus:bg-blue-accent/20">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedType || "all"} onValueChange={(value) => setSelectedType(value === "all" ? null : value)}>
                <SelectTrigger 
                  className="w-[180px] glass-dark border-secondary-100/20 group hover:border-secondary-100/30 text-gray-300 h-12 px-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-all duration-300">
                      <BookOpen className="h-3.5 w-3.5 text-blue-accent" />
                    </div>
                    <SelectValue placeholder="All Types" />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass-dark border-secondary-100/20 backdrop-blur-md">
                  <SelectItem value="all" className="focus:bg-blue-accent/20">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type} className="focus:bg-blue-accent/20">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="resources" className="space-y-6 mt-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto glass-dark backdrop-blur-md border border-secondary-100/20 p-1 h-12">
            <TabsTrigger 
              value="resources" 
              className="data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
            >
              Resources
            </TabsTrigger>
            <TabsTrigger 
              value="news" 
              className="data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
            >
              News & Updates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="space-y-6">
            {isLoading ? (
              <>
                <div>
                  <h2 className="text-xl font-bold mb-4 text-white">Featured Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeaturedResourceCardSkeleton />
                    <FeaturedResourceCardSkeleton />
                    <FeaturedResourceCardSkeleton />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-4 text-white">All Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ResourceCardSkeleton />
                    <ResourceCardSkeleton />
                    <ResourceCardSkeleton />
                    <ResourceCardSkeleton />
                    <ResourceCardSkeleton />
                    <ResourceCardSkeleton />
                  </div>
                </div>
              </>
            ) : filteredResources.length > 0 ? (
              <>
                {filteredResources.filter(r => r.featured).length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-white">Featured Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredResources.filter(r => r.featured).map((resource) => (
                        <FeaturedResourceCard key={resource.$id} resource={resource} />
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h2 className="text-xl font-bold mb-4 text-white">All Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.filter(r => !r.featured).map((resource) => (
                      <ResourceCard key={resource.$id} resource={resource} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Card variant="glass-dark" className="border-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/10 opacity-20" />
                <CardContent className="flex flex-col items-center justify-center py-12 relative z-10">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
                    <div className="relative z-10 p-4 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
                      <FileText className="h-10 w-10 text-blue-accent" />
                    </div>
                  </div>
                  <p className="text-xl font-medium text-white mb-3">No resources found</p>
                  <p className="text-gray-300 max-w-md mb-6 text-center">No resources match your current search criteria. Try adjusting your filters or search terms.</p>
                  <Button 
                    variant="gradient" 
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
                <Button variant="gradient" asChild className="gap-2">
                  <Link href="/alumni/news">
                    <span>View All News</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Card variant="glass-dark" className="border-0 overflow-hidden mt-8 group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-accent/10 via-secondary-100/10 to-blue-accent/10 opacity-20"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-white">Request Resources</CardTitle>
            <CardDescription className="text-gray-300">
              Can&apos;t find what you&apos;re looking for? Let us know what resources would be helpful.
            </CardDescription>
          </CardHeader>
          <CardFooter className="relative z-10">
            <Button variant="gradient" asChild className="gap-1 group">
              <Link href="/alumni/resources/request" className="flex items-center">
                Submit Resource Request
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}

interface ResourceCardProps {
  resource: Resource
}

function ResourceCard({ resource }: ResourceCardProps) {
  const ResourceIcon = getResourceTypeIcon(resource.type);
  
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
      <CardContent className="p-4 flex flex-col h-full relative z-10">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-md flex items-center justify-center bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-all duration-300">
            <ResourceIcon className="h-5 w-5 text-blue-accent" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium truncate text-white">
              <Link 
                href={`/alumni/resources/${resource.$id}`}
                className="hover:text-blue-accent transition-colors inline-flex items-center gap-1"
              >
                {resource.title}
              </Link>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {resource.category} • {resource.type}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mt-3 line-clamp-2 flex-1">
          {resource.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {format(new Date(resource.publishedDate), "MMM d, yyyy")}
          </div>
          
          <div>
            {resource.format === "PDF" || resource.format === "ZIP Archive" ? (
              <Button size="sm" variant="ghost" className="h-8 text-gray-300 hover:text-white hover:bg-primary-80/50" asChild>
                <Link href={resource.downloadUrl || "#"} className="flex items-center gap-1 group">
                  <Download className="h-3.5 w-3.5 mr-1 group-hover:translate-y-0.5 transition-transform" />
                  <span>Download</span>
                </Link>
              </Button>
            ) : (
              <Button size="sm" variant="ghost" className="h-8 text-gray-300 hover:text-white hover:bg-primary-80/50" asChild>
                <Link href={resource.watchUrl || resource.listenUrl || "#"} className="flex items-center gap-1">
                  <ExternalLink className="h-3.5 w-3.5 mr-1 group-hover:translate-x-0.5 transition-transform" />
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
    <Card variant="glass-dark" className="overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group">
      <div className="relative h-36 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${resource.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-90 via-primary-90/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <Badge 
            variant="outline" 
            className={cn(
              "backdrop-blur-sm font-medium",
              resource.category === "Career Development" && "border-blue-accent/30 text-blue-accent",
              resource.category === "Market Insights" && "border-secondary-100/30 text-secondary-100",
              resource.category === "Finance" && "border-gold-default/30 text-gold-default",
              resource.category === "Marketing" && "border-pink-500/50 text-pink-500",
              resource.category === "Leadership" && "border-purple-500/50 text-purple-500",
              resource.category === "Entrepreneurship" && "border-red-500/50 text-red-500",
            )}
          >
            {resource.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 relative z-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-accent/20 to-transparent opacity-30 blur-3xl"></div>
        
        <div className="flex items-start gap-2 mb-2">
          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-blue-accent/10 flex-shrink-0 group-hover:bg-blue-accent/20 transition-all duration-300">
            <ResourceIcon resource={resource} className="h-4 w-4 text-blue-accent" />
          </div>
          <h3 className="font-medium text-lg truncate text-white group-hover:text-blue-accent transition-colors">{resource.title}</h3>
        </div>
        
        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{resource.description}</p>
        
        <div className="flex items-center justify-between gap-3 mt-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
              <Clock className="h-3.5 w-3.5 text-blue-accent" />
            </div>
            <span>{format(new Date(resource.publishedDate), "MMM d, yyyy")}</span>
          </div>
          <div>
            <Badge variant="outline" className="border-secondary-100/20 bg-secondary-100/5 text-secondary-100">
              {resource.format}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t border-secondary-100/10 bg-primary-80/30 relative z-10">
        {resource.format === "PDF" || resource.format === "ZIP Archive" ? (
          <Button variant="gradient" asChild className="w-full gap-1 group">
            <Link href={resource.downloadUrl || "#"} className="flex items-center">
              <Download className="h-4 w-4 mr-1 group-hover:translate-y-0.5 transition-transform" />
              <span>Download Resource</span>
            </Link>
          </Button>
        ) : (
          <Button variant="gradient" asChild className="w-full gap-1 group">
            <Link href={resource.watchUrl || resource.listenUrl || "#"} className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-1 group-hover:translate-x-0.5 transition-transform" />
              <span>View Resource</span>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function ResourceCardSkeleton() {
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
      <CardContent className="p-4 flex flex-col h-full relative z-10">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          
          <div className="flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
        </div>
        
        <Skeleton className="h-4 w-full mt-3 mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        
        <div className="mt-auto flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

function FeaturedResourceCardSkeleton() {
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0">
      <Skeleton className="h-36 w-full" />
      
      <CardContent className="p-4 relative z-10">
        <div className="flex items-start gap-2 mb-2">
          <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
          <Skeleton className="h-6 w-full" />
        </div>
        
        <Skeleton className="h-4 w-full mt-2 mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        
        <div className="flex items-center justify-between gap-3 mt-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t border-secondary-100/10 bg-primary-80/30 relative z-10">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}

interface NewsCardProps {
  news: typeof news[0]
}

function NewsCard({ news }: NewsCardProps) {
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group">
      <div className="relative h-40 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${news.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-90 via-primary-90/70 to-transparent"></div>
      </div>
      
      <CardContent className="p-4 relative z-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-accent/20 to-transparent opacity-30 blur-3xl"></div>
        
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
            <Calendar className="h-3.5 w-3.5 text-blue-accent" />
          </div>
          <span>{format(new Date(news.date), "MMM d, yyyy")}</span>
        </div>
        
        <h3 className="font-medium text-lg mt-2 line-clamp-2 text-white">
          <Link 
            href={news.url || "#"}
            className="hover:text-blue-accent transition-colors inline-flex items-center gap-1"
          >
            {news.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-300 mt-2 line-clamp-3">{news.summary}</p>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t border-secondary-100/10 bg-primary-80/30 relative z-10">
        <Button variant="gradient" asChild className="w-full gap-1 group">
          <Link href={news.url || "#"} className="flex items-center">
            <Newspaper className="h-4 w-4 mr-2" />
            <span>Read Full Story</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
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