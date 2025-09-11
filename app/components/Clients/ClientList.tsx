// app/components/Clients/ClientList.tsx
import Link from 'next/link';

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
  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl font-bold text-gray-500 mb-4">No clients yet</div>
        <p className="text-gray-400 mb-6">Get started by adding your first client</p>
        <Link href="/clients/new" className="btn btn-primary">
          Add Your First Client
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
            <th>Phone</th>
            <th>Email</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>
                <div className="font-bold">
                  {client.firstName} {client.lastName}
                </div>
              </td>
              <td>{client.phone}</td>
              <td>{client.email || '-'}</td>
              <td className="max-w-xs truncate">{client.notes || '-'}</td>
              <td>
                <Link 
                  href={`/clients/${client.id}`} 
                  className="btn btn-sm btn-info mr-2"
                >
                  View
                </Link>
                <Link 
                  href={`/clients/${client.id}/edit`}
                  className="btn btn-sm btn-warning mr-2"
                >
                  Edit
                </Link>
                {/* We'll add delete functionality later */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}