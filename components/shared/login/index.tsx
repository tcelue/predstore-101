'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInWithEmail, signInWithGoogle } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { FcGoogle } from 'react-icons/fc'
import ForgotPasswordModal from '@/components/forgot-password'

const loginSchema = z.object({
  email: z.string().email({ message: '请输入有效的电子邮件地址' }),
  password: z.string().min(6, { message: '密码至少需要6个字符' }),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [firebaseError, setFirebaseError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setFirebaseError('')
    try {
      await signInWithEmail(data.email, data.password)
      router.push('/profile')
    } catch (err) {
      console.error(err)
      setFirebaseError('登录失败。请检查您的账号和密码。')
    }
  }

  const handleGoogleLogin = async () => {
    setFirebaseError('')
    try {
      await signInWithGoogle()
      router.push('/profile')
    } catch (err) {
      console.error(err)
      setFirebaseError('使用 Google 登录失败，请稍后再试。')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold text-center">登录账号</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Label htmlFor="email">电子邮件</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">密码</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full">
          登录
        </Button>
        <div className="text-right">
          <ForgotPasswordModal />
        </div>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm text-muted-foreground bg-white px-2">
          或使用第三方登录
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleLogin}
      >
        <FcGoogle className="text-xl" />
        使用 Google 登录
      </Button>

      {firebaseError && (
        <p className="text-sm text-red-500 text-center mt-2">{firebaseError}</p>
      )}
    </div>
  )
}
