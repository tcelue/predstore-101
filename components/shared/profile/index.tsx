'use client'

import { useEffect, useState } from 'react'
import {
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail, 
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithPopup,
  linkWithCredential
} from 'firebase/auth'

import { doc, setDoc,  getDoc } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ResetPasswordModal from '@/components/reset-password' 
import { format } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import LinkEmailPasswordModal from '@/components/email-provider-integration-dialog'

export default function ProfileTabs() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [emailSent, setEmailSent] = useState(false)
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [country, setCountry] = useState<string>('')
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    bio: '',
    occupation: '',
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const ref = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          setFormData({
            displayName: data.displayName || '',
            phone: data.phone || '',
            bio: data.bio || '',
            occupation: data.occupation || '',
          })
          if (data.birthDate) setBirthDate(new Date(data.birthDate))
          if (data.country) setCountry(data.country)
        }
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const linkGoogleAccount = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await linkWithPopup(user, provider)
      alert('成功关联 Google 帐号！')
    } catch (err: any) {
      console.error('关联失败', err)
      alert('关联失败：' + err.message)
    }
  }

  const linkEmailPassword = async () => {
    const email = prompt('请输入要关联的邮箱:')
    const password = prompt('请输入密码:')
  
    if (!email || !password) return
  
    const credential = EmailAuthProvider.credential(email, password)
    try {
      await linkWithCredential(user, credential)
      alert('成功关联 Email/密码 帐号！')
    } catch (err: any) {
      console.error('关联失败', err)
      alert('关联失败：' + err.message)
    }
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return
    try {
      await sendPasswordResetEmail(auth, user.email)
      setShowSuccessModal(true)
    } catch (err) {
      console.error(err)
      setShowErrorModal(true)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/login' // or use router.push('/login') if you're using next/router
    } catch (err) {
      console.error('登出失败:', err)
    }
  }

  const handleResendVerification = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user)
        setEmailSent(true)
      } catch (err) {
        console.error(err)
        setShowErrorModal(true)
      }
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)

    try {
      await setDoc(
        ref,
        {
          displayName: formData.displayName,
          phone: formData.phone,
          bio: formData.bio,
          occupation: formData.occupation,
          birthDate: birthDate ? birthDate.toISOString() : '',
          country,
          updatedAt: new Date(),
        },
        { merge: true }
      )
      setShowSuccessModal(true)
    } catch (err) {
      console.error(err)
      setShowErrorModal(true)
    }
  }

  if (loading) return <p className="p-4">加载中...</p>
  if (!user) return <p className="p-4">未登录，请先登录。</p>

  return (
    <div className="max-w-3xl mx-auto p-4">

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="profile">个人讯息</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Input
            placeholder="姓名"
            value={formData.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
          />
          <Input placeholder="电子邮件" value={user.email} disabled />
          <Textarea
            placeholder="个人简介（Bio）"
            className="min-h-[80px]"
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
          />
          <Input
            placeholder="联系电话"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />

          <div>
            <label className="text-sm font-medium block mb-1">出生日期</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {birthDate
                    ? format(birthDate, 'yyyy-MM-dd', { locale: zhCN })
                    : '选择日期'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">国家</label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择国家" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="马来西亚">马来西亚</SelectItem>
                <SelectItem value="中国">中国</SelectItem>
                <SelectItem value="新加坡">新加坡</SelectItem>
                <SelectItem value="美国">美国</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="职业"
            value={formData.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
          />

          <Button onClick={handleSubmit} className="mt-4">
            保存资料
          </Button>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          {!user.emailVerified && (
            <Alert variant="destructive">
              <AlertTitle>邮箱未验证</AlertTitle>
              <AlertDescription>
                您尚未验证您的邮箱，某些功能可能无法使用。
                {!emailSent ? (
                  <div className="mt-2">
                    <Button size="sm" onClick={handleResendVerification}>
                      重新发送验证邮件
                    </Button>
                  </div>
                ) : (
                  <p className="text-green-600 mt-2">验证邮件已发送，请检查邮箱。</p>
                )}
              </AlertDescription>
            </Alert>
          )}
          

          {user?.providerData?.[0]?.providerId === 'password' && (
            <ResetPasswordModal email={user.email} />
          )}

          {user?.providerData?.[0]?.providerId === 'password' && (
            <Button variant="outline" onClick={linkGoogleAccount}>
              关联 Google 帐号
            </Button>
          )}

      {user?.providerData?.[0]?.providerId === 'google.com' && (
        <LinkEmailPasswordModal user={user} />
      )}
          
          <Button variant="outline" onClick={handleLogout}>登出账号</Button>
        </TabsContent>
      </Tabs>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>保存成功</DialogTitle>
            <DialogDescription>您的资料已成功更新。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>保存失败</DialogTitle>
            <DialogDescription>操作未成功，请稍后再试。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowErrorModal(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}