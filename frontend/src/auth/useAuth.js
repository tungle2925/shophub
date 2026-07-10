import { getToken, getUser } from './token';

export function useAuth() {
  const token = getToken();
  const user = getUser();

  return {
    isAuthenticated: Boolean(token),
    role: user?.role || null,
    user,
    isAdmin: user?.role === 'ADMIN',
    isCustomer: user?.role === 'CUSTOMER',
  };
}