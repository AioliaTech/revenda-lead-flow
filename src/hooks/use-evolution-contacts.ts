
import { useState, useEffect, useCallback } from "react";
import { evolutionAPIService } from "@/services/evolution-api";
import { Lead } from "@/types";
import { showErrorToast } from "@/components/ui/toast-helper";

export function useEvolutionContacts() {
  const [contacts, setContacts] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching WhatsApp contacts...");
      const fetchedContacts = await evolutionAPIService.getContacts();
      console.log("Fetched contacts:", fetchedContacts);
      
      if (fetchedContacts.length > 0) {
        setContacts(fetchedContacts);
      } else {
        setError("Nenhum contato encontrado no WhatsApp");
      }
    } catch (e) {
      console.error("Error fetching contacts:", e);
      setError("Erro ao buscar contatos da Evolution API");
      showErrorToast("Falha ao buscar contatos do WhatsApp");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
    
    // Poll for new contacts every 30 seconds
    const interval = setInterval(fetchContacts, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [fetchContacts]);

  return { contacts, loading, error, refresh: fetchContacts };
}
