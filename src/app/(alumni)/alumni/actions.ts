"use server";

import { ID, Query, Models } from 'node-appwrite';
import { createSessionClient } from '@/lib/appwrite';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  UserProfile,
  Experience,
  Education,
  Certification,
  Language,
  SocialLink,
  PrivacySettings,
  Event,
  Job,
  Mentor,
  Conversation,
  Message,
  EnrichedConversation,
  Resource,
  LoginCredentials,
  RegisterData,
  PasswordResetData,
  ProgramApplication,
  MentoringProgram,
  Testimonial,
  Mentorship
} from '@/lib/types/alumni';
import { networksFeatureFlag, eventsFeatureFlag, mentoringFeatureFlag, jobsFeatureFlag, resourcesFeatureFlag, messagesFeatureFlag, adminFeatureFlag, autoAcceptMentorsFlag } from '@/lib/flags';

const DATABASE_ID = 'alumni';

// ============================================================
// USER PROFILE ACTIONS
// ============================================================

/**
 * Fetches the current user's profile
 * @returns The user profile or null if not found
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const { account, db } = await createSessionClient();
    
    // Get the current user from the session
    const user = await account.get();
    
    // Query for the user profile
    const profiles = await db.listDocuments<UserProfile>(
      DATABASE_ID,
      'userProfiles',
      [Query.equal('userId', user.$id)]
    );
    
    if (profiles.documents.length === 0) {
      return null;
    }
    
    return profiles.documents[0];
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Creates or updates a user profile
 * @param profileData The profile data to create or update
 * @returns The created or updated profile
 */
export async function upsertUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const { account, db } = await createSessionClient();
    
    // Get the current user
    const user = await account.get();
    
    // Check if profile exists
    const profiles = await db.listDocuments<UserProfile>(
      DATABASE_ID,
      'userProfiles',
      [Query.equal('userId', user.$id)]
    );
    
    // Include the userId in the profile data
    const data = {
      ...profileData,
      userId: user.$id
    };
    
    let profile;
    
    if (profiles.documents.length === 0) {
      // Create new profile
      profile = await db.createDocument<UserProfile>(
        DATABASE_ID,
        'userProfiles',
        user.$id,
        data as UserProfile
      );
    } else {
      // Update existing profile
      profile = await db.updateDocument<UserProfile>(
        DATABASE_ID,
        'userProfiles',
        profiles.documents[0].$id,
        data as UserProfile
      );
    }
    
    revalidatePath('/profile');
    return profile;
  } catch (error) {
    console.error('Error upserting user profile:', error);
    throw error;
  }
}

/**
 * Fetches a user profile by ID
 * @param userId The user ID to fetch the profile for
 * @returns The user profile or null if not found
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { db } = await createSessionClient();
    
    const profiles = await db.listDocuments<UserProfile>(
      DATABASE_ID,
      'userProfiles',
      [Query.equal('userId', userId)]
    );
    
    if (profiles.documents.length === 0) {
      return null;
    }
    
    return profiles.documents[0];
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Adds work experience to a user profile
 * @param experienceData The experience data to add
 * @returns The created experience
 */
export async function addExperience(experienceData: Partial<Experience>): Promise<Experience> {
  try {
    const { account, db } = await createSessionClient();
    
    // Get the current user
    const user = await account.get();
    
    // Create the experience document
    const experience = await db.createDocument<Experience>(
      DATABASE_ID,
      'experiences',
      ID.unique(),
      {
        ...experienceData,
        userId: user.$id
      } as Experience
    );
    
    revalidatePath('/profile');
    return experience;
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
}

/**
 * Updates a work experience entry
 * @param experienceId The ID of the experience to update
 * @param experienceData The updated experience data
 * @returns The updated experience
 */
export async function updateExperience(experienceId: string, experienceData: Partial<Experience>): Promise<Experience> {
  try {
    const { db } = await createSessionClient();
    
    // Update the experience document
    const experience = await db.updateDocument<Experience>(
      DATABASE_ID,
      'experiences',
      experienceId,
      experienceData as Experience
    );
    
    revalidatePath('/profile');
    return experience;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
}

/**
 * Deletes a work experience entry
 * @param experienceId The ID of the experience to delete
 * @returns True if successful
 */
export async function deleteExperience(experienceId: string): Promise<boolean> {
  try {
    const { db } = await createSessionClient();
    
    // Delete the experience document
    await db.deleteDocument(
      DATABASE_ID,
      'experiences',
      experienceId
    );
    
    revalidatePath('/profile');
    return true;
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
}

/**
 * Gets all experiences for a user
 * @param userId The user ID to get experiences for
 * @returns An array of experiences
 */
export async function getUserExperiences(userId: string): Promise<Experience[]> {
  try {
    const { db } = await createSessionClient();
    
    const experiences = await db.listDocuments<Experience>(
      DATABASE_ID,
      'experiences',
      [
        Query.equal('userId', userId),
        Query.orderDesc('current'),
        Query.orderDesc('endDate')
      ]
    );
    
    return experiences.documents;
  } catch (error) {
    console.error('Error fetching user experiences:', error);
    return [];
  }
}

// Education CRUD Operations

/**
 * Adds education to a user profile
 * @param educationData The education data to add
 * @returns The created education
 */
export async function addEducation(educationData: Partial<Education>): Promise<Education> {
  try {
    const { account, db } = await createSessionClient();
    
    // Get the current user
    const user = await account.get();
    
    // Create the education document
    const education = await db.createDocument<Education>(
      DATABASE_ID,
      'education',
      ID.unique(),
      {
        ...educationData,
        userId: user.$id
      } as Education
    );
    
    revalidatePath('/profile');
    return education;
  } catch (error) {
    console.error('Error adding education:', error);
    throw error;
  }
}

/**
 * Updates an education entry
 * @param educationId The ID of the education to update
 * @param educationData The updated education data
 * @returns The updated education
 */
export async function updateEducation(educationId: string, educationData: Partial<Education>): Promise<Education> {
  try {
    const { db } = await createSessionClient();
    
    // Update the education document
    const education = await db.updateDocument<Education>(
      DATABASE_ID,
      'education',
      educationId,
      educationData as Education
    );
    
    revalidatePath('/profile');
    return education;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
}

/**
 * Deletes an education entry
 * @param educationId The ID of the education to delete
 * @returns True if successful
 */
export async function deleteEducation(educationId: string): Promise<boolean> {
  try {
    const { db } = await createSessionClient();
    
    // Delete the education document
    await db.deleteDocument(
      DATABASE_ID,
      'education',
      educationId
    );
    
    revalidatePath('/profile');
    return true;
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
}

/**
 * Gets all education entries for a user
 * @param userId The user ID to get education for
 * @returns An array of education entries
 */
export async function getUserEducation(userId: string): Promise<Education[]> {
  try {
    const { db } = await createSessionClient();
    
    const educations = await db.listDocuments<Education>(
      DATABASE_ID,
      'education',
      [
        Query.equal('userId', userId),
        Query.orderDesc('endYear')
      ]
    );
    
    return educations.documents;
  } catch (error) {
    console.error('Error fetching user education:', error);
    return [];
  }
}

// ============================================================
// EVENT ACTIONS
// ============================================================

/**
 * Fetches all events, with optional filters
 * @param filters Optional array of Query filters
 * @param limit Maximum number of events to return
 * @returns Array of events
 */
export async function getEvents(filters: string[] = [], limit = 10): Promise<Event[]> {
  try {
    const { db } = await createSessionClient();
    
    const events = await db.listDocuments<Event>(
      DATABASE_ID,
      'events',
      [
        ...filters,
        Query.orderDesc('date'),
        Query.limit(limit)
      ]
    );
    
    return events.documents;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

/**
 * Fetches an event by ID
 * @param eventId The ID of the event to fetch
 * @returns The event or null if not found
 */
export async function getEvent(eventId: string): Promise<Event | null> {
  try {
    const { db } = await createSessionClient();
    
    const event = await db.getDocument<Event>(
      DATABASE_ID,
      'events',
      eventId
    );
    
    return event;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

/**
 * Creates a new event
 * @param eventData The event data to create
 * @returns The created event
 */
export async function createEvent(eventData: Partial<Event>): Promise<Event> {
  try {
    const { db } = await createSessionClient();
    
    const event = await db.createDocument<Event>(
      DATABASE_ID,
      'events',
      ID.unique(),
      eventData as Event
    );
    
    revalidatePath('/events');
    return event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

/**
 * Updates an event
 * @param eventId The ID of the event to update
 * @param eventData The updated event data
 * @returns The updated event
 */
export async function updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
  try {
    const { db } = await createSessionClient();
    
    const event = await db.updateDocument<Event>(
      DATABASE_ID,
      'events',
      eventId,
      eventData as Event
    );
    
    revalidatePath('/events');
    revalidatePath(`/events/${eventId}`);
    return event;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

/**
 * Deletes an event
 * @param eventId The ID of the event to delete
 * @returns True if successful
 */
export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const { db } = await createSessionClient();
    
    await db.deleteDocument(
      DATABASE_ID,
      'events',
      eventId
    );
    
    revalidatePath('/events');
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

// ============================================================
// JOB ACTIONS
// ============================================================

/**
 * Fetches all jobs, with optional filters
 * @param filters Optional array of Query filters
 * @param limit Maximum number of jobs to return
 * @returns Array of jobs
 */
export async function getJobs(filters: string[] = [], limit = 10): Promise<Job[]> {
  try {
    const { db } = await createSessionClient();
    
    const jobs = await db.listDocuments<Job>(
      DATABASE_ID,
      'jobs',
      [
        ...filters,
        Query.orderDesc('postedDate'),
        Query.limit(limit)
      ]
    );
    
    return jobs.documents;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

/**
 * Fetches a job by ID
 * @param jobId The ID of the job to fetch
 * @returns The job or null if not found
 */
export async function getJob(jobId: string): Promise<Job | null> {
  try {
    const { db } = await createSessionClient();
    
    const job = await db.getDocument<Job>(
      DATABASE_ID,
      'jobs',
      jobId
    );
    
    return job;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

/**
 * Creates a new job
 * @param jobData The job data to create
 * @returns The created job
 */
export async function createJob(jobData: Partial<Job>): Promise<Job> {
  try {
    const { db } = await createSessionClient();
    
    const job = await db.createDocument<Job>(
      DATABASE_ID,
      'jobs',
      ID.unique(),
      jobData as Job
    );
    
    revalidatePath('/jobs');
    return job;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

/**
 * Updates a job
 * @param jobId The ID of the job to update
 * @param jobData The updated job data
 * @returns The updated job
 */
export async function updateJob(jobId: string, jobData: Partial<Job>): Promise<Job> {
  try {
    const { db } = await createSessionClient();
    
    const job = await db.updateDocument<Job>(
      DATABASE_ID,
      'jobs',
      jobId,
      jobData as Job
    );
    
    revalidatePath('/jobs');
    revalidatePath(`/jobs/${jobId}`);
    return job;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

/**
 * Deletes a job
 * @param jobId The ID of the job to delete
 * @returns True if successful
 */
export async function deleteJob(jobId: string): Promise<boolean> {
  try {
    const { db } = await createSessionClient();
    
    await db.deleteDocument(
      DATABASE_ID,
      'jobs',
      jobId
    );
    
    revalidatePath('/jobs');
    return true;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
}


/**
 * Creates or updates a mentor profile
 * @param mentorData The mentor data to create or update
 * @returns The created or updated mentor
 */
export async function upsertMentorProfile(mentorData: Partial<Mentor>): Promise<Mentor> {
  try {
    const { account, db } = await createSessionClient();
    
    // Get the current user
    const user = await account.get();
    
    // Check if mentor profile exists
    const mentors = await db.listDocuments<Mentor>(
      DATABASE_ID,
      'mentors',
      [Query.equal('userId', user.$id)]
    );
    
    // Include the userId in the mentor data
    const data = {
      ...mentorData,
      userId: user.$id
    } as Mentor;
    
    let mentor;
    
    if (mentors.documents.length === 0) {
      // Create new mentor profile
      mentor = await db.createDocument<Mentor>(
        DATABASE_ID,
        'mentors',
        ID.unique(),
        data
      );
    } else {
      // Update existing mentor profile
      mentor = await db.updateDocument<Mentor>(
        DATABASE_ID,
        'mentors',
        mentors.documents[0].$id,
        data
      );
    }
    
    revalidatePath('/mentors');
    return mentor;
  } catch (error) {
    console.error('Error upserting mentor profile:', error);
    throw error;
  }
}

// ============================================================
// MESSAGING ACTIONS
// ============================================================

/**
 * Fetches all conversations for the current user
 * @returns Array of enriched conversations with participant details
 */
export async function getUserConversations(): Promise<EnrichedConversation[]> {
  try {
    const { account, db } = await createSessionClient();
    
    // Get the current user
    const user = await account.get();
    
    // Query for conversations where the user is a participant
    const conversations = await db.listDocuments<Conversation>(
      DATABASE_ID,
      'conversations',
      [
        Query.search('participants', user.$id),
        Query.orderDesc('$updatedAt')
      ]
    );
    
    // Enriched conversations with participant details
    const enrichedConversations = await Promise.all(
      conversations.documents.map(async (conversation) => {
        // Get the other participants (excluding current user)
        const otherParticipantIds = conversation.participants.filter(id => id !== user.$id);
        
        // Get participant profiles
        const participantProfiles = await Promise.all(
          otherParticipantIds.map(async (participantId) => {
            const profile = await getUserProfile(participantId);
            return profile;
          })
        );
        
        // Get the last message
        let lastMessage = null;
        if (conversation.lastMessageId) {
          try {
            lastMessage = await db.getDocument<Message>(
              DATABASE_ID,
              'messages',
              conversation.lastMessageId
            );
          } catch (error) {
            console.error('Error fetching last message:', error);
          }
        }
        
        return {
          ...conversation,
          participants: participantProfiles.filter(Boolean) as UserProfile[],
          lastMessage
        } as EnrichedConversation;
      })
    );
    
    return enrichedConversations;
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    return [];
  }
}

/**
 * Creates a new conversation or returns an existing one
 * @param participantIds Array of user IDs to include in the conversation
 * @returns The conversation
 */
export async function createOrGetConversation(participantIds: string[]): Promise<Conversation> {
  try {
    const { account, db } = await createSessionClient();
    
    // Get the current user
    const user = await account.get();
    
    // Make sure the current user is included in participants
    const allParticipantSet = new Set([user.$id, ...participantIds]);
    const allParticipants = Array.from(allParticipantSet);
    
    // Check if a conversation already exists with these participants
    const conversations = await db.listDocuments<Conversation>(
      DATABASE_ID,
      'conversations'
    );
    
    // Filter on client side since we need exact match of participants
    const existingConversation = conversations.documents.find(conv => {
      // Check if participants arrays match exactly (ignoring order)
      const convParticipants = new Set(conv.participants);
      const newParticipants = new Set(allParticipants);
      
      if (convParticipants.size !== newParticipants.size) return false;
      
      // Convert Set to Array for iteration to avoid TypeScript error
      return Array.from(newParticipants).every(participant => 
        convParticipants.has(participant)
      );
    });
    
    if (existingConversation) {
      return existingConversation;
    }
    
    // Create a new conversation
    const conversation = await db.createDocument<Conversation>(
      DATABASE_ID,
      'conversations',
      ID.unique(),
      {
        participants: allParticipants,
        unreadCount: 0
      } as Conversation
    );
    
    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

/**
 * Fetches messages for a conversation
 * @param conversationId The ID of the conversation to fetch messages for
 * @param limit Maximum number of messages to return
 * @returns Array of messages
 */
export async function getConversationMessages(conversationId: string, limit = 20): Promise<Message[]> {
  try {
    const { db } = await createSessionClient();
    
    const messages = await db.listDocuments<Message>(
      DATABASE_ID,
      'messages',
      [
        Query.equal('conversationId', conversationId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );
    
    // Mark messages as read if needed
    const { account } = await createSessionClient();
    const user = await account.get();
    
    for (const message of messages.documents) {
      if (!message.read && message.sender !== user.$id) {
        await db.updateDocument<Message>(
          DATABASE_ID,
          'messages',
          message.$id,
          { read: true } as Message
        );
      }
    }
    
    // Update unread count in conversation
    await db.updateDocument<Conversation>(
      DATABASE_ID,
      'conversations',
      conversationId,
      { unreadCount: 0 } as Conversation
    );
    
    return messages.documents.reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    return [];
  }
}

/**
 * Sends a message in a conversation
 * @param conversationId The ID of the conversation to send a message in
 * @param content The message content
 * @returns The created message
 */
export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  try {
    const { account, db } = await createSessionClient();
    
    // Get the current user
    const user = await account.get();
    
    // Create the message
    const message = await db.createDocument<Message>(
      DATABASE_ID,
      'messages',
      ID.unique(),
      {
        content,
        sender: user.$id,
        conversationId,
        read: false
      } as Message
    );
    
    // Update the conversation's last message
    const conversation = await db.getDocument<Conversation>(
      DATABASE_ID,
      'conversations',
      conversationId
    );
    
    // Get other participants
    const otherParticipants = conversation.participants.filter(id => id !== user.$id);
    
    // Update conversation with new last message and increment unread count
    await db.updateDocument<Conversation>(
      DATABASE_ID,
      'conversations',
      conversationId,
      {
        lastMessageId: message.$id,
        unreadCount: conversation.unreadCount + otherParticipants.length
      } as Conversation
    );
    
    revalidatePath(`/messages/${conversationId}`);
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// ============================================================
// RESOURCE ACTIONS
// ============================================================

/**
 * Fetches all resources, with optional filters
 * @param filters Optional array of Query filters
 * @param limit Maximum number of resources to return
 * @returns Array of resources
 */
export async function getResources(filters: string[] = [], limit = 10): Promise<Resource[]> {
  try {
    const { db } = await createSessionClient();
    
    const resources = await db.listDocuments<Resource>(
      DATABASE_ID,
      'resources',
      [
        ...filters,
        Query.orderDesc('publishedDate'),
        Query.limit(limit)
      ]
    );
    
    return resources.documents;
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

/**
 * Fetches a resource by ID
 * @param resourceId The ID of the resource to fetch
 * @returns The resource or null if not found
 */
export async function getResource(resourceId: string): Promise<Resource | null> {
  try {
    const { db } = await createSessionClient();
    
    const resource = await db.getDocument<Resource>(
      DATABASE_ID,
      'resources',
      resourceId
    );
    
    return resource;
  } catch (error) {
    console.error('Error fetching resource:', error);
    return null;
  }
}

/**
 * Creates a new resource
 * @param resourceData The resource data to create
 * @returns The created resource
 */
export async function createResource(resourceData: Partial<Resource>): Promise<Resource> {
  try {
    const { db } = await createSessionClient();
    
    const resource = await db.createDocument<Resource>(
      DATABASE_ID,
      'resources',
      ID.unique(),
      resourceData as Resource
    );
    
    revalidatePath('/resources');
    return resource;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
}

/**
 * Updates a resource
 * @param resourceId The ID of the resource to update
 * @param resourceData The updated resource data
 * @returns The updated resource
 */
export async function updateResource(resourceId: string, resourceData: Partial<Resource>): Promise<Resource> {
  try {
    const { db } = await createSessionClient();
    
    const resource = await db.updateDocument<Resource>(
      DATABASE_ID,
      'resources',
      resourceId,
      resourceData as Resource
    );
    
    revalidatePath('/resources');
    revalidatePath(`/resources/${resourceId}`);
    return resource;
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
}

/**
 * Deletes a resource
 * @param resourceId The ID of the resource to delete
 * @returns True if successful
 */
export async function deleteResource(resourceId: string): Promise<boolean> {
  try {
    const { db } = await createSessionClient();
    
    await db.deleteDocument(
      DATABASE_ID,
      'resources',
      resourceId
    );
    
    revalidatePath('/resources');
    return true;
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
}

// ============================================================
// AUTHENTICATION ACTIONS
// ============================================================

/**
 * Logs a user in via email and password
 * @param email User's email
 * @param password User's password
 * @returns The created session
 */
export async function login(email: string, password: string): Promise<Models.Session> {
  try {
    const { account } = await createSessionClient();
    
    // Create an email session
    const session = await account.createSession(email, password);
    
    // Set the session in cookies
    cookies().set('x-biso-session', session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    
    return session;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

/**
 * Registers a new user
 * @param email User's email
 * @param password User's password
 * @param name User's name
 * @returns The created user
 */
export async function register(email: string, password: string, name: string): Promise<Models.User<Models.Preferences>> {
  try {
    const { account } = await createSessionClient();
    
    // Create a new account
    const user = await account.create(ID.unique(), email, password, name);
    
    // Create a session
    const session = await account.createSession(email, password);
    
    // Set the session in cookies
    cookies().set('x-biso-session', session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    
    // Create a user profile
    const { db } = await createSessionClient();
    
    await db.createDocument<UserProfile>(
      DATABASE_ID,
      'userProfiles',
      ID.unique(),
      {
        name,
        email,
        userId: user.$id,
        profileCompletion: 20 // Initial profile completion percentage
      } as UserProfile
    );
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

/**
 * Logs out the current user
 * @returns True if successful
 */
export async function logout(): Promise<boolean> {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession('current');
    cookies().delete('x-biso-session');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

/**
 * Fetches all alumni profiles with optional filters
 * @param searchQuery Optional search query to filter by name, company, etc.
 * @param filters Optional filters for graduation year, department, location, etc.
 * @param sort Optional sort criteria
 * @param limit Maximum number of profiles to return
 * @returns Array of user profiles
 */
export async function getAlumniProfiles(
    searchQuery: string = '',
    filters: {
      graduationYears?: string[],
      departments?: string[],
      locations?: string[],
      industries?: string[]
    } = {},
    sort: string = 'recent',
    limit: number = 100
  ): Promise<UserProfile[]> {
    try {
      const { db } = await createSessionClient();
      
      // Build the query filters
      const queryFilters: string[] = [];
      
      // Add search query if provided
      if (searchQuery) {
        queryFilters.push(
          Query.or([
            Query.search('name', searchQuery),
            Query.search('company', searchQuery),
            Query.search('title', searchQuery),
            Query.search('bio', searchQuery),
            Query.search('department', searchQuery),
            Query.search('location', searchQuery)
          ])
        );
      }
      
      // Add graduation year filter if provided
      if (filters.graduationYears && filters.graduationYears.length > 0) {
        queryFilters.push(Query.equal('graduationYear', filters.graduationYears[0]));
      }
      
      // Add department filter if provided
      if (filters.departments && filters.departments.length > 0) {
        queryFilters.push(Query.equal('department', filters.departments[0]));
      }
      
      // Add location filter if provided
      if (filters.locations && filters.locations.length > 0) {
        queryFilters.push(Query.equal('location', filters.locations[0]));
      }
      
      // Add industry filter if provided
      // Note: This requires a way to determine industry, could be derived from company or title
      // For now, we'll skip this filter
      
      // Add sorting logic
      let sortQuery: string;
      switch (sort) {
        case 'name-asc':
          sortQuery = Query.orderAsc('name');
          break;
        case 'name-desc':
          sortQuery = Query.orderDesc('name');
          break;
        case 'year-desc':
          sortQuery = Query.orderDesc('graduationYear');
          break;
        case 'year-asc':
          sortQuery = Query.orderAsc('graduationYear');
          break;
        case 'recent':
        default:
          sortQuery = Query.orderDesc('$updatedAt');
          break;
      }
      
      queryFilters.push(sortQuery);
      
      // Add limit to query
      queryFilters.push(Query.limit(limit));
      
      // Execute the query
      const profiles = await db.listDocuments<UserProfile>(
        DATABASE_ID,
        'userProfiles',
        queryFilters
      );
      
      return profiles.documents;
    } catch (error) {
      console.error('Error fetching alumni profiles:', error);
      return [];
    }
  }
  
  /**
   * Gets available filter options by fetching distinct values
   * @returns Object containing lists of available filter options
   */
  export async function getAlumniFilterOptions(): Promise<{
    graduationYears: string[],
    departments: string[],
    locations: string[]
  }> {
    try {
      const { db } = await createSessionClient();
      
      // Get all profiles to extract unique values
      // In a production app, you might want to create a separate collection for filter options
      // or implement a more efficient way to get distinct values
      const profiles = await db.listDocuments<UserProfile>(
        DATABASE_ID,
        'userProfiles',
        [Query.limit(1000)] // Set a reasonable limit
      );
      
      // Extract unique values
      const graduationYears = Array.from(
        new Set(profiles.documents.map(profile => profile.graduationYear).filter(Boolean))
      ).sort((a, b) => Number(b) - Number(a)); // Sort years in descending order
      
      const departments = Array.from(
        new Set(profiles.documents.map(profile => profile.department).filter(Boolean))
      ).sort();
      
      const locations = Array.from(
        new Set(profiles.documents.map(profile => profile.location).filter(Boolean))
      ).sort();
      
      return {
        graduationYears,
        departments,
        locations
      };
    } catch (error) {
      console.error('Error fetching alumni filter options:', error);
      return {
        graduationYears: [],
        departments: [],
        locations: []
      };
    }
  }
  
  /**
   * Get total count of alumni
   * @returns Number of alumni profiles
   */
  export async function getAlumniCount(): Promise<number> {
    try {
      const { db } = await createSessionClient();
      
      // Get total count
      const profiles = await db.listDocuments<UserProfile>(
        DATABASE_ID,
        'userProfiles',
        [Query.limit(1000)] // We just need the count, not the documents
      );
      
      return profiles.total;
    } catch (error) {
      console.error('Error fetching alumni count:', error);
      return 0;
    }
  }


  










  /**
 * Fetches all mentors with optional filters
 * @param filters Optional query filters
 * @param limit Maximum number of mentors to return
 * @returns Array of mentors
 */
export async function getMentors(filters: string[] = [], limit = 100): Promise<Mentor[]> {
  try {
    const { db } = await createSessionClient();
    
    const mentors = await db.listDocuments<Mentor>(
      DATABASE_ID,
      'mentors',
      [
        ...filters,
        Query.orderDesc('featured'),
        Query.limit(limit)
      ]
    );
    
    return mentors.documents;
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return [];
  }
}

/**
 * Fetches a mentor by ID
 * @param mentorId The ID of the mentor to fetch
 * @returns The mentor or null if not found
 */
export async function getMentor(mentorId: string): Promise<Mentor | null> {
  try {
    const { db } = await createSessionClient();
    
    const mentor = await db.getDocument<Mentor>(
      DATABASE_ID,
      'mentors',
      mentorId
    );
    
    return mentor;
  } catch (error) {
    console.error('Error fetching mentor:', error);
    return null;
  }
}

/**
 * Fetches all mentoring programs
 * @param filters Optional query filters
 * @param limit Maximum number of programs to return
 * @returns Array of mentoring programs
 */
export async function getMentoringPrograms(filters: string[] = [], limit = 100): Promise<MentoringProgram[]> {
  try {
    const { db } = await createSessionClient();
    
    const programs = await db.listDocuments<MentoringProgram>(
      DATABASE_ID,
      'mentoringPrograms',
      [
        ...filters,
        Query.orderDesc('featured'),
        Query.orderAsc('applicationDeadline'),
        Query.limit(limit)
      ]
    );
    
    return programs.documents;
  } catch (error) {
    console.error('Error fetching mentoring programs:', error);
    return [];
  }
}

/**
 * Apply to a mentoring program
 * @param programId The ID of the program to apply to
 * @param motivationStatement Optional motivation statement for the application
 * @returns The created application
 */
export async function applyToProgram(programId: string, motivationStatement?: string): Promise<ProgramApplication> {
  try {
    const { account, db } = await createSessionClient();
    
    // Get the current user
    const user = await account.get();
    
    // Create the application
    const application = await db.createDocument<ProgramApplication>(
      DATABASE_ID,
      'programApplications',
      ID.unique(),
      {
        programId,
        userId: user.$id,
        status: 'pending',
        applicationDate: new Date().toISOString(),
        motivationStatement
      } as ProgramApplication
    );
    
    revalidatePath('/alumni/mentoring');
    return application;
  } catch (error) {
    console.error('Error applying to program:', error);
    throw error;
  }
}

/**
 * Apply to become a mentor
 * @param mentorData The mentor profile data
 * @returns The created mentor profile
 */
export async function applyToBeMentor(mentorData: Partial<Mentor>): Promise<Mentor> {
  try {
    const { account, db } = await createSessionClient();
    
    // Get the current user
    const user = await account.get();
    
    // Get the user profile
    const profiles = await db.listDocuments(
      DATABASE_ID,
      'userProfiles',
      [Query.equal('userId', user.$id)]
    );
    
    if (profiles.documents.length === 0) {
      throw new Error("User profile not found");
    }
    
    // Check the auto-accept mentors feature flag
    const autoAcceptMentors = await autoAcceptMentorsFlag();
    
    // Create mentor profile
    const mentor = await db.createDocument<Mentor>(
      DATABASE_ID,
      'mentors',
      ID.unique(),
      {
        ...mentorData,
        userId: user.$id,
        featured: false,
        reviewCount: 0,
        menteeCount: 0,
        status: autoAcceptMentors ? 'approved' : 'pending', // Auto-approve if flag is enabled
        applicationDate: new Date().toISOString()
      } as Mentor
    );
    
    revalidatePath('/alumni/mentoring');
    return mentor;
  } catch (error) {
    console.error('Error applying to be a mentor:', error);
    throw error;
  }
}

// ============================================================
// ACTIVITY ACTIONS
// ============================================================

export interface Activity {
  $id: string;
  userId: string;
  type: 'event_joined' | 'job_posted' | 'mentor_status' | 'resource_shared' | 'network_update';
  description: string;
  timestamp: string;
  relatedId?: string;
  relatedData?: Record<string, any>;
}

/**
 * Fetches user activities
 * @param userId The ID of the user to fetch activities for
 * @param limit Maximum number of activities to return
 * @returns Array of user activities
 */
export async function getUserActivities(userId: string, limit = 10): Promise<Activity[]> {
  try {
    const { db } = await createSessionClient();
    
    // For now, we'll simulate activities from various collections
    // In a production app, you'd create a dedicated activities collection
    
    // Get events the user has joined
    const events = await db.listDocuments(
      DATABASE_ID,
      'events',
      [
        Query.search('participantIds', userId),
        Query.orderDesc('date'),
        Query.limit(5)
      ]
    );
    
    // Get jobs the user has posted
    const jobs = await db.listDocuments(
      DATABASE_ID,
      'jobs',
      [
        Query.equal('postedBy', userId),
        Query.orderDesc('postedDate'),
        Query.limit(3)
      ]
    );
    
    // Check if the user is a mentor
    const mentors = await db.listDocuments(
      DATABASE_ID,
      'mentors',
      [
        Query.equal('userId', userId),
        Query.limit(1)
      ]
    );
    
    // Convert these to activities
    const activities: Activity[] = [];
    
    // Add event activities
    events.documents.forEach(event => {
      activities.push({
        $id: `event_${event.$id}`,
        userId,
        type: 'event_joined',
        description: `Joined event: ${event.title}`,
        timestamp: event.$createdAt,
        relatedId: event.$id,
        relatedData: {
          eventTitle: event.title,
          eventDate: event.date
        }
      });
    });
    
    // Add job posting activities
    jobs.documents.forEach(job => {
      activities.push({
        $id: `job_${job.$id}`,
        userId,
        type: 'job_posted',
        description: `Posted job: ${job.title} at ${job.company}`,
        timestamp: job.postedDate || job.$createdAt,
        relatedId: job.$id,
        relatedData: {
          jobTitle: job.title,
          company: job.company
        }
      });
    });
    
    // Add mentor status activity if applicable
    if (mentors.documents.length > 0) {
      activities.push({
        $id: `mentor_${mentors.documents[0].$id}`,
        userId,
        type: 'mentor_status',
        description: 'Joined Alumni Mentoring Program',
        timestamp: mentors.documents[0].$createdAt,
        relatedId: mentors.documents[0].$id
      });
    }
    
    // Sort activities by timestamp and limit
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
}

/**
 * Fetches upcoming events for a user
 * @param userId The ID of the user to fetch events for
 * @param limit Maximum number of events to return
 * @returns Array of upcoming events
 */
export async function getUserUpcomingEvents(userId: string, limit = 5): Promise<Event[]> {
  try {
    const { db } = await createSessionClient();
    const now = new Date().toISOString();
    
    // Get upcoming events
    // Filtering by participantIds only works if your events schema includes this field
    const events = await db.listDocuments<Event>(
      DATABASE_ID,
      'events',
      [
        // If your events don't track participants, you might need to remove this filter
        // Query.search('participantIds', userId),
        Query.greaterThan('date', now),
        Query.orderAsc('date'),
        Query.limit(limit)
      ]
    );
    
    return events.documents;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

// ============================================================
// FEATURE FLAGS ACTION
// ============================================================

/**
 * Gets all feature flags for the alumni portal
 * @returns Object containing all feature flags
 */
export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  // Add the no-cache option to prevent caching
  const { cache } = { cache: 'no-store' };
  
  try {
    // Evaluate all feature flags
    const [network, events, mentoring, jobs, resources, messages, admin, autoAcceptMentors] = await Promise.all([
      networksFeatureFlag(),
      eventsFeatureFlag(),
      mentoringFeatureFlag(),
      jobsFeatureFlag(),
      resourcesFeatureFlag(),
      messagesFeatureFlag(),
      adminFeatureFlag(),
      autoAcceptMentorsFlag()
    ]);

    // Return all feature flags
    return {
      'alumni-network': network,
      'alumni-events': events,
      'alumni-mentoring': mentoring,
      'alumni-jobs': jobs,
      'alumni-resources': resources,
      'alumni-messages': messages,
      'alumni-admin': admin,
      'alumni-auto-accept-mentors': autoAcceptMentors
    };
  } catch (error) {
    console.error('Error evaluating feature flags:', error);
    
    // In case of error, return a default set of feature flags (all enabled)
    return {
      'alumni-network': true,
      'alumni-events': true,
      'alumni-mentoring': true,
      'alumni-jobs': true,
      'alumni-resources': true,
      'alumni-messages': true,
      'alumni-admin': false, // Default to false for admin flag
      'alumni-auto-accept-mentors': false // Default to false for auto-accept mentors flag
    };
  }
}

/**
 * Check if auto-accept mentors feature is enabled
 * @returns Boolean indicating if auto-accept mentors is enabled
 */
export async function isAutoAcceptMentorsEnabled(): Promise<boolean> {
  try {
    const isEnabled = await autoAcceptMentorsFlag();
    return isEnabled;
  } catch (error) {
    console.error('Error checking auto-accept mentors flag:', error);
    return false;
  }
}

/**
 * Fetches all pending mentor applications
 * @returns Array of mentors with pending status
 */
export async function getPendingMentorApplications(): Promise<Mentor[]> {
  try {
    const { db } = await createSessionClient();
    
    const pendingMentors = await db.listDocuments<Mentor>(
      DATABASE_ID,
      'mentors',
      [
        Query.equal('status', 'pending'),
        Query.orderDesc('applicationDate'),
      ]
    );
    
    return pendingMentors.documents;
  } catch (error) {
    console.error('Error fetching pending mentor applications:', error);
    return [];
  }
}

/**
 * Updates a mentor's application status
 * @param mentorId The ID of the mentor to update
 * @param status The new status (approved or rejected)
 * @returns The updated mentor
 */
export async function updateMentorStatus(mentorId: string, status: 'approved' | 'rejected'): Promise<Mentor> {
  try {
    const { db } = await createSessionClient();
    
    // Update the mentor status
    const mentor = await db.updateDocument<Mentor>(
      DATABASE_ID,
      'mentors',
      mentorId,
      { status } as Partial<Mentor>
    );
    
    revalidatePath('/admin/alumni/mentors');
    revalidatePath('/alumni/mentoring');
    return mentor;
  } catch (error) {
    console.error('Error updating mentor status:', error);
    throw error;
  }
}

/**
 * Updates the auto-accept mentors feature flag
 * @param enabled Whether to enable or disable auto-accepting of mentors
 * @returns boolean indicating success
 */
export async function updateAutoAcceptMentorsFlag(enabled: boolean): Promise<boolean> {
  try {
    const { db } = await createSessionClient();
    
    // Find the feature flag document
    const flags = await db.listDocuments(
      'app',
      'feature_flags',
      [Query.equal('key', 'alumni-auto-accept-mentors')]
    );
    
    if (flags.documents.length > 0) {
      // Update existing flag
      await db.updateDocument(
        'app',
        'feature_flags',
        flags.documents[0].$id,
        { enabled }
      );
    } else {
      // Create new flag
      await db.createDocument(
        'app',
        'feature_flags',
        ID.unique(),
        { 
          key: 'alumni-auto-accept-mentors', 
          enabled,
          description: 'Automatically approve mentor applications'
        }
      );
    }
    
    revalidatePath('/admin/alumni/mentors');
    return true;
  } catch (error) {
    console.error('Error updating auto-accept mentors flag:', error);
    return false;
  }
}

// ============================================================
// TESTIMONIAL ACTIONS
// ============================================================

/**
 * Fetches all testimonials, with optional filters
 * @param filters Optional array of Query filters
 * @param limit Maximum number of testimonials to return
 * @returns Array of testimonials
 */
export async function getTestimonials(filters: string[] = [], limit = 3): Promise<Testimonial[]> {
  try {
    const { db } = await createSessionClient();
    
    const testimonials = await db.listDocuments<Testimonial>(
      DATABASE_ID,
      'testimonials',
      [
        ...filters,
        Query.equal('featured', true),
        Query.limit(limit)
      ]
    );
    
    return testimonials.documents;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Fetches all mentorships with optional filters
 * @param filters Optional array of Query filters
 * @param limit Maximum number of mentorships to return
 * @returns Array of mentorships
 */
export async function getMentorships(filters: string[] = [], limit = 100): Promise<Mentorship[]> {
  try {
    const { db } = await createSessionClient();
    
    const mentorships = await db.listDocuments<Mentorship>(
      DATABASE_ID,
      'mentorships',
      [
        ...filters,
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );
    
    return mentorships.documents;
  } catch (error) {
    console.error('Error fetching mentorships:', error);
    return [];
  }
}

/**
 * Represents a statistic record stored in the database
 */
export interface StatRecord extends Models.Document {
  type: 'alumni' | 'events' | 'mentorships' | 'jobs';
  count: number;
  date: string;
  period: 'daily' | 'monthly';
  monthYear?: string; // Only present for monthly records
}

/**
 * Fetches stats from the alumniStats collection
 * @param type Type of stat to fetch (alumni, events, mentorships, jobs)
 * @param period Period of stats to fetch (daily, monthly)
 * @param limit Maximum number of stats to return
 * @returns Array of stat records
 */
export async function getStats(
  type: 'alumni' | 'events' | 'mentorships' | 'jobs', 
  period: 'daily' | 'monthly' = 'daily',
  limit: number = 60
) {
  try {
    const { db } = await createSessionClient();
    
    // Make sure DATABASE_ID is defined
    if (!DATABASE_ID) {
      throw new Error("DATABASE_ID is not defined");
    }
    
    const stats = await db.listDocuments(
      DATABASE_ID,
      'alumniStats',
      [
        Query.equal('type', type),
        Query.equal('period', period),
        Query.orderDesc('date'),
        Query.limit(limit)
      ]
    );
    console.log("stats.documents", stats.documents);
    return stats.documents.map(doc => ({
      ...doc,
      count: typeof doc.count === 'number' ? doc.count : parseInt(doc.count) || 0
    }));
  } catch (error) {
    console.error(`Error fetching ${type} ${period} stats:`, error);
    return [];
  }
}