// /src/api/leadService.js
import api from './axiosConfig';

// ==============================================
// LEAD SERVICE - Complete API Integration
// ==============================================

/**
 * Create a lead manually (requires authentication)
 * @param {Object} leadData - Lead information
 * @returns {Promise<Object>} Created lead data
 */
export const createLead = async (leadData) => {
  try {
    console.log('Creating lead with data:', leadData);
    
    // Validate required fields
    if (!leadData.customerName || !leadData.mobileNumber || !leadData.panCard || !leadData.aadharNumber) {
      throw new Error('Please fill in all required fields');
    }

    // Format the data according to backend expectations
    const formattedData = {
      customerName: leadData.customerName.trim(),
      mobileNumber: leadData.mobileNumber.trim(),
      panCard: leadData.panCard.toUpperCase().trim(),
      aadharNumber: leadData.aadharNumber.trim(),
      preferredBank: leadData.preferredBank?.trim() || '',
      employmentType: leadData.employmentType || '',
      monthlySalary: leadData.monthlySalary ? Number(leadData.monthlySalary) : undefined,
    };

    const response = await api.post('/leads', formattedData);
    
    console.log('Lead created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create lead error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 409) {
      // Duplicate lead error
      throw new Error(error.response.data.message || 'A lead with this PAN or Aadhar already exists for this month.');
    } else if (error.response?.status === 400) {
      // Validation error
      throw new Error(error.response.data.message || 'Invalid lead data provided.');
    } else if (error.response?.status === 401) {
      // Authentication error
      throw new Error('You are not authorized to create leads. Please login again.');
    } else if (error.response?.status === 403) {
      // Authorization error
      throw new Error('You do not have permission to create leads.');
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Create a lead from shared link (public endpoint)
 * @param {string} userId - User ID from the share link
 * @param {Object} leadData - Lead information
 * @returns {Promise<Object>} Created lead data
 */
export const createLeadFromLink = async (userId, leadData) => {
  try {
    console.log('Creating lead from shared link for user:', userId, 'with data:', leadData);
    
    // Validate userId
    if (!userId || userId.trim().length < 3) {
      throw new Error('Invalid user ID in share link');
    }

    // Validate required fields
    if (!leadData.customerName || !leadData.mobileNumber || !leadData.panCard || !leadData.aadharNumber) {
      throw new Error('Please fill in all required fields');
    }

    // Format the data according to backend expectations
    const formattedData = {
      customerName: leadData.customerName.trim(),
      mobileNumber: leadData.mobileNumber.trim(),
      panCard: leadData.panCard.toUpperCase().trim(),
      aadharNumber: leadData.aadharNumber.trim(),
      preferredBank: leadData.preferredBank?.trim() || '',
      employmentType: leadData.employmentType || '',
      monthlySalary: leadData.monthlySalary ? Number(leadData.monthlySalary) : undefined,
    };

    const response = await api.post(`/leads/link/${userId.trim()}`, formattedData);
    
    console.log('Lead created from shared link successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create lead from link error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      // Invalid user ID
      throw new Error('Invalid referral link. Please contact the administrator for a new link.');
    } else if (error.response?.status === 409) {
      // Duplicate lead error
      throw new Error(error.response.data.message || 'A lead with this PAN or Aadhar already exists for this month.');
    } else if (error.response?.status === 400) {
      // Validation error
      throw new Error(error.response.data.message || 'Invalid lead data provided.');
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Get all leads (role-based filtering handled by backend)
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise<Object>} Leads data with pagination info
 */
export const getAllLeads = async (params = {}) => {
  try {
    console.log('Fetching leads with params:', params);
    
    const response = await api.get('/leads', { params });
    
    console.log('Leads fetched successfully:', response.data);
    return response.data; // Returns { success: true, count: number, data: Lead[] }
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    
    if (error.response?.status === 401) {
      throw new Error('You are not authorized to view leads. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to view leads.');
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Get a single lead by ID
 * @param {string} leadId - Lead ID
 * @returns {Promise<Object>} Lead data
 */
export const getLeadById = async (leadId) => {
  try {
    if (!leadId) {
      throw new Error('Lead ID is required');
    }
    
    console.log('Fetching lead with ID:', leadId);
    
    const response = await api.get(`/leads/${leadId}`);
    
    console.log('Lead fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch lead:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Lead not found');
    } else if (error.response?.status === 401) {
      throw new Error('You are not authorized to view this lead. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to view this lead.');
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Update a lead
 * @param {string} leadId - Lead ID
 * @param {Object} leadData - Updated lead data
 * @returns {Promise<Object>} Updated lead data
 */
export const updateLead = async (leadId, leadData) => {
  try {
    if (!leadId) {
      throw new Error('Lead ID is required');
    }
    
    console.log('Updating lead with ID:', leadId, 'with data:', leadData);
    
    // Format the data
    const formattedData = {
      ...leadData,
      panCard: leadData.panCard ? leadData.panCard.toUpperCase().trim() : undefined,
      customerName: leadData.customerName ? leadData.customerName.trim() : undefined,
      mobileNumber: leadData.mobileNumber ? leadData.mobileNumber.trim() : undefined,
      aadharNumber: leadData.aadharNumber ? leadData.aadharNumber.trim() : undefined,
      monthlySalary: leadData.monthlySalary ? Number(leadData.monthlySalary) : undefined,
    };

    const response = await api.put(`/leads/${leadId}`, formattedData);
    
    console.log('Lead updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update lead:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Lead not found');
    } else if (error.response?.status === 401) {
      throw new Error('You are not authorized to update leads. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to update this lead.');
    } else if (error.response?.status === 409) {
      throw new Error(error.response.data.message || 'A lead with this PAN or Aadhar already exists.');
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Delete a lead
 * @param {string} leadId - Lead ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteLead = async (leadId) => {
  try {
    if (!leadId) {
      throw new Error('Lead ID is required');
    }
    
    console.log('Deleting lead with ID:', leadId);
    
    const response = await api.delete(`/leads/${leadId}`);
    
    console.log('Lead deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to delete lead:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Lead not found');
    } else if (error.response?.status === 401) {
      throw new Error('You are not authorized to delete leads. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to delete this lead.');
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Bulk import leads from CSV
 * @param {FormData} csvData - CSV file data
 * @returns {Promise<Object>} Import results
 */
export const bulkImportLeads = async (csvData) => {
  try {
    console.log('Importing leads from CSV');
    
    const response = await api.post('/leads/bulk-import', csvData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Leads imported successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to import leads:', error);
    
    if (error.response?.status === 401) {
      throw new Error('You are not authorized to import leads. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to import leads.');
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Get lead statistics
 * @returns {Promise<Object>} Lead statistics
 */
export const getLeadStats = async () => {
  try {
    console.log('Fetching lead statistics');
    
    const response = await api.get('/leads/stats');
    
    console.log('Lead statistics fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch lead statistics:', error);
    
    if (error.response?.status === 401) {
      throw new Error('You are not authorized to view lead statistics. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to view lead statistics.');
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Search leads
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Object>} Search results
 */
export const searchLeads = async (searchParams) => {
  try {
    console.log('Searching leads with params:', searchParams);
    
    const response = await api.get('/leads/search', { params: searchParams });
    
    console.log('Lead search completed successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to search leads:', error);
    
    if (error.response?.status === 401) {
      throw new Error('You are not authorized to search leads. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to search leads.');
    }
    
    throw error.response?.data || error;
  }
};

/**
 * Update lead status
 * @param {string} leadId - Lead ID
 * @param {string} status - New status
 * @param {Object} additionalData - Additional data (rejection reason, notes, etc.)
 * @returns {Promise<Object>} Updated lead data
 */
export const updateLeadStatus = async (leadId, status, additionalData = {}) => {
  try {
    if (!leadId || !status) {
      throw new Error('Lead ID and status are required');
    }
    
    console.log('Updating lead status:', leadId, 'to', status);
    
    const updateData = {
      status,
      ...additionalData
    };
    
    const response = await api.patch(`/leads/${leadId}/status`, updateData);
    
    console.log('Lead status updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update lead status:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Lead not found');
    } else if (error.response?.status === 401) {
      throw new Error('You are not authorized to update lead status. Please login again.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to update this lead status.');
    }
    
    throw error.response?.data || error;
  }
};

// ==============================================
// BACKWARD COMPATIBILITY - Default Export
// ==============================================
const leadService = {
  createLead,
  createLeadFromLink,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  bulkImportLeads,
  getLeadStats,
  searchLeads,
  updateLeadStatus,
};

export default leadService;