import { getClient } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const client = await getClient(Number(id));

  if (!client) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client Details</h1>
        <Link href={`/clients/${client.id}/edit`} className="btn btn-warning">
          Edit Client
        </Link>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{client.firstName} {client.lastName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Phone:</strong> {client.phone}</p>
              <p><strong>Email:</strong> {client.email || "N/A"}</p>
            </div>
            <div>
              <p><strong>Notes:</strong></p>
              <p>{client.notes || "No notes available"}</p>
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <Link href={`/appointments/new?clientId=${client.id}`} className="btn btn-primary">
              Schedule Appointment
            </Link>
            <Link href={`/clients/${client.id}/history`} className="btn btn-secondary">
              View Appointment History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}