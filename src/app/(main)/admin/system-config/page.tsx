import SystemConfigManager from '../_components/system-config-manager'

const AdminSystemConfigPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">System Configuration</h1>
        <p className="text-muted-foreground">
          Manage global system settings and configurations
        </p>
      </div>
      
      <SystemConfigManager />
    </div>
  )
}

export default AdminSystemConfigPage