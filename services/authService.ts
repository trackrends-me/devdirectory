
export const AuthService = {
  login: (userId: string, pass: string): boolean => {
    if (userId === 'webseotools007' && pass === 'Daikin@@95055') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('dd_admin_auth', 'true');
        localStorage.setItem('dd_admin_user', userId);
      }
      return true;
    }
    return false;
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dd_admin_auth');
      localStorage.removeItem('dd_admin_user');
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dd_admin_auth') === 'true';
    }
    return false;
  }
};
