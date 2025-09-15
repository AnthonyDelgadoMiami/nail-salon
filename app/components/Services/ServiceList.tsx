// app/components/Services/ServiceList.tsx
import ServiceListSearch from "./ServiceListSearch";

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
  return <ServiceListSearch services={services} />;
}