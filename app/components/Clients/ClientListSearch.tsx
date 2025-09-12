"use client";

import { useState } from "react";
import Link from "next/link";

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  notes: string | null;
}

interface ClientListSearchProps {
  clients: Client[];
}

export default function ClientListSearch({ clients }: ClientListSearchProps) {
  const [filter, setFilter] = useState("");

  const filteredClients = clients.filter(client => {
    const search = filter.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(search) ||
      client.lastName.toLowerCase().includes(search) ||
      client.phone.toLowerCase().includes(search)
    );
  });

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
    <div>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Filter by name or phone..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
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
            {filteredClients.map(client => (
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
                  <div className="flex flex-col lg:flex-row gap-2">
                    <Link 
                      href={`/clients/${client.id}`} 
                      className="btn btn-sm btn-info"
                    >
                      View
                    </Link>
                    <Link 
                      href={`/clients/${client.id}/edit`}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}