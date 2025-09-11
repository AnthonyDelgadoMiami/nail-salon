// app/clients/[id]/edit/page.tsx
import ClientForm from '@/app/components/Clients/ClientForm';
import { getClient } from '@/lib/db';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: PageProps) {
  const { id } = await params;
  const client = await getClient(Number(id));

  if (!client) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <ClientForm client={client} />
    </div>
  );
}