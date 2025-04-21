
import { Lead, Tag, KanbanColumn, Message, Channel, User } from "../types";

// Mock Tags
export const mockTags: Tag[] = [
  { id: "tag1", name: "Quente", color: "#EA4335" },
  { id: "tag2", name: "Aguardando Retorno", color: "#FBBC05" },
  { id: "tag3", name: "Financiamento", color: "#34A853" },
  { id: "tag4", name: "À Vista", color: "#1A73E8" },
  { id: "tag5", name: "SUV", color: "#8E24AA" },
  { id: "tag6", name: "Sedan", color: "#0097A7" },
  { id: "tag7", name: "Trocou Contato", color: "#FF5722" },
];

// Mock Leads
export const mockLeads: Lead[] = [
  {
    id: "lead1",
    name: "Carlos Silva",
    phone: "(11) 98765-4321",
    email: "carlos.silva@email.com",
    address: "Rua das Flores, 123 - São Paulo, SP",
    cpf: "123.456.789-00",
    birthDate: "15/05/1985",
    source: "Facebook Ads",
    vehicleOfInterest: "Honda Civic 2022",
    paymentMethod: "financing",
    financingInfo: {
      downPayment: "R$ 15.000,00"
    },
    notes: "Interessado em um modelo com teto solar",
    status: "em_contato",
    tags: [mockTags[0], mockTags[2]],
    createdAt: "2023-10-15T14:30:00Z",
    updatedAt: "2023-10-16T09:45:00Z"
  },
  {
    id: "lead2",
    name: "Ana Oliveira",
    phone: "(21) 99876-5432",
    email: "ana.oliveira@email.com",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    cpf: "987.654.321-00",
    birthDate: "22/07/1990",
    source: "Instagram",
    vehicleOfInterest: "Toyota Corolla 2023",
    paymentMethod: "cash",
    notes: "Tem urgência na compra",
    status: "negociacao",
    tags: [mockTags[1], mockTags[3]],
    createdAt: "2023-10-14T10:20:00Z",
    updatedAt: "2023-10-15T11:30:00Z"
  },
  {
    id: "lead3",
    name: "Roberto Pereira",
    phone: "(31) 97654-3210",
    email: "roberto.pereira@email.com",
    address: "Rua das Palmeiras, 456 - Belo Horizonte, MG",
    cpf: "456.789.123-00",
    birthDate: "10/12/1978",
    source: "Site",
    vehicleOfInterest: "Jeep Renegade 2023",
    paymentMethod: "trade",
    tradeInfo: {
      model: "Fiat Uno 2018",
      year: "2018",
      km: "45000",
      downPayment: "R$ 5.000,00"
    },
    notes: "Deseja trocar o carro atual com volta",
    status: "documentacao",
    tags: [mockTags[4], mockTags[0]],
    createdAt: "2023-10-13T16:45:00Z",
    updatedAt: "2023-10-14T14:20:00Z"
  },
  {
    id: "lead4",
    name: "Fernanda Costa",
    phone: "(41) 99887-6655",
    email: "fernanda.costa@email.com",
    address: "Rua dos Pinheiros, 789 - Curitiba, PR",
    cpf: "789.123.456-00",
    birthDate: "05/03/1992",
    source: "Indicação",
    vehicleOfInterest: "Hyundai HB20 2022",
    paymentMethod: "financing",
    financingInfo: {
      downPayment: "R$ 10.000,00"
    },
    notes: "Prefere parcelas de até R$ 800,00",
    status: "proposta_enviada",
    tags: [mockTags[2], mockTags[5]],
    createdAt: "2023-10-12T09:15:00Z",
    updatedAt: "2023-10-13T15:30:00Z"
  },
  {
    id: "lead5",
    name: "Marcelo Santos",
    phone: "(51) 98765-1234",
    email: "marcelo.santos@email.com",
    address: "Av. Independência, 567 - Porto Alegre, RS",
    cpf: "321.654.987-00",
    birthDate: "18/09/1980",
    source: "Google Ads",
    vehicleOfInterest: "Volkswagen T-Cross 2023",
    paymentMethod: "cash",
    notes: "Já visitou a loja 2 vezes",
    status: "visita_agendada",
    tags: [mockTags[3], mockTags[4]],
    createdAt: "2023-10-11T13:40:00Z",
    updatedAt: "2023-10-12T10:15:00Z"
  },
  {
    id: "lead6",
    name: "Patricia Lima",
    phone: "(61) 99765-4321",
    email: "patricia.lima@email.com",
    address: "SQS 308 - Brasília, DF",
    cpf: "654.987.321-00",
    birthDate: "29/11/1988",
    source: "Facebook",
    vehicleOfInterest: "Nissan Kicks 2022",
    paymentMethod: "financing",
    financingInfo: {
      downPayment: "R$ 20.000,00"
    },
    notes: "Interessada em test drive",
    status: "test_drive",
    tags: [mockTags[0], mockTags[6]],
    createdAt: "2023-10-10T11:20:00Z",
    updatedAt: "2023-10-11T09:45:00Z"
  },
  {
    id: "lead7",
    name: "Lucas Mendes",
    phone: "(71) 98877-6655",
    email: "lucas.mendes@email.com",
    address: "Av. Oceânica, 1234 - Salvador, BA",
    cpf: "111.222.333-44",
    birthDate: "14/02/1983",
    source: "OLX",
    vehicleOfInterest: "Ford Ranger 2021",
    paymentMethod: "trade",
    tradeInfo: {
      model: "Chevrolet Onix 2019",
      year: "2019",
      km: "35000",
      downPayment: "R$ 8.000,00"
    },
    notes: "Compra para trabalho",
    status: "fechado_ganho",
    tags: [mockTags[5], mockTags[1]],
    createdAt: "2023-10-09T15:30:00Z",
    updatedAt: "2023-10-10T16:45:00Z"
  }
];

// Mock Kanban Columns
export const mockKanbanColumns: KanbanColumn[] = [
  {
    id: "em_contato",
    title: "Em Contato",
    leadIds: ["lead1", "lead2"]
  },
  {
    id: "negociacao",
    title: "Negociação",
    leadIds: ["lead3"]
  },
  {
    id: "visita_agendada",
    title: "Visita Agendada",
    leadIds: ["lead5"]
  },
  {
    id: "test_drive",
    title: "Test Drive",
    leadIds: ["lead6"]
  },
  {
    id: "proposta_enviada",
    title: "Proposta Enviada",
    leadIds: ["lead4"]
  },
  {
    id: "documentacao",
    title: "Documentação",
    leadIds: []
  },
  {
    id: "fechado_ganho",
    title: "Fechado (Ganho)",
    leadIds: ["lead7"]
  },
  {
    id: "fechado_perdido",
    title: "Fechado (Perdido)",
    leadIds: []
  }
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: "msg1",
    leadId: "lead1",
    content: "Olá! Estou interessado no Honda Civic 2022 que vi no anúncio.",
    type: "text",
    isIncoming: true,
    timestamp: "2023-10-15T14:35:00Z",
    status: "read"
  },
  {
    id: "msg2",
    leadId: "lead1",
    content: "Olá Carlos! Tudo bem? Sim, temos o Honda Civic 2022 disponível para visita e test drive. Quando gostaria de vir à nossa loja?",
    type: "text",
    isIncoming: false,
    timestamp: "2023-10-15T14:40:00Z",
    status: "read"
  },
  {
    id: "msg3",
    leadId: "lead1",
    content: "Que ótimo! Posso ir aí amanhã à tarde, por volta das 15h. O carro possui teto solar?",
    type: "text",
    isIncoming: true,
    timestamp: "2023-10-15T14:45:00Z",
    status: "read"
  },
  {
    id: "msg4",
    leadId: "lead1",
    content: "Perfeito! Temos sim o modelo com teto solar. Vou reservar um horário para você às 15h amanhã. Poderia me informar seus dados para cadastro?",
    type: "text",
    isIncoming: false,
    timestamp: "2023-10-15T14:50:00Z",
    status: "read"
  },
  {
    id: "msg5",
    leadId: "lead2",
    content: "Bom dia! Vocês ainda têm aquele Corolla 2023 prata?",
    type: "text",
    isIncoming: true,
    timestamp: "2023-10-14T10:25:00Z",
    status: "read"
  },
  {
    id: "msg6",
    leadId: "lead2",
    content: "Bom dia Ana! Sim, o Toyota Corolla 2023 prata está disponível. Gostaria de agendar uma visita?",
    type: "text",
    isIncoming: false,
    timestamp: "2023-10-14T10:30:00Z",
    status: "read"
  }
];

// Mock Channels (WhatsApp)
export const mockChannels: Channel[] = [
  {
    id: "channel1",
    name: "Vendas Principal",
    phoneNumber: "+5511988776655",
    isActive: true
  },
  {
    id: "channel2",
    name: "Suporte ao Cliente",
    phoneNumber: "+5511977665544",
    isActive: true
  },
  {
    id: "channel3",
    name: "Marketing",
    phoneNumber: "+5511966554433",
    isActive: false
  }
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Admin",
    email: "admin@revenda.com",
    role: "admin"
  },
  {
    id: "user2",
    name: "Gerente",
    email: "gerente@revenda.com",
    role: "manager"
  },
  {
    id: "user3",
    name: "Vendedor 1",
    email: "vendedor1@revenda.com",
    role: "agent"
  }
];

// Helper to get a lead by id
export const getLeadById = (id: string): Lead | undefined => {
  return mockLeads.find(lead => lead.id === id);
};

// Helper to get messages for a lead
export const getMessagesForLead = (leadId: string): Message[] => {
  return mockMessages.filter(message => message.leadId === leadId);
};

// Helper to get all leads for a column
export const getLeadsForColumn = (column: KanbanColumn): Lead[] => {
  return column.leadIds.map(id => {
    const lead = getLeadById(id);
    return lead as Lead;
  }).filter(Boolean);
};
