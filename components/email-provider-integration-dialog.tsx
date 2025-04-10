'use client'

import { useState } from 'react'
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth'
// import { auth } from '@/lib/firebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert'
// import { useEffect } from 'react'

export default function LinkEmailPasswordModal({ user }: { user: any }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [linked, setLinked] = useState(false)

  const handleLink = async () => {
        setError('')
        try {
        const credential = EmailAuthProvider.credential(email, password)
        await linkWithCredential(user, credential)
        setLinked(true)
        } catch (err: any) {
        console.error(err)
        setError('关联失败：' + err.message)
        }
    }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">关联 Email/密码 帐号</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>关联 Email/密码</DialogTitle>
          <DialogDescription>
            输入您要关联的邮箱和密码。
          </DialogDescription>
        </DialogHeader>

        {linked ? (
          <Alert>
            <AlertTitle>关联成功</AlertTitle>
            <AlertDescription>您的帐户已成功关联 Email/密码 登录方式。</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" onClick={handleLink}>
              关联
            </Button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => {
            setEmail('')
            setPassword('')
            setError('')
            setLinked(false)
          }}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
