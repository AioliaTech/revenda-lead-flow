
import { EVOLUTION_API_CONFIG } from "@/config/evolution-api";

export const getEvolutionConfig = () => {
  return {
    baseURL: EVOLUTION_API_CONFIG.baseURL,
    token: EVOLUTION_API_CONFIG.defaultToken,
    instanceName: EVOLUTION_API_CONFIG.defaultInstance,
  };
};
