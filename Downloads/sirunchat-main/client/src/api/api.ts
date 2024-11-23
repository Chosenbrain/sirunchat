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

// Use the environment variable or fallback to the production API URL
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://sirunchat-ee181a3e1508.herokuapp.com';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem('currentUser');

    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers!['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No token found. Proceeding without Authorization header.');
    }

    return config;
  },
  (err) => Promise.reject(err)
);

const logOut = () => {
  localStorage.clear();
  window.location.pathname = '/login';
};

const checkForAuthorization = (error: any) => {
  const responseCode = error?.response?.status;
  if (responseCode === 401) logOut();
};

// Auth APIs
export const login = async ({ email, password }: LoginArgs) => {
  try {
    const res = await api.post<AuthResponse>('/api/auth/login', { email, password });
    return res.data;
  } catch (err: any) {
    return { error: true, message: err.response?.data || 'Login failed' };
  }
};

export const register = async ({ email, password, username }: RegisterArgs) => {
  try {
    const res = await api.post<AuthResponse>('/api/auth/register', { email, password, username });
    return res.data;
  } catch (err: any) {
    return { error: true, message: err.response?.data || 'Registration failed' };
  }
};

export const getMe = async () => {
  try {
    const res = await api.get<GetMeResponse>('/api/auth/me');
    return { me: res.data.me, statusCode: 200 };
  } catch (err: any) {
    console.error(err);
    return { error: true, statusCode: err?.response?.status };
  }
};

// Friend Invitation APIs
export const inviteFriendRequest = async ({ email }: InviteFriendArgs) => {
  try {
    const res = await api.post('/api/invite-friend/invite', { email });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data };
  }
};

export const acceptFriendRequest = async (invitationId: string) => {
  try {
    const res = await api.post('/api/invite-friend/accept', { invitationId });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data || 'Failed to accept friend request' };
  }
};

export const rejectFriendRequest = async (invitationId: string) => {
  try {
    const res = await api.post('/api/invite-friend/reject', { invitationId });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data || 'Failed to reject friend request' };
  }
};

// Group Chat APIs
export const createGroupChat = async (name: string) => {
  try {
    const res = await api.post('/api/group-chat', { name });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data || 'Failed to create group chat' };
  }
};

export const addMembersToGroup = async (data: AddMembersToGroupArgs) => {
  try {
    const res = await api.post('/api/group-chat/add', {
      friendIds: data.friendIds,
      groupChatId: data.groupChatId,
    });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data || 'Failed to add members to group' };
  }
};

export const leaveGroup = async (data: LeaveGroupArgs) => {
  try {
    const res = await api.post('/api/group-chat/leave', { groupChatId: data.groupChatId });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data || 'Failed to leave group' };
  }
};

export const deleteGroup = async (data: DeleteGroupArgs) => {
  try {
    const res = await api.post('/api/group-chat/delete', { groupChatId: data.groupChatId });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data || 'Failed to delete group' };
  }
};

// Friend Management APIs
export const removeFriend = async (data: RemoveFriendArgs) => {
  try {
    const res = await api.post('/api/invite-friend/remove', { friendId: data.friendId });
    return res.data;
  } catch (err: any) {
    checkForAuthorization(err);
    return { error: true, message: err.response?.data || 'Failed to remove friend' };
  }
};

// Push Notifications APIs
export const saveUserSubscription = async (subscription: PushSubscription) => {
  try {
    return await api.post('/api/auth/subscribe', subscription);
  } catch (err: any) {
    return { error: true, message: 'Failed to save subscription' };
  }
};

export const removeUserSubscription = async (subscription: PushSubscription) => {
  try {
    return await api.post('/api/auth/unsubscribe', subscription);
  } catch (err: any) {
    return { error: true, message: 'Failed to remove subscription' };
  }
};
