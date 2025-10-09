import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon?: any; trend?: any }) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && (
            <div className="p-2 bg-white/10 rounded-lg">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div className="text-sm text-muted-foreground">
              {trend}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }