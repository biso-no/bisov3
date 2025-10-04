"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BellIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

export default function AdminDashboard({ 
  pageViews,
  userDistribution,
  userGrowth,
  trafficSources,
  recentActivities,
  systemAlerts,
  postEngagement,
  audienceGrowth,
  revenueByProduct,
  expenseCategories,
  jobApplications,
  employeeDistribution
}) {
  const [role, setRole] = useState("admin")

  const totalPageViews = pageViews.reduce((sum, page) => sum + page.views, 0)
  const topPage = pageViews.reduce((best, current) => current.views > (best?.views ?? 0) ? current : best, pageViews[0] ?? null)
  const totalUsers = userGrowth[userGrowth.length - 1]?.users ?? 0
  const previousUsers = userGrowth[userGrowth.length - 2]?.users ?? totalUsers
  const userGrowthRate = previousUsers > 0 ? ((totalUsers - previousUsers) / previousUsers) * 100 : 0
  const topTrafficSource = trafficSources.reduce((best, current) => current.value > (best?.value ?? 0) ? current : best, trafficSources[0] ?? null)
  const alertCounts = systemAlerts.reduce(
    (acc, alert) => {
      acc[alert.type] = (acc[alert.type] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const renderRoleSpecificContent = (tab) => {
    switch (role) {
      case "admin":
        return renderAdminContent(tab)
      case "pr":
        return renderPRContent(tab)
      case "finance":
        return renderFinanceContent(tab)
      case "hr":
        return renderHRContent(tab)
      default:
        return <div>No specific content for this role</div>
    }
  }

  const renderAdminContent = (tab) => {
    switch (tab) {
      case "overview":
        return (
          <>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Page Views</CardTitle>
                <CardDescription>Overview of page views across the website</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageViews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of user types</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user growth over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )
      case "analytics":
        return (
          <>
            {/* High-level analytics cards */}
            <Card>
              <CardHeader>
                <CardTitle>Total Page Views</CardTitle>
                <CardDescription>Aggregate across all tracked pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalPageViews.toLocaleString()}</div>
                {topPage ? (
                  <div className="text-sm text-muted-foreground">Top page: {topPage.name}</div>
                ) : (
                  <div className="text-sm text-muted-foreground">No page data available</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Month-over-month change</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalUsers.toLocaleString()}</div>
                <div className={`text-sm ${userGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {userGrowthRate >= 0 ? '+' : ''}{userGrowthRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Traffic Source</CardTitle>
                <CardDescription>Leading channel this period</CardDescription>
              </CardHeader>
              <CardContent>
                {topTrafficSource ? (
                  <>
                    <div className="text-3xl font-bold">{topTrafficSource.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {topTrafficSource.value.toLocaleString()} sessions
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">No traffic data available</div>
                )}
              </CardContent>
            </Card>

            {/* Traffic Source Breakdown */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Traffic Source Breakdown</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`traffic-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )
      case "reports":
        return (
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest actions performed by users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      case "notifications":
        return (
          <>
            {/* Alert Summary Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircleIcon className="h-5 w-5 text-red-500" />
                  Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{alertCounts.error ?? 0}</div>
                <div className="text-sm text-gray-600">Require immediate attention</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-yellow-500" />
                  Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{alertCounts.warning ?? 0}</div>
                <div className="text-sm text-gray-600">Monitor these items</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-blue-500" />
                  Info Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{alertCounts.info ?? 0}</div>
                <div className="text-sm text-gray-600">General system updates</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  Success Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{alertCounts.success ?? 0}</div>
                <div className="text-sm text-gray-600">Completed tasks</div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Application and platform notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="mb-4 flex items-center space-x-4">
                      {alert.type === "error" && <AlertCircleIcon className="h-6 w-6 text-red-500" />}
                      {alert.type === "warning" && <AlertCircleIcon className="h-6 w-6 text-yellow-500" />}
                      {alert.type === "info" && <BellIcon className="h-6 w-6 text-blue-500" />}
                      {alert.type === "success" && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-gray-500">{alert.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        )
      default:
        return <div>No content for this tab</div>
    }
  }

  const renderPRContent = (tab) => {
    switch (tab) {
      case "overview":
        return (
          <>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Post Engagement</CardTitle>
                <CardDescription>Overview of likes, comments, and shares for recent posts</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={postEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="likes" fill="#8884d8" />
                    <Bar dataKey="comments" fill="#82ca9d" />
                    <Bar dataKey="shares" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Audience Growth</CardTitle>
                <CardDescription>Monthly follower growth</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={audienceGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="followers" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )
      // ... (other tabs for PR role)
      default:
        return <div>No content for this tab</div>
    }
  }

  const renderFinanceContent = (tab) => {
    switch (tab) {
      case "overview":
        return (
          <>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Revenue by Product</CardTitle>
                <CardDescription>Overview of revenue generated by each product</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByProduct}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Breakdown of expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )
      // ... (other tabs for Finance role)
      default:
        return <div>No content for this tab</div>
    }
  }

  const renderHRContent = (tab) => {
    switch (tab) {
      case "overview":
        return (
          <>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>Number of applications per open position</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobApplications}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="position" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="applications" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="openPositions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Employee Distribution</CardTitle>
                <CardDescription>Breakdown of employees by department</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={employeeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {employeeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )
      // ... (other tabs for HR role)
      default:
        return <div>No content for this tab</div>
    }
  }

  return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container px-6 mx-auto">
            <h3 className="text-3xl font-medium text-gray-700">Dashboard</h3>
            <div className="mt-8">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {renderRoleSpecificContent("overview")}
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {renderRoleSpecificContent("analytics")}
                  </div>
                </TabsContent>
                <TabsContent value="reports" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {renderRoleSpecificContent("reports")}
                  </div>
                </TabsContent>
                <TabsContent value="notifications" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {renderRoleSpecificContent("notifications")}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
  )
}
