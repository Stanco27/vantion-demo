import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface ProgramMatch {
  id: number;
  name: string;
  university: string;
  focus: string;
  location: string;
  desc: string;
  aiReasoning: string;
}

export const fetchProgramMatches = async (interests: string[]): Promise<ProgramMatch[]> => {
  try {
    const profileString = `Student interests: ${interests.join(", ")}`;
    
    const response = await axios.post(`${API_BASE_URL}/match`, { 
      userProfile: profileString 
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch matches. Is the server running?");
  }
};

export const fetchFollowUp = async (programName: string, interests: string[]): Promise<string> => {
  const response = await axios.post('http://localhost:3001/api/followup', {
    programName,
    interests
  });
  return response.data.answer;
};