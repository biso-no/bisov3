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
import { BellIcon, AlertCircleIcon, CheckCircleIcon, ServerIcon, CpuIcon, HardDriveIcon, MemoryStickIcon, WifiIcon } from "lucide-react"

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
  employeeDistribution,
  webdockServerStatus,
  webdockResourceUsage,
  webdockSystemAlerts,
  webdockOverviewStats
}) {
  const [role, setRole] = useState("admin")

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
            {/* Server Overview Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ServerIcon className="h-5 w-5" />
                  Total Servers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{webdockOverviewStats?.totalServers || 0}</div>
                <div className="text-sm text-green-600">
                  {webdockOverviewStats?.onlineServers || 0} online
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CpuIcon className="h-5 w-5" />
                  Avg CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{webdockOverviewStats?.avgCpuUsage?.toFixed(1) || 0}%</div>
                <div className={`text-sm ${(webdockOverviewStats?.avgCpuUsage || 0) > 80 ? 'text-red-600' : 'text-green-600'}`}>
                  {(webdockOverviewStats?.avgCpuUsage || 0) > 80 ? 'High usage' : 'Normal'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MemoryStickIcon className="h-5 w-5" />
                  Avg Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{webdockOverviewStats?.avgMemoryUsage?.toFixed(1) || 0}%</div>
                <div className={`text-sm ${(webdockOverviewStats?.avgMemoryUsage || 0) > 85 ? 'text-red-600' : 'text-green-600'}`}>
                  {(webdockOverviewStats?.avgMemoryUsage || 0) > 85 ? 'High usage' : 'Normal'}
                </div>
              </CardContent>
            </Card>

            {/* Server Resource Usage Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Server Resource Usage</CardTitle>
                <CardDescription>Real-time CPU, Memory, and Disk usage by server</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={webdockResourceUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="server" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cpu" fill="#8884d8" name="CPU %" />
                    <Bar dataKey="memory" fill="#82ca9d" name="Memory %" />
                    <Bar dataKey="disk" fill="#ffc658" name="Disk %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Server Status Table */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Server Status</CardTitle>
                <CardDescription>Current status of all servers</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Server</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>CPU</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webdockServerStatus?.map((server, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{server.name}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              server.status === 'online' 
                                ? 'bg-green-100 text-green-800' 
                                : server.status === 'offline'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {server.status}
                            </span>
                          </TableCell>
                          <TableCell>{server.cpu.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
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
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{webdockOverviewStats?.criticalAlerts || 0}</div>
                <div className="text-sm text-gray-600">Require immediate attention</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-yellow-500" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{webdockOverviewStats?.activeAlerts || 0}</div>
                <div className="text-sm text-gray-600">All active notifications</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ServerIcon className="h-5 w-5 text-red-500" />
                  Offline Servers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{webdockOverviewStats?.offlineServers || 0}</div>
                <div className="text-sm text-gray-600">Servers currently down</div>
              </CardContent>
            </Card>

            {/* Webdock Server Alerts */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Webdock Server Alerts</CardTitle>
                <CardDescription>Real-time alerts from your Webdock servers</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {webdockSystemAlerts?.length > 0 ? (
                    webdockSystemAlerts.map((alert) => (
                      <div key={alert.id} className="mb-4 flex items-center space-x-4 p-3 border rounded-lg">
                        {alert.severity === "critical" && <AlertCircleIcon className="h-6 w-6 text-red-500" />}
                        {alert.severity === "high" && <AlertCircleIcon className="h-6 w-6 text-orange-500" />}
                        {alert.severity === "medium" && <AlertCircleIcon className="h-6 w-6 text-yellow-500" />}
                        {alert.severity === "low" && <BellIcon className="h-6 w-6 text-blue-500" />}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{alert.message}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              alert.severity === 'critical' 
                                ? 'bg-red-100 text-red-800' 
                                : alert.severity === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : alert.severity === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {alert.type} • {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <CheckCircleIcon className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>No active server alerts</p>
                      <p className="text-sm">All systems are running normally</p>
                    </div>
                  )}
                </ScrollArea>
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