export const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''
export const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_NAME ||''
export const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID||''
export const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||''
export const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID ||''
export const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||''
export const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASURE_ID || ''


export const NavItems = [
    {
      label: '体育',
      subItems: [
        { label: '足球', href: '/sport/foot-ball' },
        { label: '篮球', href: '/sport/basket' },
        { label: '网球', href: '/sport/tennis' },
      ],
    },
    {
      label: '选举',
      subItems: [
        { label: '美国', href: '/election/us' },
        { label: '英国', href: '/election/uk' },
        { label: '马来西亚', href: '/election/my' },
      ],
    },
    {
      label: '联络',
      href: '/contact',
    },
  ]