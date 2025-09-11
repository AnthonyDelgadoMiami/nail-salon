// app/services/page.tsx
import ServiceList from "@/app/components/Services/ServiceList";
import Link from "next/link";
import { getServices } from "@/lib/db";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <Link href="/services/new" className="btn btn-primary">
          Add New Service
        </Link>
      </div>
      <ServiceList services={services} />
    </div>
  );
}