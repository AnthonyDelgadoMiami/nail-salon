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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Service Details</h1>
        <Link href={`/services/${service.id}/edit`} className="btn btn-warning">
          Edit Service
        </Link>
      </div>

      {/* Card */}
      <div className="card bg-base-100 shadow-lg rounded-lg overflow-hidden">
        <div className="card-body p-6 space-y-4">
          <h2 className="card-title text-2xl">{service.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-gray-700">
                {service.description || "No description available."}
              </p>
            </div>

            {/* Duration & Price */}
            <div className="flex flex-col gap-2">
              <div>
                <span className="font-semibold">Duration:</span> {service.duration} min
              </div>
              <div>
                <span className="font-semibold">Price:</span> ${service.price.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
