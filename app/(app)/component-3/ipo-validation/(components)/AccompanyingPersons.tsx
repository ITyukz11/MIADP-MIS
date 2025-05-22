"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import ShadCN Table components

type Staff = {
  name: string;
  position: string;
};

type Props = {
  pso?: Staff[];
  rpco?: Staff[];
  lpmiu?: Staff[];
  plgu?: Staff[];
  other?: Staff[];
};

export default function AccompanyingPersons({
  pso = [],
  rpco = [],
  lpmiu = [],
  plgu = [],
  other = [],
}: Props) {
  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Accompanying Persons</h2>
        <Separator className="mb-4" />

        <div className="space-y-6">
          <StaffGroup label="PSO MIADP Staff" staff={pso} />
          <StaffGroup label="RPCO MIADP Staff" staff={rpco} />
          <StaffGroup label="LPMIU Staff" staff={lpmiu} />
          <StaffGroup label="PLGU Staff" staff={plgu} />
          <StaffGroup label="Other Staff" staff={other} />
        </div>
      </CardContent>
    </Card>
  );
}

function StaffGroup({ label, staff }: { label: string; staff: Staff[] }) {
  if (!staff.length) return null;

  return (
    <div>
      <h3 className="text-md font-semibold mb-2">{label}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((s, i) => (
            <TableRow key={i}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.position}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
