
import { useState, useCallback } from "react";
import { EVOLUTION_API_CONFIG } from "@/config/evolution-api";

type ConfigKeys = "baseURL" | "defaultToken" | "defaultInstance";

const LS_KEY = "evolution-api-config";

export function useEvolutionAPIConfig() {
  const defaultConfig = {
    baseURL: EVOLUTION_API_CONFIG.baseURL,
    defaultToken: EVOLUTION_API_CONFIG.defaultToken,
    defaultInstance: EVOLUTION_API_CONFIG.defaultInstance,
  };

  const [config, setConfig] = useState(() => {
    const ls = localStorage.getItem(LS_KEY);
    if (ls) {
      try {
        return JSON.parse(ls);
      } catch {
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  const updateConfig = useCallback((updates: Partial<typeof defaultConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    localStorage.setItem(LS_KEY, JSON.stringify(newConfig));
    // Atualiza as variáveis globais do arquivo de config em tempo real:
    EVOLUTION_API_CONFIG.baseURL = newConfig.baseURL;
    EVOLUTION_API_CONFIG.defaultToken = newConfig.defaultToken;
    EVOLUTION_API_CONFIG.defaultInstance = newConfig.defaultInstance;
  }, [config]);

  // Sempre que inicializar, sincronize o objeto global (recarregar página mantém persistência)
  if (
    EVOLUTION_API_CONFIG.baseURL !== config.baseURL ||
    EVOLUTION_API_CONFIG.defaultToken !== config.defaultToken ||
    EVOLUTION_API_CONFIG.defaultInstance !== config.defaultInstance
  ) {
    EVOLUTION_API_CONFIG.baseURL = config.baseURL;
    EVOLUTION_API_CONFIG.defaultToken = config.defaultToken;
    EVOLUTION_API_CONFIG.defaultInstance = config.defaultInstance;
  }

  return { config, updateConfig };
}
