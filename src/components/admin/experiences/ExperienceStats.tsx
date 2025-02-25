
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building2, Calendar, MapPin } from "lucide-react";
import { Experience } from "@/types/experience";

interface ExperienceStatsProps {
  experiences: Experience[] | undefined;
}

export function ExperienceStats({ experiences }: ExperienceStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Total Expériences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{experiences?.length || 0}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Entreprises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {experiences ? new Set(experiences.map(e => e.company)).size : 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Villes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {experiences ? new Set(experiences.map(e => e.location)).size : 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Années d'exp.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">5</p>
        </CardContent>
      </Card>
    </div>
  );
}
