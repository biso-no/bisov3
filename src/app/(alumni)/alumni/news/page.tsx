"use client"

import { useEffect, useState } from "react"
import { Search, Calendar, ArrowRight, Filter, ChevronLeft, ChevronRight, Newspaper, Tag, User } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { format } from "date-fns"
import { getNews } from "../actions"
import type { NewsItem } from "@/lib/types/alumni"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/ui/page-header"

const NEWS_PER_PAGE = 9;

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  useEffect(() => {
    // Set document title
    document.title = "Alumni News | BISO";
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all news items for now (we'll filter client-side)
        // In a real app, you'd implement server-side pagination
        const fetchedNews = await getNews(100);
        setNews(fetchedNews);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(fetchedNews.map(item => item.category).filter(Boolean))
        ) as string[];
        setCategories(uniqueCategories);
        
        // Calculate total pages
        setTotalPages(Math.ceil(fetchedNews.length / NEWS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter news items based on search query and category
  const filteredNews = news.filter(item => {
    // Search filter
    if (searchQuery && 
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.summary.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))) {
      return false;
    }
    
    // Category filter
    if (selectedCategory && item.category !== selectedCategory) {
      return false;
    }
    
    return true;
  });
  
  // Paginate filtered news
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * NEWS_PER_PAGE,
    currentPage * NEWS_PER_PAGE
  );
  
  // Update total pages when filters change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredNews.length / NEWS_PER_PAGE));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredNews.length]);

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
          heading="Alumni News"
          subheading="Stay updated with the latest news, announcements, and stories from our alumni community"
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
                    placeholder="Search news by title, content, or tags..."
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
              
              {categories.length > 0 && (
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
              )}
            </div>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </div>
        ) : filteredNews.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedNews.map((item) => (
                <NewsCard key={item.$id} news={item} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1;
                      // Show first page, last page, current page, and pages around current page
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      // Show ellipsis for gaps
                      if (
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <Card variant="glass-dark" className="border-0 overflow-hidden mt-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/10 opacity-20" />
            <CardContent className="flex flex-col items-center justify-center py-12 relative z-10">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full blur-xl bg-blue-accent/20 animate-pulse"></div>
                <div className="relative z-10 p-4 rounded-full bg-primary-90/50 backdrop-blur-sm border border-secondary-100/20">
                  <Newspaper className="h-10 w-10 text-blue-accent" />
                </div>
              </div>
              <p className="text-xl font-medium text-white mb-3">No news found</p>
              <p className="text-gray-300 max-w-md mb-6 text-center">No news match your current search criteria. Try adjusting your filters or search terms.</p>
              <Button 
                variant="gradient" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}

interface NewsCardProps {
  news: NewsItem
}

function NewsCard({ news }: NewsCardProps) {
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group">
      <div className="relative h-48 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${news.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-90 via-primary-90/70 to-transparent"></div>
        {news.category && (
          <div className="absolute top-4 right-4">
            <Badge 
              variant="outline" 
              className="backdrop-blur-sm font-medium border-blue-accent/30 text-blue-accent bg-primary-100/30"
            >
              {news.category}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-5 relative z-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-accent/20 to-transparent opacity-30 blur-3xl"></div>
        
        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-md bg-blue-accent/10 group-hover:bg-blue-accent/20 transition-colors">
              <Calendar className="h-3.5 w-3.5 text-blue-accent" />
            </div>
            <span>{format(new Date(news.date), "MMM d, yyyy")}</span>
          </div>
          
          {news.author && (
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 rounded-md bg-secondary-100/10 group-hover:bg-secondary-100/20 transition-colors">
                <User className="h-3.5 w-3.5 text-secondary-100" />
              </div>
              <span>{news.author}</span>
            </div>
          )}
        </div>
        
        <h3 className="font-medium text-xl mb-3 text-white group-hover:text-blue-accent transition-colors line-clamp-2">
          <Link href={`/alumni/news/${news.$id}`}>
            {news.title}
          </Link>
        </h3>
        
        <p className="text-sm text-gray-300 line-clamp-3 mb-4">{news.summary}</p>
        
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {news.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-secondary-100/10 hover:bg-secondary-100/20 text-xs font-normal">
                {tag}
              </Badge>
            ))}
            {news.tags.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{news.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-5 py-4 border-t border-secondary-100/10 bg-primary-80/30 relative z-10">
        <Button variant="outline" asChild className="w-full gap-1 group hover:bg-blue-accent/20 hover:text-blue-accent">
          <Link href={`/alumni/news/${news.$id}`} className="flex items-center justify-center">
            <span>Read Full Story</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function NewsCardSkeleton() {
  return (
    <Card variant="glass-dark" className="overflow-hidden border-0">
      <Skeleton className="h-48 w-full" />
      
      <CardContent className="p-5 relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        
        <Skeleton className="h-7 w-full mb-2" />
        <Skeleton className="h-7 w-3/4 mb-3" />
        
        <Skeleton className="h-5 w-full mb-1" />
        <Skeleton className="h-5 w-full mb-1" />
        <Skeleton className="h-5 w-2/3 mb-4" />
        
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-4 border-t border-secondary-100/10 bg-primary-80/30 relative z-10">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
} 