import IndividualsTable from '../_components/individuals-table'

const IndividualsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Individual Management</h1>
        <p className="text-muted-foreground">
          Manage individual accounts, plans, and platform usage
        </p>
      </div>
      
      <IndividualsTable />
    </div>
  )
}

export default IndividualsPage