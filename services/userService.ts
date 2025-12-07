import { Tool } from '../types';

const BOOKMARK_KEY = 'dd_user_bookmarks';

export const UserService = {
  getBookmarks: (): string[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(BOOKMARK_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addBookmark: (toolId: string) => {
    const bookmarks = UserService.getBookmarks();
    if (!bookmarks.includes(toolId)) {
      const newBookmarks = [...bookmarks, toolId];
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(newBookmarks));
    }
  },

  removeBookmark: (toolId: string) => {
    const bookmarks = UserService.getBookmarks();
    const newBookmarks = bookmarks.filter(id => id !== toolId);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(newBookmarks));
  },

  isBookmarked: (toolId: string): boolean => {
    const bookmarks = UserService.getBookmarks();
    return bookmarks.includes(toolId);
  },

  toggleBookmark: (toolId: string): boolean => {
    if (UserService.isBookmarked(toolId)) {
      UserService.removeBookmark(toolId);
      return false;
    } else {
      UserService.addBookmark(toolId);
      return true;
    }
  }
};