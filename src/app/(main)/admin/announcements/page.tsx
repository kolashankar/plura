import AnnouncementsManager from '../_components/announcements-manager'

const AdminAnnouncementsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">
          Create and manage platform-wide announcements
        </p>
      </div>
      
      <AnnouncementsManager />
    </div>
  )
}

export default AdminAnnouncementsPage