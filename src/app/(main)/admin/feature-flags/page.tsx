import FeatureFlagsManager from '../_components/feature-flags-manager'

const AdminFeatureFlagsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Feature Flags</h1>
        <p className="text-muted-foreground">
          Control feature rollouts and manage experimental features
        </p>
      </div>
      
      <FeatureFlagsManager />
    </div>
  )
}

export default AdminFeatureFlagsPage