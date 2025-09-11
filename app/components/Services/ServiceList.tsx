// app/components/Services/ServiceList.tsx
import Link from 'next/link';

interface Service {
  id: number;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

interface ServiceListProps {
  services: Service[];
}

export default function ServiceList({ services }: ServiceListProps) {
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
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td>
                <div className="font-bold">{service.name}</div>
              </td>
              <td>{service.description || '-'}</td>
              <td>{service.duration} minutes</td>
              <td>${service.price.toFixed(2)}</td>
              <td>
                <Link 
                  href={`/services/${service.id}`} 
                  className="btn btn-sm btn-info mr-2"
                >
                  View
                </Link>
                <Link 
                  href={`/services/${service.id}/edit`}
                  className="btn btn-sm btn-warning"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}