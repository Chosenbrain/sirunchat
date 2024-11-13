import axios from 'axios';
import {
  LoginArgs,
  AuthResponse,
  RegisterArgs,
  InviteFriendArgs,
  GetMeResponse,
  AddMembersToGroupArgs,
  LeaveGroupArgs,
  RemoveFriendArgs,
  DeleteGroupArgs,
} from './types';

// Use the production URL in Heroku or fall back to localhost for local development
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to add Authorization header to requests if token is present
api.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem('currentUser');
    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      if (token) {
        config.headers!['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Function to log out and redirect to the login page
const logOut = () => {
  localStorage.clear();
  window.location.pathname = '/login';
};

// Function to check for authorization errors and log out if 401 status is received
const checkForAuthorization = (error: any) => {
  const responseCode = error?.response?.status;
  if (responseCode === 401) {
    logOut();
  }
};

// Login function
export const login = async ({ email, password }: LoginArgs) => {
  try {
    const res = await api.post<AuthResponse>('/api/auth/login', { email, password });
    return res.data;
  } catch (err: any) {
    return { error: true, message: err.response?.data };
  }
};

// Registration function
export const register = async ({ email, password, username }: RegisterArgs) => {
  try {
    const res = await api.post<AuthResponse>('/api/auth/register', { email, password, username });
    return res.data;
  } catch (err: any) {
    return { error: true, message: err.response?.data };
  }
};

// Protected route to get current user details
export const getMe = async () => {
  try {
    const res = await api.get<GetMeResponse>('/api/auth/me');
    return { me: res.data.me, statusCode: 200 };
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, statusCode: err?.response?.status };
  }
};

// Invite friend request function
export const inviteFriendRequest = async ({ email }: InviteFriendArgs) => {
  try {
    const res = await api.post('/api/invite-friend/invite', { email });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data };
  }
};

// Reject friend request function
export const rejectFriendRequest = async (invitationId: string) => {
  try {
    const res = await api.post('/api/invite-friend/reject', { invitationId });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data };
  }
};

// Accept friend request function
export const acceptFriendRequest = async (invitationId: string) => {
  try {
    const res = await api.post('/api/invite-friend/accept', { invitationId });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data };
  }
};

// Create group chat function
export const createGroupChat = async (name: string) => {
  try {
    const res = await api.post('/api/group-chat', { name });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data };
  }
};

// Add members to group function
export const addMembersToGroup = async (data: AddMembersToGroupArgs) => {
  try {
    const res = await api.post('/api/group-chat/add', {
      friendIds: data.friendIds,
      groupChatId: data.groupChatId,
    });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data };
  }
};

// Leave group function
export const leaveGroup = async (data: LeaveGroupArgs) => {
  try {
    const res = await api.post('/api/group-chat/leave', {
      groupChatId: data.groupChatId,
    });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data };
  }
};

// Remove friend function
export const removeFriend = async (data: RemoveFriendArgs) => {
  try {
    const res = await api.post('/api/invite-friend/remove', {
      friendId: data.friendId,
    });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data };
  }
};

// Delete group function
export const deleteGroup = async (data: DeleteGroupArgs) => {
  try {
    const res = await api.post('/api/group-chat/delete', {
      groupChatId: data.groupChatId,
    });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data };
  }
};

// Save user subscription function for notifications
export const saveUserSubscription = async (subscription: PushSubscription) => {
  return api.post('/api/auth/subscribe', subscription);
};

// Remove user subscription function for notifications
export const removeUserSubscription = (subscription: PushSubscription) => {
  return api.post('/api/auth/unsubscribe', subscription);
};

export default api;
