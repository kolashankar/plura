import PlanManagementDashboard from '../_components/plan-management-dashboard'

const AdminPlanManagementPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Plan Management</h1>
        <p className="text-muted-foreground">
          Control subscription plan features and limits. Toggle features on/off for each plan tier.
        </p>
      </div>
      
      <PlanManagementDashboard />
    </div>
  )
}

export default AdminPlanManagementPage