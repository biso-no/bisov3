import { AlumniProfile } from "./alumni-card"

// Mock data for alumni profiles
export const alumniProfiles: AlumniProfile[] = [
  {
    id: "alumni-001",
    name: "Sarah Johnson",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    position: "Senior Product Manager",
    company: "TechVision AS",
    location: "Oslo, Norway",
    department: "Business Administration",
    graduationYear: "2018",
    bio: "Product management professional with expertise in SaaS and fintech products.",
    skills: ["Product Strategy", "User Research", "Agile", "Product Analytics"],
    available: {
      mentoring: true,
      jobOpportunities: true,
      speaking: false,
      networking: true
    },
    social: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnson",
      website: "https://sarahjohnson.com"
    },
    lastActive: new Date(new Date().setDate(new Date().getDate() - 2))
  },
  {
    id: "alumni-002",
    name: "Alex Wong",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    position: "Data Scientist",
    company: "AnalyticsPro",
    location: "Trondheim, Norway",
    department: "Computer Science",
    graduationYear: "2020",
    bio: "Passionate about turning data into actionable insights through machine learning.",
    skills: ["Python", "Machine Learning", "Data Visualization", "Statistics"],
    available: {
      mentoring: true,
      jobOpportunities: false,
      speaking: true,
      networking: true
    },
    social: {
      linkedin: "https://linkedin.com/in/alexwong",
    },
    lastActive: new Date(new Date().setDate(new Date().getDate() - 5))
  },
  {
    id: "alumni-003",
    name: "Emma Larsen",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    position: "Marketing Director",
    company: "Nordic Brands",
    location: "Bergen, Norway",
    department: "Marketing",
    graduationYear: "2016",
    bio: "Digital marketing strategist with experience in brand development and marketing campaigns.",
    skills: ["Digital Marketing", "Brand Strategy", "Social Media", "Content Creation"],
    available: {
      mentoring: true,
      jobOpportunities: false,
      speaking: true,
      networking: false
    },
    social: {
      linkedin: "https://linkedin.com/in/emmalarsen",
      twitter: "https://twitter.com/emmalarsen",
    },
    lastActive: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    id: "alumni-004",
    name: "Martin Eriksen",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704g",
    position: "Investment Analyst",
    company: "Nordic Capital Partners",
    location: "Oslo, Norway",
    department: "Finance",
    graduationYear: "2021",
    bio: "Finance professional specializing in investment analysis and portfolio management.",
    skills: ["Financial Analysis", "Investment Management", "Market Research", "Excel"],
    available: {
      mentoring: false,
      jobOpportunities: false,
      speaking: false,
      networking: true
    },
    social: {
      linkedin: "https://linkedin.com/in/martineriksen",
    },
    lastActive: new Date(new Date().setDate(new Date().getDate() - 3))
  },
  {
    id: "alumni-005",
    name: "Olivia Hansen",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704h",
    position: "UX/UI Designer",
    company: "CreativeNordic",
    location: "Stavanger, Norway",
    department: "Computer Science",
    graduationYear: "2019",
    bio: "UX/UI designer with a passion for creating intuitive and beautiful digital experiences.",
    skills: ["User Research", "UI Design", "Wireframing", "Prototyping"],
    available: {
      mentoring: true,
      jobOpportunities: false,
      speaking: true,
      networking: true
    },
    social: {
      linkedin: "https://linkedin.com/in/oliviahansen",
      website: "https://oliviahansen.design"
    },
    lastActive: new Date(new Date().setDate(new Date().getDate() - 4))
  },
  {
    id: "alumni-006",
    name: "Jonas Berg",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704i",
    position: "Management Consultant",
    company: "Nordic Advisory Group",
    location: "Oslo, Norway",
    department: "Business Administration",
    graduationYear: "2017",
    bio: "Strategy consultant helping organizations navigate digital transformation.",
    skills: ["Strategy", "Business Development", "Change Management", "Digital Transformation"],
    available: {
      mentoring: true,
      jobOpportunities: true,
      speaking: true,
      networking: true
    },
    social: {
      linkedin: "https://linkedin.com/in/jonasberg",
      twitter: "https://twitter.com/jonasberg",
    },
    lastActive: new Date()
  },
] 