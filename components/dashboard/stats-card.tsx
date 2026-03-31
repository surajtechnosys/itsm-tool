import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  value: number;
};

export default function StatsCard({ title, value }: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </CardContent>
    </Card>
  );
}