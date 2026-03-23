import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/applications';

export interface ApplicationSubmission {
  application_id: number;
  program_type: string;
  status: string;
  rejection_reason: string | null;
  applied_at: string;
  updated_at: string;
}

export interface ApplicationStatusResponse {
  summary: Record<string, string | null>;
  submissions: ApplicationSubmission[];
}

export const applicationStatusAPI = {
  getStatus: async (userId: number | string, token: string) => {
    const response = await axios.get<ApplicationStatusResponse>(`${API_URL}/status`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { userId }
    });

    return response.data;
  }
};

export default applicationStatusAPI;
