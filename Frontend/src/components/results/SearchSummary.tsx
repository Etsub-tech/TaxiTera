import { MapPin, ArrowRight } from "lucide-react";

interface Props {
  fromName: string;
  destination: string;
}

export default function SearchSummary({ fromName, destination }: Props) {
  return (
    <div className="flex items-center gap-4 mb-8 text-lg">
      <MapPin className="w-6 h-6 text-blue-500" />
      <span>{fromName || "Your Location"}</span>
      <ArrowRight className="w-5 h-5" />
      <span className="font-medium">{destination}</span>
    </div>
  );
}
