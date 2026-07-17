import axiosClient from './axiosClient';
import { handleApiError } from './errorHandler';
import { getToken } from '../auth/token';

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const ordersApi = {
  async checkout(cartItems) {
    try {
      const payload = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };
      const response = await axiosClient.post('/orders/checkout', payload, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to place order');
      throw error;
    }
  },

  async getMyOrders() {
    try {
      const response = await axiosClient.get('/orders/my', {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch orders');
      throw error;
    }
  },

  async getOrderById(id) {
    try {
      const response = await axiosClient.get(`/orders/${id}`, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch order details');
      throw error;
    }
  },

  async getAllForAdmin() {
    try {
      const response = await axiosClient.get('/orders/admin/all', {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch all orders');
      throw error;
    }
  },

  async adminUpdateStatus(orderId, status) {
    try {
      const response = await axiosClient.patch(
        `/orders/${orderId}/status`,
        { status },
        { headers: authHeader() },
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update order status');
      throw error;
    }
  },

  async adminUpdateItemQuantity(orderId, itemId, quantity) {
    try {
      const response = await axiosClient.patch(
        `/orders/${orderId}/items/quantity`,
        { item_id: itemId, quantity },
        { headers: authHeader() },
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update item quantity');
      throw error;
    }
  },

  async addItemsToOrder(orderId, items) {
    try {
      const payload = {
        items: items.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };
      const response = await axiosClient.post(
        `/orders/${orderId}/items`,
        payload,
        { headers: authHeader() },
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to add items to order');
      throw error;
    }
  },
};