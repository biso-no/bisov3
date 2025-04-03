import { clientFunctions } from "@/lib/appwrite-client";

export type SearchIndex = 
  | "certifications"
  | "education" 
  | "events" 
  | "experiences" 
  | "jobs" 
  | "mentors" 
  | "resources" 
  | "users";

export type SearchResult = {
  id: string;
  index: SearchIndex;
  name?: string;
  title?: string;
  type?: string;
  description?: string;
  date?: string;
  company?: string;
  department?: string;
  year?: string;
  href?: string;
  [key: string]: any;
};

export type SearchResults = {
  success: boolean;
  results?: {
    results: Record<string, {
      hits: any[];
      query: string;
      processingTimeMs: number;
      estimatedTotalHits: number;
    }>;
  };
  error?: string;
  fallback?: boolean;
  requestId?: string;
};

export type SearchOptions = {
  query: string;
  indices?: SearchIndex[];
  limit?: number;
  offset?: number;
};

/**
 * Search across multiple indices using the Appwrite search function
 */
export const search = async (options: SearchOptions): Promise<SearchResult[]> => {
  try {
    const { query, indices = ["users", "events", "jobs", "resources"], limit = 10, offset = 0 } = options;
    
    if (!query) {
      return [];
    }
    
    console.log('Search query:', query);
    console.log('Search indices:', indices);
    
    const response = await clientFunctions.createExecution(
      "appwrite_search",
      JSON.stringify({
        query,
        indices,
        limit,
        offset
      }),
      false
    );
    
    // Log the raw response for debugging
    console.log('Search response:', response.responseBody);
    
    const results = JSON.parse(response.responseBody) as SearchResults;
    
    if (!results.success || !results.results?.results) {
      console.error("Search failed:", results.error || "Unknown error");
      return [];
    }
    
    // Debug log the result structure
    console.log('Search results structure:', Object.keys(results.results.results));
    
    // Transform results into a flat array of search results
    const flatResults: SearchResult[] = [];
    
    Object.entries(results.results.results).forEach(([indexName, indexResults]) => {
      // Debug the index name we're processing
      console.log(`Processing index: ${indexName}`);
      
      if (indexResults.hits && Array.isArray(indexResults.hits)) {
        indexResults.hits.forEach(hit => {
          // Debug log for user records to see the structure
          if (indexName === 'users' || indexName === '0') {  // Check for both users and 0 index
            console.log('User search hit:', hit);
            // Force the index to be "users" regardless of the actual index name
            const userResult: SearchResult = {
              id: hit.$id || hit.id || hit._id || "",
              index: "users" as SearchIndex,  // Force the index to be "users"
              name: hit.name || `${hit.firstName || ''} ${hit.lastName || ''}`.trim() || "User",
              ...hit,
              href: `/alumni/profile/${hit.$id || hit.id || hit._id || ""}`
            };
            flatResults.push(userResult);
            return; // Skip the regular processing for user records
          }
          
          // For non-user records, process normally
          // Build a standardized result object from the Appwrite document
          const result: SearchResult = {
            id: hit.$id || hit.id || hit._id || "",
            // Try to convert numeric indices to string indices if possible
            index: mapIndexName(indexName) as SearchIndex,
            // Extract common title or name fields
            name: hit.name || hit.title || hit.institution || hit.company || hit.organization || undefined,
            title: hit.title || hit.degree || hit.name || undefined,
            type: hit.type || undefined,
            description: hit.description || hit.summary || hit.bio || undefined, 
            date: hit.date || hit.startDate || hit.endDate || undefined,
            company: hit.company || hit.organization || hit.institution || undefined,
            department: hit.department || hit.field || hit.major || undefined,
            year: hit.year || hit.startYear || hit.endYear || hit.graduationYear || undefined,
            // Include all original properties
            ...hit,
            // Generate a proper href based on the index type
            href: generateHref(mapIndexName(indexName) as SearchIndex, hit)
          };
          
          flatResults.push(result);
        });
      }
    });
    
    return flatResults;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

// Helper function to generate appropriate hrefs based on the index type
function generateHref(index: SearchIndex, hit: any): string {
  // Extract the ID from the Appwrite document
  // Appwrite uses $id as the document ID field
  const documentId = hit.$id || hit.id || hit._id || "";
  
  // Handle different routing based on document type
  switch (index) {
    case "users":
      // The problem seems to be that the index is showing up as the path segment
      // Force the path to be /alumni/profile/ followed by the user ID
      return `/alumni/profile/${documentId}`;
      
    case "events":
      return `/alumni/events/${documentId}`;
      
    case "jobs":
      return `/alumni/jobs/${documentId}`;
      
    case "resources":
      return `/alumni/resources/${documentId}`;
      
    case "mentors":
      return `/alumni/mentorship/${documentId}`;
      
    case "experiences":
      // For experiences, link to the user profile with a section anchor
      return `/alumni/network/${hit.userId || ""}#experience-${documentId}`;
      
    case "education":
      // For education, link to the user profile with a section anchor 
      return `/alumni/network/${hit.userId || ""}#education-${documentId}`;
      
    case "certifications":
      // For certifications, link to the user profile with a section anchor
      return `/alumni/network/${hit.userId || ""}#certification-${documentId}`;
      
    default:
      return `/alumni/${index}/${documentId}`;
  }
}

// Map numeric index names to string index names
function mapIndexName(indexName: string): string {
  // Map of numeric indices to string indices
  const indexMap: Record<string, string> = {
    '0': 'users',
    '1': 'events',
    '2': 'jobs',
    '3': 'resources',
    '4': 'mentors',
    '5': 'experiences',
    '6': 'education',
    '7': 'certifications'
  };
  
  // If we have a mapping, use it, otherwise use the original name
  return indexMap[indexName] || indexName;
} 