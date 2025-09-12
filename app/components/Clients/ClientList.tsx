import ClientListSearch from "./ClientListSearch";

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  notes: string | null;
}

interface ClientListProps {
  clients: Client[];
}

export default function ClientList({ clients }: ClientListProps) {
  return <ClientListSearch clients={clients} />;
}