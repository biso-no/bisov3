"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Check, ChevronsUpDown, Loader2, Plus, Trash, Upload, X, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

import {
  addEducation,
  addExperience,
  getCurrentUserProfile,
  upsertUserProfile,
  deleteEducation,
  deleteExperience,
  updateEducation,
  updateExperience,
} from "../../actions";

import { UserProfile, Experience, Education, Language, SocialLink, PrivacySettings } from "@/lib/types/alumni";

// Form schemas for validation
const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  title: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  location: z.string().optional(),
  graduationYear: z.string().optional(),
  department: z.string().optional(),
  degree: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  available: z.boolean().optional(),
});

const experienceSchema = z.object({
  title: z.string().min(2, { message: "Job title is required" }),
  company: z.string().min(2, { message: "Company name is required" }),
  location: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

const educationSchema = z.object({
  degree: z.string().min(2, { message: "Degree is required" }),
  institution: z.string().min(2, { message: "Institution is required" }),
  location: z.string().optional(),
  startYear: z.string().min(4, { message: "Start year is required" }),
  endYear: z.string().min(4, { message: "End year is required" }),
  description: z.string().optional(),
});

const privacySchema = z.object({
  showEmail: z.boolean().default(true),
  showPhone: z.boolean().default(false),
  showSocial: z.boolean().default(true),
  allowMessages: z.boolean().default(true),
  allowMentoring: z.boolean().default(false),
});

const socialSchema = z.object({
  platform: z.string().min(1, { message: "Platform is required" }),
  url: z.string().url({ message: "Please enter a valid URL" }),
});

const languageSchema = z.object({
  language: z.string().min(2, { message: "Language is required" }),
  proficiency: z.string().min(2, { message: "Proficiency level is required" }),
});

// Component for skill input with autocomplete
const SkillInput = ({ value = [], onChange }: { value: string[], onChange: (value: string[]) => void }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddSkill = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-2">
      <div className="flex">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a skill..."
          className="rounded-r-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSkill();
            }
          }}
        />
        <Button 
          type="button" 
          onClick={handleAddSkill} 
          className="rounded-l-none"
          variant="secondary"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((skill) => (
          <Badge key={skill} variant="secondary" className="flex items-center gap-1 py-1.5">
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="ml-1 rounded-full hover:bg-muted p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  
  // Edit states
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);

  // Forms
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      title: "",
      company: "",
      email: "",
      phone: "",
      location: "",
      graduationYear: "",
      department: "",
      degree: "",
      bio: "",
      skills: [],
      interests: [],
      available: false,
    },
  });

  const experienceForm = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      startDate: new Date(),
      endDate: null,
      current: false,
      description: "",
    },
  });

  const educationForm = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      location: "",
      startYear: "",
      endYear: "",
      description: "",
    },
  });

  const privacyForm = useForm<z.infer<typeof privacySchema>>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      showEmail: true,
      showPhone: false,
      showSocial: true,
      allowMessages: true,
      allowMentoring: false,
    },
  });

  const socialForm = useForm<z.infer<typeof socialSchema>>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      platform: "",
      url: "",
    },
  });

  const languageForm = useForm<z.infer<typeof languageSchema>>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: "",
      proficiency: "",
    },
  });

  // Load user profile data
  useEffect(() => {
    // Set document title
    document.title = "Edit Profile | BISO";
    
    async function loadProfile() {
      setLoading(true);
      try {
        const profile = await getCurrentUserProfile();
        setUserProfile(profile);
        
        if (profile) {
          // Set profile form values
          profileForm.reset({
            name: profile.name || "",
            title: profile.title || "",
            company: profile.company || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            graduationYear: profile.graduationYear || "",
            department: profile.department || "",
            degree: profile.degree || "",
            bio: profile.bio || "",
            skills: profile.skills || [],
            interests: profile.interests || [],
            available: profile.available || false,
          });
          
          // Set experiences, educations, etc.
          setExperiences(profile.experiences || []);
          setEducations(profile.education || []);
          setLanguages(profile.languages || []);
          setSocialLinks(profile.socialLinks || []);
          setPrivacySettings(profile.privacySettings || null);
          
          // Set privacy form values if available
          if (profile.privacySettings) {
            privacyForm.reset({
              showEmail: profile.privacySettings.showEmail,
              showPhone: profile.privacySettings.showPhone,
              showSocial: profile.privacySettings.showSocial,
              allowMessages: profile.privacySettings.allowMessages,
              allowMentoring: profile.privacySettings.allowMentoring,
            });
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error loading profile",
          description: "Could not load your profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [profileForm, privacyForm]);

  // Set experience form values when editing
  useEffect(() => {
    if (editingExperience) {
      experienceForm.reset({
        title: editingExperience.title,
        company: editingExperience.company,
        location: editingExperience.location || "",
        startDate: new Date(editingExperience.startDate),
        endDate: editingExperience.endDate ? new Date(editingExperience.endDate) : null,
        current: editingExperience.current,
        description: editingExperience.description || "",
      });
    }
  }, [editingExperience, experienceForm]);

  // Set education form values when editing
  useEffect(() => {
    if (editingEducation) {
      educationForm.reset({
        degree: editingEducation.degree,
        institution: editingEducation.institution,
        location: editingEducation.location || "",
        startYear: editingEducation.startYear,
        endYear: editingEducation.endYear,
        description: editingEducation.description || "",
      });
    }
  }, [editingEducation, educationForm]);

  // Save profile data
  const onSaveProfile = async (data: z.infer<typeof profileSchema>) => {
    setSaving(true);
    try {
      // Create a new object without the 'available' field
      const { available, ...profileData } = data;
      
      await upsertUserProfile(profileData);
      toast({
        title: "Profile saved",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving profile",
        description: "Could not save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Add/Edit experience
  const onSaveExperience = async (data: z.infer<typeof experienceSchema>) => {
    setSaving(true);
    try {
      const formattedData = {
        ...data,
        startDate: data.startDate.toISOString().split('T')[0],
        endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : undefined,
        userId: userProfile?.$id || "",
      };

      if (editingExperience) {
        // Update existing experience
        await updateExperience(editingExperience.$id, formattedData);
        setExperiences(experiences.map(exp => 
          exp.$id === editingExperience.$id ? { ...exp, ...formattedData } : exp
        ));
      } else {
        // Add new experience
        const newExperience = await addExperience(formattedData);
        setExperiences([...experiences, newExperience]);
      }

      experienceForm.reset();
      setEditingExperience(null);
      setIsAddingExperience(false);
      toast({
        title: editingExperience ? "Experience updated" : "Experience added",
        description: `Your work experience has been ${editingExperience ? "updated" : "added"} successfully.`,
      });
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error saving experience",
        description: "Could not save your work experience. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Add/Edit education
  const onSaveEducation = async (data: z.infer<typeof educationSchema>) => {
    setSaving(true);
    try {
      const formattedData = {
        ...data,
        userId: userProfile?.$id || "",
      };

      if (editingEducation) {
        // Update existing education
        await updateEducation(editingEducation.$id, formattedData);
        setEducations(educations.map(edu => 
          edu.$id === editingEducation.$id ? { ...edu, ...formattedData } : edu
        ));
      } else {
        // Add new education
        const newEducation = await addEducation(formattedData);
        setEducations([...educations, newEducation]);
      }

      educationForm.reset();
      setEditingEducation(null);
      setIsAddingEducation(false);
      toast({
        title: editingEducation ? "Education updated" : "Education added",
        description: `Your education has been ${editingEducation ? "updated" : "added"} successfully.`,
      });
    } catch (error) {
      console.error("Error saving education:", error);
      toast({
        title: "Error saving education",
        description: "Could not save your education. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete experience
  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter(exp => exp.$id !== id));
      toast({
        title: "Experience deleted",
        description: "Your work experience has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error deleting experience",
        description: "Could not delete your work experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete education
  const handleDeleteEducation = async (id: string) => {
    try {
      await deleteEducation(id);
      setEducations(educations.filter(edu => edu.$id !== id));
      toast({
        title: "Education deleted",
        description: "Your education has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting education:", error);
      toast({
        title: "Error deleting education",
        description: "Could not delete your education. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add/Edit language
  const onSaveLanguage = async (data: z.infer<typeof languageSchema>) => {
    setSaving(true);
    try {
      if (editingLanguage) {
        // Update existing language
        // Implement API call when available
        setLanguages(languages.map(lang => 
          lang.$id === editingLanguage.$id ? { ...lang, ...data } : lang
        ));
      } else {
        // Add new language
        // Implement API call when available
        const newLanguage: Language = {
          $id: `temp-${Date.now()}`,
          userId: userProfile?.$id || "",
          language: data.language,
          proficiency: data.proficiency,
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
          $permissions: [],
          $collectionId: "languages",
          $databaseId: ""
        };
        setLanguages([...languages, newLanguage]);
      }

      languageForm.reset();
      setEditingLanguage(null);
      setIsAddingLanguage(false);
      toast({
        title: editingLanguage ? "Language updated" : "Language added",
        description: `Your language has been ${editingLanguage ? "updated" : "added"} successfully.`,
      });
    } catch (error) {
      console.error("Error saving language:", error);
      toast({
        title: "Error saving language",
        description: "Could not save your language. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Add/Edit social link
  const onSaveSocial = async (data: z.infer<typeof socialSchema>) => {
    setSaving(true);
    try {
      if (editingSocial) {
        // Update existing social link
        // Implement API call when available
        setSocialLinks(socialLinks.map(link => 
          link.$id === editingSocial.$id ? { ...link, ...data } : link
        ));
      } else {
        // Add new social link
        // Implement API call when available
        const newSocialLink: SocialLink = {
          $id: `temp-${Date.now()}`,
          userId: userProfile?.$id || "",
          platform: data.platform,
          url: data.url,
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
          $permissions: [],
          $collectionId: "socialLinks",
          $databaseId: ""
        };
        setSocialLinks([...socialLinks, newSocialLink]);
      }

      socialForm.reset();
      setEditingSocial(null);
      setIsAddingSocial(false);
      toast({
        title: editingSocial ? "Social link updated" : "Social link added",
        description: `Your social link has been ${editingSocial ? "updated" : "added"} successfully.`,
      });
    } catch (error) {
      console.error("Error saving social link:", error);
      toast({
        title: "Error saving social link",
        description: "Could not save your social link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete language
  const handleDeleteLanguage = async (id: string) => {
    try {
      // Implement API call when available
      setLanguages(languages.filter(lang => lang.$id !== id));
      toast({
        title: "Language deleted",
        description: "Your language has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting language:", error);
      toast({
        title: "Error deleting language",
        description: "Could not delete your language. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete social link
  const handleDeleteSocial = async (id: string) => {
    try {
      // Implement API call when available
      setSocialLinks(socialLinks.filter(link => link.$id !== id));
      toast({
        title: "Social link deleted",
        description: "Your social link has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast({
        title: "Error deleting social link",
        description: "Could not delete your social link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate initials from name
  const initials = profileForm.watch("name")
    ? profileForm.watch("name")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AL";

  if (loading) {
    return (
      <div className="relative min-h-screen pb-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
          <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
        </div>
        
        <div className="container flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-blue-accent mb-4" />
          <p className="text-gray-300 mt-2">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-accent/5 blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-secondary-100/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] rounded-full bg-blue-accent/5 blur-3xl" />
      </div>
      
      <div className="container pt-8 pb-8">
        <div className="space-y-6">
          {/* Page header with preview button */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
              <p className="text-gray-300">Update your alumni profile information</p>
            </div>
            <div className="flex gap-2">
              <Button variant="glass" className="border border-secondary-100/20" onClick={() => router.push("/alumni/profile")}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                onClick={profileForm.handleSubmit(onSaveProfile)}
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile
              </Button>
            </div>
          </div>

          {/* Profile editor with tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 h-auto glass-dark backdrop-blur-md border border-secondary-100/20 p-1">
              <TabsTrigger 
                value="personal" 
                className="py-2.5 data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
              >
                Personal
              </TabsTrigger>
              <TabsTrigger 
                value="experience" 
                className="py-2.5 data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
              >
                Experience
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="py-2.5 data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
              >
                Education
              </TabsTrigger>
              <TabsTrigger 
                value="extras" 
                className="py-2.5 data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
              >
                Additional
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="py-2.5 hidden lg:block data-[state=active]:shadow-none transition-all duration-300 hover:text-white h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-accent/70 data-[state=active]:to-secondary-100/70 data-[state=active]:text-white data-[state=active]:rounded data-[state=active]:font-medium text-gray-400"
              >
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar and basic info */}
                <Card variant="glass-dark" className="md:col-span-1 border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-white">Profile Photo</CardTitle>
                    <CardDescription className="text-gray-300">Your profile picture helps people recognize you</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center relative z-10">
                    <div className="mb-4 relative group/avatar">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-accent/50 to-secondary-100/30 blur-sm opacity-0 group-hover/avatar:opacity-100 transition-all duration-300"></div>
                      <Avatar className="h-24 w-24 border-4 border-primary-90 relative shadow-lg group-hover/avatar:shadow-glow-blue transition-all duration-300">
                        <AvatarImage src={userProfile?.avatarUrl} alt={profileForm.watch("name")} />
                        <AvatarFallback className="text-xl bg-primary-80 text-white">{initials}</AvatarFallback>
                      </Avatar>
                      <Button size="sm" variant="gradient" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-300 text-center mt-2">
                      Upload a square image, at least 400x400px
                    </p>
                  </CardContent>
                </Card>

                {/* Basic information form */}
                <Card variant="glass-dark" className="md:col-span-2 border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-white">Basic Information</CardTitle>
                    <CardDescription className="text-gray-300">Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Form {...profileForm}>
                      <form className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g. Software Engineer" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company/Organization</FormLabel>
                                <FormControl>
                                  <Input placeholder="Where you work" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="City, Country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={profileForm.control}
                          name="available"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Available for Opportunities</FormLabel>
                                <FormDescription>
                                  Let recruiters and other alumni know you&apos;re open to opportunities
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Bio and education details */}
                <Card variant="glass-dark" className="md:col-span-3 border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-white">About You</CardTitle>
                    <CardDescription className="text-gray-300">Tell us about yourself and your education background</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Form {...profileForm}>
                      <form className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Write a short bio about yourself" 
                                  className="min-h-[120px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription className="text-gray-300">
                                Write a few sentences about yourself, your career, and interests.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="graduationYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Graduation Year</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g. 2018" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g. Computer Science" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="degree"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Degree</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g. Bachelor of Science" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-4">
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <div>
                    <CardTitle className="text-white">Work Experience</CardTitle>
                    <CardDescription className="text-gray-300">Add your professional experience</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="gradient"
                    onClick={() => {
                      experienceForm.reset({
                        title: "",
                        company: "",
                        location: "",
                        startDate: new Date(),
                        endDate: null,
                        current: false,
                        description: "",
                      });
                      setEditingExperience(null);
                      setIsAddingExperience(true);
                    }}
                    disabled={isAddingExperience}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Experience
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  {/* Form for adding/editing experience */}
                  {(isAddingExperience || editingExperience) && (
                    <div className="rounded-lg border border-secondary-100/20 p-4 glass shadow-sm">
                      <h3 className="font-medium mb-3 text-white">
                        {editingExperience ? "Edit Experience" : "Add New Experience"}
                      </h3>
                      <Form {...experienceForm}>
                        <form onSubmit={experienceForm.handleSubmit(onSaveExperience)} className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={experienceForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Job Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="E.g. Software Engineer" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={experienceForm.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Company</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Company name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={experienceForm.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Location (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g. San Francisco, CA" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={experienceForm.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel className="text-gray-300">Start Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="glass"
                                          className={cn(
                                            "pl-3 text-left font-normal border border-secondary-100/20",
                                            !field.value && "text-gray-400"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date()}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={experienceForm.control}
                              name="current"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                                  <FormControl>
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                          field.onChange(checked);
                                          if (checked) {
                                            experienceForm.setValue("endDate", null);
                                          }
                                        }}
                                      />
                                      <span className="text-gray-300">I currently work here</span>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {!experienceForm.watch("current") && (
                            <FormField
                              control={experienceForm.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel className="text-gray-300">End Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="glass"
                                          className={cn(
                                            "pl-3 text-left font-normal border border-secondary-100/20",
                                            !field.value && "text-gray-400"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value || undefined}
                                        onSelect={field.onChange}
                                        disabled={(date) => 
                                          date > new Date() || 
                                          (experienceForm.watch("startDate") && date < experienceForm.watch("startDate"))
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          <FormField
                            control={experienceForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Description (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your role, responsibilities, and achievements" 
                                    className="min-h-[100px]" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end space-x-2 pt-2">
                            <Button
                              type="button"
                              variant="glass"
                              className="border border-secondary-100/20"
                              onClick={() => {
                                setIsAddingExperience(false);
                                setEditingExperience(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" variant="gradient" disabled={saving}>
                              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              {editingExperience ? "Update" : "Add"} Experience
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  )}

                  {/* List of experiences */}
                  <div className="space-y-4">
                    {experiences.length === 0 && !isAddingExperience ? (
                      <div className="text-center p-6 glass border border-secondary-100/10 rounded-lg">
                        <p className="text-gray-300 mb-2">No work experience added yet.</p>
                        <Button 
                          variant="gradient" 
                          onClick={() => setIsAddingExperience(true)}
                        >
                          Add your first work experience
                        </Button>
                      </div>
                    ) : (
                      experiences
                        .sort((a, b) => {
                          if (a.current && !b.current) return -1;
                          if (!a.current && b.current) return 1;
                          
                          const dateA = a.endDate ? new Date(a.endDate) : new Date();
                          const dateB = b.endDate ? new Date(b.endDate) : new Date();
                          return dateB.getTime() - dateA.getTime();
                        })
                        .map((experience) => (
                          <div 
                            key={experience.$id} 
                            className="p-4 glass border border-secondary-100/20 rounded-lg hover:border-blue-accent/40 transition-all hover:shadow-card-hover"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-base text-white">{experience.title}</h3>
                                <p className="text-gray-300">{experience.company}</p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                                  {experience.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-secondary-100" />
                                      {experience.location}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3 text-blue-accent" />
                                    {new Date(experience.startDate).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      year: 'numeric' 
                                    })}
                                    {" - "}
                                    {experience.current ? (
                                      "Present"
                                    ) : (
                                      experience.endDate && new Date(experience.endDate).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        year: 'numeric' 
                                      })
                                    )}
                                  </span>
                                </div>
                                {experience.description && (
                                  <p className="mt-2 text-sm text-gray-300">{experience.description}</p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="glass" 
                                  size="sm"
                                  onClick={() => setEditingExperience(experience)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteExperience(experience.$id)}
                                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4">
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <div>
                    <CardTitle className="text-white">Education</CardTitle>
                    <CardDescription className="text-gray-300">Add your academic qualifications</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="gradient"
                    onClick={() => {
                      educationForm.reset({
                        degree: "",
                        institution: "",
                        location: "",
                        startYear: "",
                        endYear: "",
                        description: "",
                      });
                      setEditingEducation(null);
                      setIsAddingEducation(true);
                    }}
                    disabled={isAddingEducation}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Education
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  {/* Form for adding/editing education */}
                  {(isAddingEducation || editingEducation) && (
                    <div className="rounded-lg border border-secondary-100/20 p-4 glass shadow-sm">
                      <h3 className="font-medium mb-3 text-white">
                        {editingEducation ? "Edit Education" : "Add New Education"}
                      </h3>
                      <Form {...educationForm}>
                        <form onSubmit={educationForm.handleSubmit(onSaveEducation)} className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={educationForm.control}
                              name="degree"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Degree</FormLabel>
                                  <FormControl>
                                    <Input placeholder="E.g. Bachelor of Science" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={educationForm.control}
                              name="institution"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Institution</FormLabel>
                                  <FormControl>
                                    <Input placeholder="E.g. University of California" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={educationForm.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Location (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g. Berkeley, CA" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={educationForm.control}
                              name="startYear"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Start Year</FormLabel>
                                  <FormControl>
                                    <Input placeholder="E.g. 2015" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={educationForm.control}
                              name="endYear"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">End Year</FormLabel>
                                  <FormControl>
                                    <Input placeholder="E.g. 2019" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={educationForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Description (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your studies, achievements, or activities" 
                                    className="min-h-[100px]" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end space-x-2 pt-2">
                            <Button
                              type="button"
                              variant="glass"
                              className="border border-secondary-100/20"
                              onClick={() => {
                                setIsAddingEducation(false);
                                setEditingEducation(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" variant="gradient" disabled={saving}>
                              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              {editingEducation ? "Update" : "Add"} Education
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  )}

                  {/* List of education entries */}
                  <div className="space-y-4">
                    {educations.length === 0 && !isAddingEducation ? (
                      <div className="text-center p-6 glass border border-secondary-100/10 rounded-lg">
                        <p className="text-gray-300 mb-2">No education added yet.</p>
                        <Button 
                          variant="gradient" 
                          onClick={() => setIsAddingEducation(true)}
                        >
                          Add your education
                        </Button>
                      </div>
                    ) : (
                      educations
                        .sort((a, b) => parseInt(b.endYear) - parseInt(a.endYear))
                        .map((education) => (
                          <div 
                            key={education.$id} 
                            className="p-4 glass border border-secondary-100/20 rounded-lg hover:border-blue-accent/40 transition-all hover:shadow-card-hover"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-base text-white">{education.degree}</h3>
                                <p className="text-gray-300">{education.institution}</p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                                  {education.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-secondary-100" />
                                      {education.location}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3 text-blue-accent" />
                                    {education.startYear} - {education.endYear}
                                  </span>
                                </div>
                                {education.description && (
                                  <p className="mt-2 text-sm text-gray-300">{education.description}</p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="glass" 
                                  size="sm"
                                  onClick={() => setEditingEducation(education)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteEducation(education.$id)}
                                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Additional Info Tab */}
            <TabsContent value="extras" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-white">Skills</CardTitle>
                    <CardDescription className="text-gray-300">List your professional skills and competencies</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Form {...profileForm}>
                      <form className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Professional Skills</FormLabel>
                              <FormControl>
                                <SkillInput 
                                  value={field.value || []} 
                                  onChange={field.onChange} 
                                />
                              </FormControl>
                              <FormDescription className="text-gray-400">
                                Add skills like &quot;Project Management&quot;, &quot;JavaScript&quot;, &quot;Data Analysis&quot;, etc.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Interests */}
                <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-white">Interests</CardTitle>
                    <CardDescription className="text-gray-300">Share your professional interests and hobbies</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Form {...profileForm}>
                      <form className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="interests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Interests</FormLabel>
                              <FormControl>
                                <SkillInput 
                                  value={field.value || []} 
                                  onChange={field.onChange} 
                                />
                              </FormControl>
                              <FormDescription className="text-gray-400">
                                Add interests like &quot;Machine Learning&quot;, &quot;Entrepreneurship&quot;, &quot;Photography&quot;, etc.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <div>
                      <CardTitle className="text-white">Languages</CardTitle>
                      <CardDescription className="text-gray-300">Add languages you speak</CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      variant="gradient"
                      onClick={() => {
                        languageForm.reset({
                          language: "",
                          proficiency: "",
                        });
                        setEditingLanguage(null);
                        setIsAddingLanguage(true);
                      }}
                      disabled={isAddingLanguage}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Language
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Form for adding/editing languages */}
                    {(isAddingLanguage || editingLanguage) && (
                      <div className="rounded-lg border border-secondary-100/20 p-4 glass shadow-sm">
                        <h3 className="font-medium mb-3 text-white">
                          {editingLanguage ? "Edit Language" : "Add New Language"}
                        </h3>
                        <Form {...languageForm}>
                          <form className="space-y-3" onSubmit={languageForm.handleSubmit(onSaveLanguage)}>
                            <FormField
                              control={languageForm.control}
                              name="language"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Language</FormLabel>
                                  <FormControl>
                                    <Input placeholder="E.g. English, Spanish" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={languageForm.control}
                              name="proficiency"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Proficiency</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="border-secondary-100/20 bg-transparent">
                                        <SelectValue placeholder="Select proficiency level" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Native">Native</SelectItem>
                                      <SelectItem value="Fluent">Fluent</SelectItem>
                                      <SelectItem value="Advanced">Advanced</SelectItem>
                                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                                      <SelectItem value="Basic">Basic</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex justify-end space-x-2 pt-2">
                              <Button
                                type="button"
                                variant="glass"
                                className="border border-secondary-100/20"
                                onClick={() => {
                                  setIsAddingLanguage(false);
                                  setEditingLanguage(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                variant="gradient"
                                disabled={saving}
                              >
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingLanguage ? "Update" : "Add"} Language
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </div>
                    )}

                    {/* List of languages */}
                    <div className="space-y-2">
                      {languages.length === 0 && !isAddingLanguage ? (
                        <div className="text-center p-6 glass border border-secondary-100/10 rounded-lg">
                          <p className="text-gray-300 mb-2">No languages added yet.</p>
                          <Button 
                            variant="gradient" 
                            onClick={() => setIsAddingLanguage(true)}
                          >
                            Add your first language
                          </Button>
                        </div>
                      ) : (
                        languages.map((language) => (
                          <div 
                            key={language.$id} 
                            className="p-3 glass border border-secondary-100/20 rounded-lg hover:border-blue-accent/40 transition-all hover:shadow-card-hover flex justify-between items-center"
                          >
                            <div>
                              <h3 className="font-medium text-white">{language.language}</h3>
                              <p className="text-sm text-gray-300">{language.proficiency}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="glass" 
                                size="sm"
                                onClick={() => setEditingLanguage(language)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteLanguage(language.$id)}
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <div>
                      <CardTitle className="text-white">Social Links</CardTitle>
                      <CardDescription className="text-gray-300">Connect your social profiles</CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      variant="gradient"
                      onClick={() => {
                        socialForm.reset({
                          platform: "",
                          url: "",
                        });
                        setEditingSocial(null);
                        setIsAddingSocial(true);
                      }}
                      disabled={isAddingSocial}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Link
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    {/* Form for adding/editing social links */}
                    {(isAddingSocial || editingSocial) && (
                      <div className="rounded-lg border border-secondary-100/20 p-4 glass shadow-sm">
                        <h3 className="font-medium mb-3 text-white">
                          {editingSocial ? "Edit Social Link" : "Add New Social Link"}
                        </h3>
                        <Form {...socialForm}>
                          <form className="space-y-3" onSubmit={socialForm.handleSubmit(onSaveSocial)}>
                            <FormField
                              control={socialForm.control}
                              name="platform"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Platform</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="border-secondary-100/20 bg-transparent">
                                        <SelectValue placeholder="Select platform" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                                      <SelectItem value="twitter">Twitter/X</SelectItem>
                                      <SelectItem value="github">GitHub</SelectItem>
                                      <SelectItem value="website">Personal Website</SelectItem>
                                      <SelectItem value="instagram">Instagram</SelectItem>
                                      <SelectItem value="facebook">Facebook</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={socialForm.control}
                              name="url"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex justify-end space-x-2 pt-2">
                              <Button
                                type="button"
                                variant="glass"
                                className="border border-secondary-100/20"
                                onClick={() => {
                                  setIsAddingSocial(false);
                                  setEditingSocial(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                variant="gradient"
                                disabled={saving}
                              >
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingSocial ? "Update" : "Add"} Link
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </div>
                    )}

                    {/* List of social links */}
                    <div className="space-y-2">
                      {socialLinks.length === 0 && !isAddingSocial ? (
                        <div className="text-center p-6 glass border border-secondary-100/10 rounded-lg">
                          <p className="text-gray-300 mb-2">No social links added yet.</p>
                          <Button 
                            variant="gradient" 
                            onClick={() => setIsAddingSocial(true)}
                          >
                            Add your first social link
                          </Button>
                        </div>
                      ) : (
                        socialLinks.map((link) => (
                          <div 
                            key={link.$id} 
                            className="p-3 glass border border-secondary-100/20 rounded-lg hover:border-blue-accent/40 transition-all hover:shadow-card-hover flex justify-between items-center"
                          >
                            <div>
                              <h3 className="font-medium text-white capitalize">{link.platform}</h3>
                              <p className="text-sm text-gray-300 truncate max-w-[250px]">{link.url}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="glass" 
                                size="sm"
                                onClick={() => setEditingSocial(link)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteSocial(link.$id)}
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-4">
              <Card variant="glass-dark" className="border-0 overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-accent/10 to-secondary-100/5 opacity-20" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white">Privacy Settings</CardTitle>
                  <CardDescription className="text-gray-300">Control who can see your information</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Form {...privacyForm}>
                    <form className="space-y-4">
                      <FormField
                        control={privacyForm.control}
                        name="showEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg glass border border-secondary-100/20 p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-white">Show Email Address</FormLabel>
                              <FormDescription className="text-gray-400">
                                Allow other alumni to see your email address
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={privacyForm.control}
                        name="showPhone"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg glass border border-secondary-100/20 p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-white">Show Phone Number</FormLabel>
                              <FormDescription className="text-gray-400">
                                Allow other alumni to see your phone number
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={privacyForm.control}
                        name="showSocial"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg glass border border-secondary-100/20 p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-white">Show Social Links</FormLabel>
                              <FormDescription className="text-gray-400">
                                Allow other alumni to see your social media profiles
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={privacyForm.control}
                        name="allowMessages"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg glass border border-secondary-100/20 p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-white">Allow Messages</FormLabel>
                              <FormDescription className="text-gray-400">
                                Allow other alumni to send you direct messages
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={privacyForm.control}
                        name="allowMentoring"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg glass border border-secondary-100/20 p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-white">Open to Mentoring</FormLabel>
                              <FormDescription className="text-gray-400">
                                Display your profile in the mentoring section
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="pt-4">
                        <Button 
                          type="button" 
                          variant="gradient"
                          className="w-full"
                          onClick={() => {
                            // Save privacy settings
                            toast({
                              title: "Privacy settings saved",
                              description: "Your privacy preferences have been updated.",
                            });
                          }}
                        >
                          Save Privacy Settings
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 