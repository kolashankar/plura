import AdminAnalyticsDashboard from '../_components/admin-analytics-dashboard'

const AdminAnalyticsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into platform usage and performance
        </p>
      </div>
      
      <AdminAnalyticsDashboard />
    </div>
  )
}

export default AdminAnalyticsPage