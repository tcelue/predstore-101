'use client'

import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
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

export default function ForgotPasswordModal() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async () => {
    setError('')
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      console.error(err)
      setError('发送失败，请检查邮箱是否正确或稍后再试。')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0 text-sm text-blue-600 hover:underline">
          忘记密码？
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>找回密码</DialogTitle>
          <DialogDescription>
            请输入注册时使用的邮箱地址，我们将发送重置链接。
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <Alert>
            <AlertTitle>邮件已发送</AlertTitle>
            <AlertDescription>请检查您的邮箱并点击链接重置密码。</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="请输入您的邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" onClick={handleReset}>
              发送重置链接
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => {
            setSent(false)
            setEmail('')
            setError('')
          }}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
