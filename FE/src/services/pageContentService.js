import api from './apiClient';

export const getPageContent = async (section) => {
  try {
    const r = await api.get(`/api/page-content/${section}`);
    return r.data.content;
  } catch {
    return '';
  }
};

export const updatePageContent = async (section, content) => {
  try {
    await api.put(`/api/page-content/${section}`, { content });
    return true;
  } catch {
    return false;
  }
};
