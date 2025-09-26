'use server'
import { Webdock } from '@webdock/sdk'
// Import the Webdock SDK
// Note: If you get TypeScript errors, make sure you have installed @webdock/sdk


// Re-export types that we'll use (these will be properly typed from the SDK)
export type WebdockServer = {
  id: number
  name: string
  slug: string
  location: string
  ipv4: string
  ipv6: string | null
  status: 'online' | 'offline' | 'maintenance'
  created_at: string
  updated_at: string
  profile: {
    name: string
    cpu_cores: number
    memory_mb: number
    disk_gb: number
    bandwidth_gb: number
  }
}

export type WebdockServerMetrics = {
  server_id: number
  timestamp: string
  cpu_usage_percent: number
  memory_usage_percent: number
  disk_usage_percent: number
  network_in_mbps: number
  network_out_mbps: number
  load_average: number
}

export type WebdockAlert = {
  id: number
  server_id: number
  server_name: string
  type: 'cpu' | 'memory' | 'disk' | 'network' | 'status'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  created_at: string
  resolved_at: string | null
  status: 'active' | 'resolved'
}

export type WebdockBandwidthUsage = {
  server_id: number
  current_month_gb: number
  total_limit_gb: number
  percentage_used: number
}

// Helper function to create Webdock client
function createWebdockClient() {
  const apiKey = process.env.WEBDOCK_API_KEY
  
  if (!apiKey) {
    console.warn('WEBDOCK_API_KEY environment variable is not set')
    throw new Error('Webdock API key is not configured')
  }
  
  return new Webdock(apiKey)
}

// Mock data methods for development/fallback
function getMockServers(): WebdockServer[] {
    return [
      {
        id: 1,
        name: 'Production Server',
        slug: 'prod-server-1',
        location: 'Stockholm',
        ipv4: '192.168.1.100',
        ipv6: null,
        status: 'online',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        profile: {
          name: 'Standard',
          cpu_cores: 4,
          memory_mb: 8192,
          disk_gb: 160,
          bandwidth_gb: 1000
        }
      },
      {
        id: 2,
        name: 'Development Server',
        slug: 'dev-server-1',
        location: 'Stockholm',
        ipv4: '192.168.1.101',
        ipv6: null,
        status: 'online',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        profile: {
          name: 'Basic',
          cpu_cores: 2,
          memory_mb: 4096,
          disk_gb: 80,
          bandwidth_gb: 500
        }
      }
    ]
  }

function getMockMetrics(): WebdockServerMetrics[] {
    const now = new Date()
    const metrics = []
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      metrics.push({
        server_id: 1,
        timestamp: timestamp.toISOString(),
        cpu_usage_percent: Math.random() * 80 + 10,
        memory_usage_percent: Math.random() * 70 + 20,
        disk_usage_percent: Math.random() * 50 + 30,
        network_in_mbps: Math.random() * 100,
        network_out_mbps: Math.random() * 100,
        load_average: Math.random() * 2
      })
    }
    return metrics.reverse()
  }

function getMockAlerts(): WebdockAlert[] {
  return [
    {
      id: 1,
      server_id: 1,
      server_name: 'Production Server',
      type: 'cpu',
      severity: 'medium',
      message: 'CPU usage above 75% for 5 minutes',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      resolved_at: null,
      status: 'active'
    }
  ]
}

// Server action functions that can be called from components
export async function getWebdockServers(): Promise<WebdockServer[]> {
  try {
    const client = createWebdockClient()
    const result = await client.servers.list()
    
    if (result.success) {
      // Map the SDK response to our expected format
      return result.response.body.map((server: any) => ({
        id: server.id,
        name: server.name,
        slug: server.slug,
        location: server.location,
        ipv4: server.ipv4,
        ipv6: server.ipv6,
        status: server.status,
        created_at: server.created_at,
        updated_at: server.updated_at,
        profile: {
          name: server.profile?.name || 'Unknown',
          cpu_cores: server.profile?.cpu_cores || 0,
          memory_mb: server.profile?.memory_mb || 0,
          disk_gb: server.profile?.disk_gb || 0,
          bandwidth_gb: server.profile?.bandwidth_gb || 0
        }
      }))
    } else {
      console.error('Failed to fetch Webdock servers:', result)
      return getMockServers() // Fallback to mock data
    }
  } catch (error) {
    console.error('Failed to fetch Webdock servers:', error)
    return getMockServers() // Fallback to mock data
  }
}

export async function getWebdockServerMetrics(serverId: number, hours: number = 24): Promise<WebdockServerMetrics[]> {
  try {
    const client = createWebdockClient()
    // Note: The actual SDK method might be different - we'll need to check the documentation
    // For now, return mock data as fallback
    console.warn('Server metrics endpoint not yet implemented with SDK')
    return getMockMetrics()
  } catch (error) {
    console.error('Failed to fetch Webdock server metrics:', error)
    return getMockMetrics()
  }
}

export async function getWebdockAlerts(serverId?: number): Promise<WebdockAlert[]> {
  try {
    const client = createWebdockClient()
    // Note: The actual SDK method might be different - we'll need to check the documentation
    // For now, return mock data as fallback
    console.warn('Alerts endpoint not yet implemented with SDK')
    return getMockAlerts()
  } catch (error) {
    console.error('Failed to fetch Webdock alerts:', error)
    return getMockAlerts()
  }
}

export async function getWebdockBandwidthUsage(serverId: number): Promise<WebdockBandwidthUsage | null> {
  try {
    const client = createWebdockClient()
    // Note: The actual SDK method might be different - we'll need to check the documentation
    console.warn('Bandwidth usage endpoint not yet implemented with SDK')
    return null
  } catch (error) {
    console.error('Failed to fetch Webdock bandwidth usage:', error)
    return null
  }
}

// Aggregate server overview data
export async function getWebdockOverview() {
  try {
    const servers = await getWebdockServers()
    const alerts = await getWebdockAlerts()
    
    // Calculate aggregate statistics
    const totalServers = servers.length
    const onlineServers = servers.filter(s => s.status === 'online').length
    const offlineServers = servers.filter(s => s.status === 'offline').length
    const activeAlerts = alerts.filter(a => a.status === 'active').length
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length

    // For now, use mock data for metrics until we implement the actual SDK methods
    const mockMetrics = getMockMetrics()
    const avgCpuUsage = mockMetrics.length > 0 
      ? mockMetrics.reduce((sum, metric) => sum + metric.cpu_usage_percent, 0) / mockMetrics.length
      : 0
    const avgMemoryUsage = mockMetrics.length > 0 
      ? mockMetrics.reduce((sum, metric) => sum + metric.memory_usage_percent, 0) / mockMetrics.length
      : 0
    const avgDiskUsage = mockMetrics.length > 0 
      ? mockMetrics.reduce((sum, metric) => sum + metric.disk_usage_percent, 0) / mockMetrics.length
      : 0

    return {
      totalServers,
      onlineServers,
      offlineServers,
      activeAlerts,
      criticalAlerts,
      avgCpuUsage: Math.round(avgCpuUsage * 100) / 100,
      avgMemoryUsage: Math.round(avgMemoryUsage * 100) / 100,
      avgDiskUsage: Math.round(avgDiskUsage * 100) / 100,
      servers,
      recentAlerts: alerts.slice(0, 10) // Last 10 alerts
    }
  } catch (error) {
    console.error('Failed to fetch Webdock overview:', error)
    // Return mock data as fallback
    const mockServers = getMockServers()
    const mockAlerts = getMockAlerts()
    const mockMetrics = getMockMetrics()
    
    return {
      totalServers: mockServers.length,
      onlineServers: mockServers.filter(s => s.status === 'online').length,
      offlineServers: mockServers.filter(s => s.status === 'offline').length,
      activeAlerts: mockAlerts.filter(a => a.status === 'active').length,
      criticalAlerts: mockAlerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
      avgCpuUsage: 45.2,
      avgMemoryUsage: 62.8,
      avgDiskUsage: 38.5,
      servers: mockServers,
      recentAlerts: mockAlerts
    }
  }
}
