// app/clients/page.tsx
import ClientList from "@/app/components/Clients/ClientList";
import Link from "next/link";
import { getClients } from "@/lib/db";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Link href="/clients/new" className="btn btn-primary">
          Add New Client
        </Link>
      </div>
      <ClientList clients={clients} />
    </div>
  );
}