import AgenciesTable from '../_components/agencies-table'

const AdminAgenciesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Agency Management</h1>
        <p className="text-muted-foreground">
          Manage agencies, view details, and oversee platform usage
        </p>
      </div>
      
      <AgenciesTable />
    </div>
  )
}

export default AdminAgenciesPage