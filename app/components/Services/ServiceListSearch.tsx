// app/components/Services/ServiceListSearch.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface Service {
  id: number;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

interface ServiceListSearchProps {
  services: Service[];
}

export default function ServiceListSearch({ services }: ServiceListSearchProps) {
  const [filter, setFilter] = useState("");

  const filteredServices = services.filter(service => {
    const search = filter.toLowerCase();
    return (
      service.name.toLowerCase().includes(search) ||
      (service.description && service.description.toLowerCase().includes(search)) ||
      service.duration.toString().includes(search) ||
      service.price.toString().includes(search)
    );
  });

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl font-bold text-gray-500 mb-4">No services yet</div>
        <p className="text-gray-400 mb-6">Get started by adding your first service</p>
        <Link href="/services/new" className="btn btn-primary">
          Add Your First Service
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          className="input input-bordered w-full max-w-md"
          placeholder="Search by name, description, duration, or price..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      
      {filteredServices.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-lg font-semibold text-gray-500 mb-2">No services found</div>
          <p className="text-gray-400">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow rounded-lg"
            >
              <div className="card-body p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                
                {/* Service Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 sm:line-clamp-none">
                      {service.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2 text-sm">
                    <span className="badge badge-outline">{service.duration} min</span>
                    <span className="badge badge-outline">${service.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:gap-2 mt-2 sm:mt-0">
                  <Link
                    href={`/services/${service.id}`}
                    className="btn btn-sm btn-info w-full sm:w-auto"
                  >
                    View
                  </Link>
                  <Link
                    href={`/services/${service.id}/edit`}
                    className="btn btn-sm btn-warning w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    Edit
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}