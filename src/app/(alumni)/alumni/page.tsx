import { AlumniStats } from "@/components/alumni/stats"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, Calendar, ArrowRight, Sparkles, Trophy } from "lucide-react"

export default function AlumniPage() {
  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-gold-default/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[35rem] h-[35rem] rounded-full bg-secondary-100/5 blur-3xl" />
      </div>
      
      {/* Header */}
      <section className="container pt-8 pb-12">
        <PageHeader
          gradient
          heading="BISO Alumni Network"
          subheading="Connect with our community of graduates and industry professionals"
          actions={
            <>
              <Button variant="glass-dark">Join Network</Button>
              <Button variant="gradient">Explore Events</Button>
            </>
          }
        />
      </section>

      {/* Stats */}
      <section className="container pb-16">
        <AlumniStats />
      </section>
      
      {/* Featured sections */}
      <section className="container pb-16">
        <h2 className="text-2xl font-bold mb-6 text-white">Featured Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="glass-dark" className="group hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-secondary-100">Mentorship Program</CardTitle>
                  <CardDescription className="text-gray-400 mt-1">Learn from industry experts</CardDescription>
                </div>
                <div className="p-3 rounded-lg bg-secondary-100/20 group-hover:bg-secondary-100/30 transition-colors">
                  <GraduationCap className="h-5 w-5 text-secondary-100" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Connect with experienced professionals who can guide your career path and provide valuable insights.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm" className="w-full mt-2 group">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card variant="glass-dark" className="group hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-blue-accent">Networking Events</CardTitle>
                  <CardDescription className="text-gray-400 mt-1">Expand your professional network</CardDescription>
                </div>
                <div className="p-3 rounded-lg bg-blue-accent/20 group-hover:bg-blue-accent/30 transition-colors">
                  <Users className="h-5 w-5 text-blue-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Participate in exclusive events designed to help you build meaningful connections with fellow alumni.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="gradient" size="sm" className="w-full mt-2 group">
                View Calendar
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card variant="golden" className="group hover:-translate-y-2 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-gold-strong">Achievement Awards</CardTitle>
                  <CardDescription className="text-primary-80 mt-1">Recognize excellence</CardDescription>
                </div>
                <div className="p-3 rounded-lg bg-gold-strong/20 group-hover:bg-gold-strong/30 transition-colors">
                  <Trophy className="h-5 w-5 text-gold-strong" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary-80">
                Nominate outstanding alumni who have made significant contributions to their fields or communities.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="golden-gradient" size="sm" className="w-full mt-2 group">
                Nominate Now
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      {/* Feature banner */}
      <section className="container pb-16">
        <Card variant="gradient" className="overflow-hidden">
          <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">Join Our Global Alumni Community</h2>
              <p className="text-white/80">
                Access exclusive resources, events, job opportunities, and connect with fellow graduates around the world.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Button variant="glass" className="backdrop-blur-md border border-white/20">
                  Sign Up Now
                </Button>
                <Button variant="animated">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative w-full md:w-1/3 aspect-video bg-primary-80/30 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:16px_16px] animate-pulse opacity-60" />
              </div>
              <div className="text-6xl font-bold animate-float">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
} 