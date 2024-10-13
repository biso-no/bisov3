import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function StatCard({ title, value }: { title: string; value: string | number }) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    )
  }