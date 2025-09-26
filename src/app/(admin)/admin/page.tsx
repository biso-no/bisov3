import { Suspense } from 'react'
import AdminDashboard from '@/components/dashboard'
import { getPageViews, getUserDistribution, getUserGrowth, getTrafficSources, getRecentActivities, getSystemAlerts, getPostEngagement, getAudienceGrowth, getRevenueByProduct, getExpenseCategories, getJobApplications, getEmployeeDistribution, getWebdockServerStatus, getWebdockResourceUsage, getWebdockSystemAlerts, getWebdockOverviewStats } from '@/lib/actions/admin-dashboard'

export default async function DashboardPage() {
  const [
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
  ] = await Promise.all([
    getPageViews(),
    getUserDistribution(),
    getUserGrowth(),
    getTrafficSources(),
    getRecentActivities(),
    getSystemAlerts(),
    getPostEngagement(),
    getAudienceGrowth(),
    getRevenueByProduct(),
    getExpenseCategories(),
    getJobApplications(),
    getEmployeeDistribution(),
    getWebdockServerStatus(),
    getWebdockResourceUsage(),
    getWebdockSystemAlerts(),
    getWebdockOverviewStats()
  ])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboard
        pageViews={pageViews}
        userDistribution={userDistribution}
        userGrowth={userGrowth}
        trafficSources={trafficSources}
        recentActivities={recentActivities}
        systemAlerts={systemAlerts}
        postEngagement={postEngagement}
        audienceGrowth={audienceGrowth}
        revenueByProduct={revenueByProduct}
        expenseCategories={expenseCategories}
        jobApplications={jobApplications}
        employeeDistribution={employeeDistribution}
        webdockServerStatus={webdockServerStatus}
        webdockResourceUsage={webdockResourceUsage}
        webdockSystemAlerts={webdockSystemAlerts}
        webdockOverviewStats={webdockOverviewStats}
      />
    </Suspense>
  )
}