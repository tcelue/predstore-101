import { setDoc, doc , serverTimestamp} from 'firebase/firestore'
import { db } from './firebase'


export async function createUserProfileIfNotExists(user: any) {
  const ref = doc(db, 'users', user.uid)

  await setDoc(
    ref,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      bio: '',
      emailVerified: user.emailVerified,
      provider: user.providerData[0]?.providerId || 'unknown',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}