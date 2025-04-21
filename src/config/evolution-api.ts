
export const EVOLUTION_API_CONFIG = {
  baseURL: import.meta.env.VITE_EVOLUTION_API_URL || 'http://localhost:8080',
  defaultToken: import.meta.env.VITE_EVOLUTION_API_TOKEN || 'your-evolution-api-token',
  defaultInstance: import.meta.env.VITE_EVOLUTION_API_INSTANCE || 'default-instance',
};
