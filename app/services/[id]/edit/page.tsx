// app/services/[id]/edit/page.tsx
import ServiceForm from '@/app/components/Services/ServiceForm';
import { getService } from '@/lib/db';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const service = await getService(Number(id));

  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <ServiceForm service={service} />
    </div>
  );
}