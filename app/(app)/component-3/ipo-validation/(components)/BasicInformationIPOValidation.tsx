import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

type Props = {
  validationData: {
    name: string;
    value: string;
  }[];
};

export default function BasicInformationIPOValidation({
  validationData,
}: Props) {
  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <Separator className="mb-4" />

        <Table>
          <TableBody>
            {validationData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium w-1/3">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
