import type { DashboardSummary } from '../types/index.js';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    // Return comprehensive dashboard data matching frontend expectations
    return {
      // Original fields
      activeAlerts: 3,
      healthyBirdRatio: 91.4,
      feedEfficiency: 87.9,
      pendingTreatments: 5,
      recentDetections: [
        { disease: 'Coccidiosis', confidence: 0.82, timestamp: new Date().toISOString() },
        { disease: 'Respiratory stress', confidence: 0.67, timestamp: new Date(Date.now() - 86_400_000).toISOString() },
      ],
      
      // Extended fields for frontend dashboard
      stats: [
        { 
          label: 'Active Flocks', 
          value: '12', 
          subtext: '+2 this week', 
          trend: 'up' 
        },
        { 
          label: 'Health Score', 
          value: '94%', 
          subtext: 'Excellent condition', 
          trend: 'stable' 
        },
        { 
          label: 'Pending Tasks', 
          value: '6', 
          subtext: '2 urgent', 
          trend: 'down' 
        }
      ],
      
      alerts: [
        {
          id: 'alert-1',
          title: 'Temperature Alert - Coop 3',
          badge: 'Critical',
          note: 'Temperature above 32°C threshold. Immediate ventilation required.',
          severity: 'critical',
          timestamp: new Date().toISOString(),
          actionRequired: true,
          category: 'environment'
        },
        {
          id: 'alert-2',
          title: 'Vaccination Due',
          badge: 'Warning',
          note: 'Batch B-204 vaccination scheduled for tomorrow.',
          severity: 'warning',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          actionRequired: true,
          category: 'vaccination'
        },
        {
          id: 'alert-3',
          title: 'Feed Stock Low',
          badge: 'Info',
          note: 'Feed inventory below 20%. Reorder recommended.',
          severity: 'info',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          actionRequired: false,
          category: 'feed'
        }
      ],
      
      tasks: [
        {
          id: 'task-1',
          title: 'Check vaccination schedule for Batch B-204',
          priority: 'high',
          completed: false,
          category: 'health',
          dueDate: new Date(Date.now() + 86400000).toISOString()
        },
        {
          id: 'task-2',
          title: 'Inspect ventilation system in Coop 3',
          priority: 'high',
          completed: false,
          category: 'maintenance',
          dueDate: new Date().toISOString()
        },
        {
          id: 'task-3',
          title: 'Order feed supplies',
          priority: 'medium',
          completed: false,
          category: 'operations',
          dueDate: new Date(Date.now() + 172800000).toISOString()
        },
        {
          id: 'task-4',
          title: 'Review weekly health reports',
          priority: 'low',
          completed: false,
          category: 'admin',
          dueDate: new Date(Date.now() + 259200000).toISOString()
        }
      ],
      
      weeklyTrend: [
        { day: 'Mon', value: 85 },
        { day: 'Tue', value: 88 },
        { day: 'Wed', value: 90 },
        { day: 'Thu', value: 87 },
        { day: 'Fri', value: 92 },
        { day: 'Sat', value: 94 },
        { day: 'Sun', value: 91 }
      ],
      
      activities: [
        {
          id: 'activity-1',
          title: 'Health check completed for Coop 1',
          meta: 'All birds healthy',
          timestamp: new Date(Date.now() - 1440000).toISOString(),
          type: 'note'
        },
        {
          id: 'activity-2',
          title: 'Consultation with Dr. Ananya Kulkarni',
          meta: 'Discussed vaccination protocol',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'consultation'
        },
        {
          id: 'activity-3',
          title: 'Treatment protocol updated',
          meta: 'Batch B-203',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: 'protocol'
        },
        {
          id: 'activity-4',
          title: 'Weekly report generated',
          meta: 'Farm performance summary',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          type: 'report'
        }
      ],
      
      chartData: [
        { label: 'Feed', value: 45, color: '#3b82f6', description: 'Feed costs and efficiency' },
        { label: 'Growth', value: 30, color: '#14b8a6', description: 'Bird growth and weight gain' },
        { label: 'Health', value: 25, color: '#f59e0b', description: 'Health monitoring and treatments' }
      ]
    };
  },
};
