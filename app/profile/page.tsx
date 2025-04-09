// import { getAuth } from 'firebase/auth'
// import { cookies } from 'next/headers'
import ProfileClient from '@/components/shared/profile'

export default async function ProfilePage() {
  // 🔐 You could add cookie-based check for user session
//   const cookieStore = cookies()
//   const authToken = cookieStore.get('__session')?.value // Or your custom session key

  // Just render the client component where logic runs
  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">个人资料</h2>
      <ProfileClient />
    </div>
  )
}
