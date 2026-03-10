import api from "./api.js";

export const furnitureService = {
  // Get all furniture items
  async getAll() {
    try {
      const response = await api.get("/furniture/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching furniture:", error);
      throw error;
    }
  },

  // Get popular furniture (can be filtered or sorted by likes/views in future)
  async getPopular(limit = 4) {
    try {
      const response = await api.get("/furniture/all");
      // For now, return first few items as "popular"
      // In future, this could be based on actual popularity metrics
      return response.data.slice(0, limit);
    } catch (error) {
      console.error("Error fetching popular furniture:", error);
      throw error;
    }
  },

  // Get latest furniture (sorted by creation date)
  async getLatest(limit = 4) {
    try {
      const response = await api.get("/furniture/all");
      // Sort by creation date (newest first) and return latest items
      const sorted = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      return sorted.slice(0, limit);
    } catch (error) {
      console.error("Error fetching latest furniture:", error);
      throw error;
    }
  },
};
