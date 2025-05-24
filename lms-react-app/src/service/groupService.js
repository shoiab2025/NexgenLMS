
import axios from 'axios';

export const fetchGroups = async () => {
    const response = await axios.get('/api/groups'); 
    return response.data;
};

export const fetchGroupById = async (id) => {
    const response = await axios.get(`/api/groups/${id}`);
    return response.data;
};

export const createGroup = async (group) => {
    const response = await axios.post('/api/groups', group);
    return response.data;
};

export const updateGroup = async (id, group) => {
    const response = await axios.put(`/api/groups/${id}`, group);
    return response.data;
};

export const deleteGroup = async (id) => {
    await axios.delete(`/api/groups/${id}`);
};

export const assignUserToGroup = async (groupId, userId) => {
    const response = await axios.post(`/api/groups/${groupId}/users`, { userId });
    return response.data;
};

export const assignCourseToGroup = async (groupId, courseId) => {
    const response = await axios.post(`/api/groups/${groupId}/courses`, { courseId });
    return response.data;
};
