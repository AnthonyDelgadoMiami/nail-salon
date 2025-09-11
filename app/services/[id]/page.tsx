// app/services/[id]/page.tsx
import { getService } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const service = await getService(Number(id));

  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Service Details</h1>
        <Link href={`/services/${service.id}/edit`} className="btn btn-warning">
          Edit Service
        </Link>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{service.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Description:</strong></p>
              <p>{service.description || "No description available"}</p>
            </div>
            <div>
              <p><strong>Duration:</strong> {service.duration} minutes</p>
              <p><strong>Price:</strong> ${service.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}