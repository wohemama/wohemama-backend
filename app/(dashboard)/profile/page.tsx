import { redirect } from 'next/navigation'
import { getCurrentUser } from '../../../utils/session'
import Tabs from './tabs'

export default async function Profile() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  console.log(user)
 return <Tabs user={{name: user.name!, email: user.email!}} website={'smallsticker.com'} />
}
