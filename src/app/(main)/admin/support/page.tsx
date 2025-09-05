import SupportTicketsTable from '../_components/support-tickets-table'

const AdminSupportPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Support Management</h1>
        <p className="text-muted-foreground">
          Manage support tickets, assign agents, and track resolutions
        </p>
      </div>
      
      <SupportTicketsTable />
    </div>
  )
}

export default AdminSupportPage