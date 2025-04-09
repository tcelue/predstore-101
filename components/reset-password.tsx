'use client'

import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// export default function ResetPasswordModal() {
export default function ResetPasswordModal({ email = '' }: { email?: string }) {
  const [inputEmail, setEmail] = useState(email)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async () => {
    setError('')
    try {
      await sendPasswordResetEmail(auth, inputEmail)
      setSent(true)
    } catch (err: any) {
      console.error(err)
      setError('发送失败，请检查邮箱是否正确或稍后再试。')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">修改密码</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>重置密码</DialogTitle>
          <DialogDescription>
            输入您的邮箱地址，我们将发送一个重置链接给您。
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
              value={inputEmail}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" onClick={handleReset}>
              发送重置链接
            </Button>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => { setSent(false); setEmail(''); setError(''); }}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
