import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchAPI(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}

// --- Auth ---

export async function login(email: string, password: string) {
  const res = await fetchAPI("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

export async function register(name: string, email: string, password: string) {
  const res = await fetchAPI("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

// --- Profile ---

export async function getProfile() {
  const res = await fetchAPI("/api/profile/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
  return data;
}

export async function updateProfile(data: Record<string, string>) {
  const res = await fetchAPI("/api/profile/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update profile");
  return result;
}

export async function searchUsers(query: string) {
  const res = await fetchAPI(`/api/profile/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to search users");
  return data;
}

export async function getUserProfile(userId: string) {
  const res = await fetchAPI(`/api/profile/${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch user profile");
  return data;
}

// --- Skills ---

export async function addSkill(name: string) {
  const res = await fetchAPI("/api/profile/me/skills", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add skill");
  return data;
}

export async function removeSkill(id: string) {
  const res = await fetchAPI(`/api/profile/me/skills/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to remove skill");
  return data;
}

// --- Interests ---

export async function addInterest(name: string) {
  const res = await fetchAPI("/api/profile/me/interests", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add interest");
  return data;
}

export async function removeInterest(id: string) {
  const res = await fetchAPI(`/api/profile/me/interests/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to remove interest");
  return data;
}

// --- Matches ---

export async function getMatches() {
  const res = await fetchAPI("/api/matches");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch matches");
  return data;
}

// --- Posts ---

export async function getPosts() {
  const res = await fetchAPI("/api/posts");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch posts");
  return data;
}

export async function createPost(content: string) {
  const res = await fetchAPI("/api/posts", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create post");
  return data;
}

export async function deletePost(id: string) {
  const res = await fetchAPI(`/api/posts/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete post");
  return data;
}

export async function likePost(id: string) {
  const res = await fetchAPI(`/api/posts/${id}/like`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to like post");
  return data;
}

// --- Events ---

export async function getEvents() {
  const res = await fetchAPI("/api/events");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch events");
  return data;
}

export async function createEvent(eventData: { title: string; description: string; date: string; location: string }) {
  const res = await fetchAPI("/api/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create event");
  return data;
}

export async function attendEvent(id: string) {
  const res = await fetchAPI(`/api/events/${id}/attend`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update attendance");
  return data;
}

// --- Connections ---

export async function sendConnectionRequest(userId: string) {
  const res = await fetchAPI(`/api/connections/request/${userId}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send connection request");
  return data;
}

export async function acceptConnectionRequest(connectionId: string) {
  const res = await fetchAPI(`/api/connections/accept/${connectionId}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to accept request");
  return data;
}

export async function rejectConnectionRequest(connectionId: string) {
  const res = await fetchAPI(`/api/connections/reject/${connectionId}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reject request");
  return data;
}

export async function getConnections() {
  const res = await fetchAPI("/api/connections");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch connections");
  return data;
}

export async function getPendingRequests() {
  const res = await fetchAPI("/api/connections/pending");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch pending requests");
  return data;
}

export async function getConnectionStatus(targetId: string) {
  const res = await fetchAPI(`/api/connections/status/${targetId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to get connection status");
  return data;
}

// --- Messages ---

export async function sendMessage(userId: string, content: string) {
  const res = await fetchAPI(`/api/messages/${userId}`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send message");
  return data;
}

export async function getConversation(userId: string) {
  const res = await fetchAPI(`/api/messages/${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch conversation");
  return data;
}

export async function getConversationList() {
  const res = await fetchAPI("/api/messages");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch conversations");
  return data;
}

// --- Notifications ---

export async function getNotifications() {
  const res = await fetchAPI("/api/notifications");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch notifications");
  return data;
}

export async function markNotificationAsRead(id: string) {
  const res = await fetchAPI(`/api/notifications/${id}/read`, { method: "PUT" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to mark notification");
  return data;
}

export async function markAllNotificationsAsRead() {
  const res = await fetchAPI("/api/notifications/read-all", { method: "PUT" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to mark all notifications");
  return data;
}