
import { Lead } from "@/types";
import { makeRequest } from "./request";

export async function getContacts(): Promise<Lead[]> {
  try {
    const { instanceName } = await import("./config").then(m => m.getEvolutionConfig());
    
    // Try multiple endpoints that might work with different Evolution API versions
    const endpoints = [
      `chat/getAllChats/${instanceName}`,
      `instance/contacts/${instanceName}`,
      `contacts/${instanceName}`,
      `contact/getContacts/${instanceName}`
    ];
    
    let response = null;
    let error = null;
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying to fetch contacts using endpoint: ${endpoint}`);
        response = await makeRequest(endpoint);
        console.log("Contacts response from endpoint:", endpoint, response);
        if (response && (response.contacts || response.data || response.chats)) {
          console.log("Found valid contacts response format");
          break; // We got a valid response, exit the loop
        }
      } catch (err) {
        console.log(`Endpoint ${endpoint} failed:`, err);
        error = err;
      }
    }
    
    if (!response) {
      console.error("All contact endpoints failed:", error);
      return [];
    }
    
    // Handle different response formats
    const contactArray = response.contacts || response.data || response.chats || [];
    
    if (!Array.isArray(contactArray)) {
      console.error("Unexpected response format for contacts:", response);
      return [];
    }
    
    console.log("Processing contacts array:", contactArray);
    
    return contactArray.map((c: any) => {
      // Extract phone number from various formats
      let phone = c.id?.user || c.id || c.wa_id || c.phone || c.number || "";
      if (typeof phone === 'object' && phone !== null) {
        phone = phone.user || phone._serialized || JSON.stringify(phone);
      }
      
      // Extract name from various formats
      let name = c.name || c.pushname || c.displayName || c.verifiedName || phone;
      
      return {
        id: c.id?.user || c.id || c._serialized || c.jid || c.number || phone,
        name: name,
        phone: phone,
        email: c.email || "",
        address: c.address || "",
        cpf: c.cpf || "",
        birthDate: c.birthDate || "",
        source: c.source || "WhatsApp",
        vehicleOfInterest: c.vehicleOfInterest || "",
        paymentMethod: "cash",
        tradeInfo: c.tradeInfo,
        financingInfo: c.financingInfo,
        notes: c.notes || "",
        status: c.status || "novo",
        tags: [],
        createdAt: c.createdAt || new Date().toISOString(),
        updatedAt: c.updatedAt || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Falha ao buscar contatos:", error);
    return [];
  }
}
