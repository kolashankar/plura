import EnhancedUserManagement from '../_components/enhanced-user-management'

const AdminEnhancedUserManagementPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Enhanced User Management</h1>
        <p className="text-muted-foreground">
          Manage users, plans, and create individual feature overrides. Control exactly what each user can access.
        </p>
      </div>
      
      <EnhancedUserManagement />
    </div>
  )
}

export default AdminEnhancedUserManagementPage