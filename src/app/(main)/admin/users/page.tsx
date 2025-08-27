
import AdminUsersTable from '../_components/admin-users-table'

const AdminUsersPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage platform users, roles, and permissions
        </p>
      </div>
      
      <AdminUsersTable />
    </div>
  )
}

export default AdminUsersPage
