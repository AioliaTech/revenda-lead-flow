
export const EVOLUTION_API_CONFIG = {
  // Se você estiver rodando localmente, provavelmente será http://localhost:8080
  baseURL: import.meta.env.VITE_EVOLUTION_API_URL || 'http://localhost:8080',
  
  // Substitua pelo seu token do Evolution API
  defaultToken: import.meta.env.VITE_EVOLUTION_API_TOKEN || 'SEU_TOKEN_AQUI',
  
  // Nome da instância que você configurou no Evolution API
  defaultInstance: import.meta.env.VITE_EVOLUTION_API_INSTANCE || 'sua-instancia',
};
