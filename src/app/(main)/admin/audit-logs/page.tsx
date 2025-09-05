import AuditLogsViewer from '../_components/audit-logs-viewer'

const AdminAuditLogsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">
          Track all administrative actions and system changes
        </p>
      </div>
      
      <AuditLogsViewer />
    </div>
  )
}

export default AdminAuditLogsPage