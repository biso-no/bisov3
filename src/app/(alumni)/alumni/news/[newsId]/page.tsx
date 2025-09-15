"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Eye, 
  Tag,
  Link as LinkIcon,
  Printer, 
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { getNewsById, updateNewsViews } from "../../actions"
import type { NewsItem } from "@/lib/types/alumni"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<NewsItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const newsId = params.newsId as string
  
  useEffect(() => {
    const fetchNews = async () => {
      if (!newsId) return
      
      try {
        setIsLoading(true)
        const newsItem = await getNewsById(newsId)
        
        if (!newsItem) {
          setError("News article not found")
          return
        }
        
        setNews(newsItem)
        
        // Update the document title
        document.title = `${newsItem.title} | BISO Alumni News`
        
        // Increment view count
        if (newsItem.views !== undefined) {
          updateNewsViews(newsId, newsItem.views + 1)
        }
      } catch (error) {
        console.error("Error fetching news:", error)
        setError("Error loading news article")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchNews()
  }, [newsId])
  
  const handleShare = (platform: string) => {
    const shareUrl = window.location.href
    const title = news?.title || "BISO Alumni News"
    
    let shareLink = ""
    
    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case "copy":
        navigator.clipboard.writeText(shareUrl)
        return
      case "print":
        window.print()
        return
    }
    
    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400")
    }
  }
  
  // Determine estimated reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content?.split(/\s+/).length || 0
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime > 0 ? readingTime : 1
  }

  if (isLoading) {
    return <NewsDetailSkeleton />
  }
  
  if (error || !news) {
    return (
      <div className="container p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex flex-col items-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-semibold mb-2 text-center">{error || "News article not found"}</h1>
            <p className="text-gray-500 mb-6 text-center">The news article you&apos;re looking for may have been removed or doesn&apos;t exist.</p>
            <Button onClick={() => router.push("/alumni/news")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to News
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-160 h-160 rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-120 h-120 rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      <div className="container p-8">
        <div className="flex flex-col items-start gap-4">
          <Button variant="ghost" className="text-blue-accent hover:text-blue-accent/80" onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to News
          </Button>
          
          <div className="w-full max-w-4xl mx-auto">
            {/* Article header */}
            <div className="mb-8">
              {news.category && (
                <Badge 
                  variant="outline" 
                  className="backdrop-blur-sm font-medium border-blue-accent/30 text-blue-accent bg-blue-accent/5 mb-4"
                >
                  {news.category}
                </Badge>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">{news.title}</h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-blue-accent" />
                  <span>{format(new Date(news.date), "MMMM d, yyyy")}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-secondary-100" />
                  <span>{calculateReadingTime(news.content)} min read</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-gold-default" />
                  <span>By {news.author}</span>
                </div>
                
                {news.views !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span>{news.views} views</span>
                  </div>
                )}
              </div>
              
              <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-lg mb-8">
                <Image 
                  src={news.image} 
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Article content */}
            <div className="prose prose-invert prose-blue max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>
            
            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="mb-8">
                <Separator className="mb-4" />
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400 mr-1" />
                  {news.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-secondary-100/10 hover:bg-secondary-100/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Share */}
            <div className="mt-10">
              <Separator className="mb-4" />
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center">
                  <Share2 className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-400 mr-4">Share this article:</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleShare("facebook")}
                    >
                      <Facebook className="h-4 w-4 text-blue-600" />
                      <span className="sr-only">Share on Facebook</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleShare("twitter")}
                    >
                      <Twitter className="h-4 w-4 text-blue-400" />
                      <span className="sr-only">Share on Twitter</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleShare("linkedin")}
                    >
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      <span className="sr-only">Share on LinkedIn</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleShare("copy")}
                    >
                      <LinkIcon className="h-4 w-4 text-gray-400" />
                      <span className="sr-only">Copy link</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleShare("print")}
                    >
                      <Printer className="h-4 w-4 text-gray-400" />
                      <span className="sr-only">Print</span>
                    </Button>
                  </div>
                </div>
                
                <Button variant="gradient" asChild>
                  <Link href="/alumni/news">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to News
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewsDetailSkeleton() {
  return (
    <div className="container p-8">
      <div className="flex flex-col items-start gap-4">
        <Skeleton className="h-10 w-32" />
        
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-24 mb-4" />
            <Skeleton className="h-12 w-full mb-3" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
            
            <Skeleton className="h-[400px] w-full rounded-lg mb-8" />
          </div>
          
          <div className="space-y-4 mb-8">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <div className="py-2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          
          <Skeleton className="h-px w-full my-8" />
          
          <div className="flex flex-wrap gap-2 mb-8">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          
          <Skeleton className="h-px w-full mb-4" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
} 