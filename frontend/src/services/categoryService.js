import api from './api';

export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/product/categories');
    return response.data;
  },
  createCategory: async (categoryData) => {
    const response = await api.post('/product/categories', categoryData);
    return response.data;
  },
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/product/categories/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/product/categories/${id}`);
    return response.data;
  }
};
