"use client"

import { useState } from "react"
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// FAQ data organized by categories
const faqData = [
  {
    category: "General Questions",
    items: [
      {
        question: "What is the alumni mentoring program?",
        answer: "The alumni mentoring program connects experienced alumni with current students and recent graduates to provide guidance, support, and career development. Mentors share their expertise, insights, and networks to help mentees achieve their professional goals."
      },
      {
        question: "Who can become a mentor?",
        answer: "Any alumnus with at least one year of professional experience can apply to become a mentor. We welcome mentors from all industries, backgrounds, and career stages who are willing to share their knowledge and support the next generation of professionals."
      },
      {
        question: "What is the time commitment for mentors?",
        answer: "The time commitment is flexible and depends on your availability. Most mentors commit to 2-4 hours per month, which typically includes one-on-one meetings, email exchanges, or other forms of communication with mentees."
      },
      {
        question: "Is there a fee to participate in the mentoring program?",
        answer: "No, the alumni mentoring program is a volunteer initiative and is completely free for both mentors and mentees."
      }
    ]
  },
  {
    category: "For Mentors",
    items: [
      {
        question: "What are the responsibilities of a mentor?",
        answer: "Mentors are expected to share their knowledge and experience, provide constructive feedback, help mentees set realistic goals, offer career guidance, and potentially introduce mentees to relevant professional networks. Most importantly, mentors should be responsive, supportive, and committed to their mentee's growth."
      },
      {
        question: "How are mentors matched with mentees?",
        answer: "Mentors are matched with mentees based on shared interests, industry alignment, career goals, and other relevant factors. We use a combination of algorithms and manual review to ensure the best possible match between mentors and mentees."
      },
      {
        question: "Can I mentor multiple mentees simultaneously?",
        answer: "Yes, you can specify the maximum number of mentees you're willing to mentor at once. However, we recommend starting with just one or two mentees to ensure you can provide quality guidance and maintain a manageable commitment."
      },
      {
        question: "What if the mentoring relationship isn't working out?",
        answer: "If either the mentor or mentee feels the relationship isn't productive, they can contact the program administrators to request a reassignment. We understand that not all matches will be perfect, and we're committed to making the experience valuable for everyone involved."
      }
    ]
  },
  {
    category: "For Mentees",
    items: [
      {
        question: "How do I get matched with a mentor?",
        answer: "Mentees can browse available mentors in the directory or apply to specific mentoring programs. When you find a mentor whose expertise aligns with your goals, you can request to connect. Alternatively, you can submit your preferences, and we'll recommend potential matches."
      },
      {
        question: "What should I expect from my mentor?",
        answer: "Your mentor will provide guidance, share experiences, offer feedback on your goals and plans, and possibly introduce you to relevant professional networks. Remember that mentors are volunteers who are sharing their time and knowledge, so be respectful of their availability and come prepared to your meetings."
      },
      {
        question: "How long does a mentoring relationship last?",
        answer: "Mentoring relationships can vary in length. Some formal programs have a defined timeline (e.g., 3-6 months), while other mentor-mentee relationships may continue informally for years. The duration often depends on the goals set by the mentee and the mutual agreement between both parties."
      },
      {
        question: "How can I make the most of my mentoring experience?",
        answer: "Come prepared to meetings with specific questions or topics to discuss. Be open to feedback, take initiative in scheduling meetings, follow through on action items, be respectful of your mentor's time, and express gratitude for their support and guidance."
      }
    ]
  },
  {
    category: "Application Process",
    items: [
      {
        question: "How do I apply to become a mentor?",
        answer: "To apply, navigate to the 'Become a Mentor' tab on the Mentoring page and click 'Apply to Become a Mentor'. Complete the application form with your professional information, areas of expertise, and mentoring preferences. Our team will review your application and notify you of the decision within 2 weeks."
      },
      {
        question: "What happens after I submit my mentor application?",
        answer: "After submission, our team will review your application to ensure it meets our program requirements. You may be asked to participate in a brief orientation session. Once approved, your profile will be visible to potential mentees, and you'll receive notifications when someone requests to connect with you."
      },
      {
        question: "Can I update my mentor profile after it's been approved?",
        answer: "Yes, you can update your mentor profile at any time. We encourage mentors to keep their profiles current with up-to-date information about their professional roles, expertise, and availability."
      },
      {
        question: "How long does the application review process take?",
        answer: "Typically, the application review process takes 1-2 weeks. You'll receive an email notification with the decision and next steps once the review is complete."
      }
    ]
  },
  {
    category: "Technical Support",
    items: [
      {
        question: "What should I do if I encounter technical issues with the platform?",
        answer: "If you experience technical difficulties, please contact our support team at alumni.support@biso.edu. Include a detailed description of the issue, any error messages you received, and steps to reproduce the problem. Our team will respond promptly to assist you."
      },
      {
        question: "How can I manage my notification preferences?",
        answer: "You can manage your notification preferences in your account settings. Navigate to the profile dropdown menu, select 'Settings', and then 'Notifications' to customize how and when you receive updates about mentoring activities."
      }
    ]
  }
];

export default function MentoringFAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };
  
  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
      </div>
      
      <div className="container px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-white"
            asChild
          >
            <Link href="/alumni/mentoring" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Mentoring
            </Link>
          </Button>
        </div>
        
        <PageHeader
          gradient
          heading="Mentoring FAQ"
          subheading="Frequently asked questions about our alumni mentoring program"
        />
        
        <Card variant="glass-dark" className="border-0 overflow-hidden mt-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-accent" />
              Find Answers to Common Questions
            </CardTitle>
            <CardDescription className="text-gray-300">
              Browse through our frequently asked questions to learn more about the alumni mentoring program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            {faqData.map((category, index) => (
              <div key={category.category} className="space-y-4">
                <div 
                  className={`flex justify-between items-center p-4 rounded-lg cursor-pointer transition-colors ${
                    activeCategory === category.category 
                      ? "bg-blue-accent/20 text-white" 
                      : "bg-primary-80/30 text-gray-300 hover:bg-primary-80/50 hover:text-white"
                  }`}
                  onClick={() => toggleCategory(category.category)}
                >
                  <h3 className="text-lg font-medium">{category.category}</h3>
                  {activeCategory === category.category ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
                
                {activeCategory === category.category && (
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.items.map((item, i) => (
                      <AccordionItem 
                        key={i} 
                        value={`item-${i}`}
                        className="border border-secondary-100/10 rounded-md overflow-hidden bg-primary-90/50"
                      >
                        <AccordionTrigger className="px-4 py-3 text-white hover:no-underline hover:bg-primary-80/30">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-1 text-gray-300">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
                
                {index < faqData.length - 1 && activeCategory === category.category && (
                  <Separator className="bg-primary-80/20" />
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t border-secondary-100/10 bg-primary-80/30 p-6 flex flex-col items-center text-center relative z-10">
            <p className="text-gray-300 mb-4">
              Still have questions about the mentoring program? Contact us for more information.
            </p>
            <Button variant="gradient" asChild>
              <Link href="mailto:alumni.mentoring@biso.edu">
                Contact Mentoring Support
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 