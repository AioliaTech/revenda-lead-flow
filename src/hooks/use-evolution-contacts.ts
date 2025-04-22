
import { useState, useEffect } from "react";
import { evolutionAPIService } from "@/services/evolution-api";
import { Lead } from "@/types";

export function useEvolutionContacts() {
  const [contacts, setContacts] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedContacts = await evolutionAPIService.getContacts();
      setContacts(fetchedContacts);
    } catch (e) {
      setError("Erro ao buscar contatos da Evolution API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return { contacts, loading, error, refresh: fetchContacts };
}
