
import { toast } from "@/hooks/use-toast";
import { showErrorToast } from "@/components/ui/toast-helper";

export async function makeRequest(endpoint: string, options: RequestInit = {}) {
  const { baseURL, token } = await import("./config").then(m => m.getEvolutionConfig());
  const url = `${baseURL}/${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'apikey': token,
    ...options.headers
  };

  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Response from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error("Evolution API request failed:", error);
    showErrorToast("Falha na comunicação com a API do WhatsApp");
    throw error;
  }
}
