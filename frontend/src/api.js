import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export const getUserStories = () =>
  api.get("/user-stories").then((res) => res.data);

export const createUserStory = (story) =>
  api.post("/user-stories", story).then((res) => res.data);

export const updateUserStory = (id, story) =>
  api.put(`/user-stories/${id}`, story).then((res) => res.data);

export const deleteUserStory = (id) => api.delete(`/user-stories/${id}`);
