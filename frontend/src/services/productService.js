import api from './api';

export const productService = {
  getProducts: async (params) => {
    const response = await api.get('/product', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  },
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/product/category/${categoryId}`);
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post('/product', productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.put(`/product/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  }
};
