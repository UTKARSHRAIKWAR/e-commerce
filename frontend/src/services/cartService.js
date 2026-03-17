import api from './api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  addToCart: async (cartItem) => {
    const response = await api.post('/cart', cartItem);
    return response.data;
  },
  updateCartItem: async (updateData) => {
    const response = await api.put('/cart/item', updateData);
    return response.data;
  },
  removeCartItem: async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};
