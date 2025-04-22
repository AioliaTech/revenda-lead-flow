
import { Lead, KanbanColumn, Tag, Channel, User } from "../types";

export const mockTags: Tag[] = [
  {
    id: "tag-1",
    name: "Novo",
    color: "#6B7280",
  },
  {
    id: "tag-2",
    name: "Quente",
    color: "#DC2626",
  },
  {
    id: "tag-3",
    name: "Frio",
    color: "#0284C7",
  },
  {
    id: "tag-4",
    name: "Em Contato",
    color: "#16A34A",
  },
];

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "5511987654321",
    email: "joao.silva@example.com",
    cpf: "123.456.789-00",
    birthDate: "1985-05-20",
    address: "Rua das Flores, 123, São Paulo",
    source: "Facebook",
    vehicleOfInterest: "Toyota Corolla",
    paymentMethod: "financing",
    financingInfo: {
      downPayment: "5000",
    },
    status: "new",
    notes: "Entrou em contato pelo Facebook, interessado em financiamento.",
    tags: [mockTags[0]],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Maria Souza",
    phone: "5521998765432",
    email: "maria.souza@example.com",
    cpf: "456.789.123-45",
    birthDate: "1990-10-15",
    address: "Avenida Central, 456, Rio de Janeiro",
    source: "Instagram",
    vehicleOfInterest: "Honda Civic",
    paymentMethod: "cash",
    status: "new",
    notes: "Viu o anúncio no Instagram, prefere pagamento à vista.",
    tags: [mockTags[1]],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Carlos Ferreira",
    phone: "5531988887777",
    email: "carlos.ferreira@example.com",
    cpf: "789.123.456-78",
    birthDate: "1978-03-01",
    address: "Rua da Bahia, 789, Belo Horizonte",
    source: "Google",
    vehicleOfInterest: "Fiat Argo",
    paymentMethod: "trade",
    tradeInfo: {
      model: "Volkswagen Gol",
      year: "2015",
      km: "80000",
      downPayment: "3000",
    },
    status: "contacted",
    notes: "Encontrou no Google, quer usar o carro na troca.",
    tags: [mockTags[2]],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Ana Paula Oliveira",
    phone: "5541977776666",
    email: "ana.paula@example.com",
    cpf: "321.654.987-12",
    birthDate: "1982-12-24",
    address: "Rua XV de Novembro, 1010, Curitiba",
    source: "Indicação",
    vehicleOfInterest: "Hyundai HB20",
    paymentMethod: "financing",
    financingInfo: {
      downPayment: "4000",
    },
    status: "negotiation",
    notes: "Foi indicada por um amigo, busca um carro para o dia a dia.",
    tags: [mockTags[3]],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Ricardo Almeida",
    phone: "5551966665555",
    email: "ricardo.almeida@example.com",
    cpf: "654.321.098-54",
    birthDate: "1995-07-07",
    address: "Avenida Farrapos, 1500, Porto Alegre",
    source: "Site",
    vehicleOfInterest: "Chevrolet Onix",
    paymentMethod: "cash",
    status: "closed",
    notes: "Chegou pelo site, fechou a compra à vista.",
    tags: [mockTags[0]],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockKanbanColumns: KanbanColumn[] = [
  {
    id: "new",
    title: "Novo Lead",
    leadIds: ["1", "2"],
    backgroundColor: "#ffffff"
  },
  {
    id: "contacted",
    title: "Contatado",
    leadIds: ["3"],
    backgroundColor: "#ffffff"
  },
  {
    id: "negotiation",
    title: "Em Negociação",
    leadIds: ["4"],
    backgroundColor: "#ffffff"
  },
  {
    id: "closed",
    title: "Fechado",
    leadIds: ["5"],
    backgroundColor: "#ffffff"
  }
];

// Add the missing mock data needed by Settings.tsx
export const mockChannels: Channel[] = [
  {
    id: "channel-1",
    name: "Canal Principal",
    phoneNumber: "5511999998888",
    isActive: true
  },
  {
    id: "channel-2",
    name: "Canal Secundário",
    phoneNumber: "5511999997777",
    isActive: false
  }
];

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  },
  {
    id: "user-2",
    name: "Gerente",
    email: "gerente@example.com",
    role: "manager"
  },
  {
    id: "user-3",
    name: "Vendedor",
    email: "vendedor@example.com",
    role: "agent"
  }
];

export const getLeadsForColumn = (column: KanbanColumn): Lead[] => {
  return mockLeads.filter((lead) => column.leadIds.includes(lead.id));
};
