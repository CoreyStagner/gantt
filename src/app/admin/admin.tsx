export const AdminPage: React.FC = () => {

  return (
    <div className="admin-page">
      <h2>Admin Page</h2>
      <p>This page is only accessible to admin users.</p>
      <a href="/dashboard">Go back to dashboard</a>
    </div>
  )
}