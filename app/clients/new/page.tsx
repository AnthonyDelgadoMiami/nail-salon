// app/clients/new/page.tsx
import ClientForm from '@/app/components/Clients/ClientForm';

export default function NewClientPage() {
  return (
    <div className="container mx-auto p-4">
      <ClientForm />
    </div>
  );
}