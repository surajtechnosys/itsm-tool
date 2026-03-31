import { redirect } from 'next/navigation'
import React from 'react'

const AdminPage = () => {
    redirect("/admin/dashboard")
  return (
    <div>AdminPage</div>
  )
}

export default AdminPage