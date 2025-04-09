'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { FcGoogle } from 'react-icons/fc'
import { createUserProfileIfNotExists } from '@/lib/firestore'

const formSchema = z
  .object({
    email: z.string().email({ message: '请输入有效的电子邮件地址' }),
    password: z.string().min(6, { message: '密码至少需要6个字符' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof formSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [firebaseError, setFirebaseError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setFirebaseError('')
    try {
     
      const user = await signUpWithEmail(data.email, data.password)
      await createUserProfileIfNotExists(user)
      setSuccessMessage('注册成功！请检查您的邮箱并点击验证链接以激活账号。')
      // router.push('/')
    } catch (err) {
      console.error(err)
      setFirebaseError('注册失败。该电子邮件可能已被使用。')
    }
  }

  const handleGoogleRegister = async () => {
    setFirebaseError('')
    try {
      const user = await signInWithGoogle()
      await createUserProfileIfNotExists(user)
      router.push('/')
    } catch (err) {
      console.error(err)
      setFirebaseError('使用 Google 注册失败，请稍后再试。')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold text-center">注册账号</h2>

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

        <div>
          <Label htmlFor="confirmPassword">确认密码</Label>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full">
          注册
        </Button>

        {successMessage && (
          <p className="text-sm text-green-600 text-center mt-2">{successMessage}</p>
        )}
        
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm text-muted-foreground bg-white px-2">
          或使用第三方注册
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleRegister}
      >
        <FcGoogle className="text-xl" />
        使用 Google 注册
      </Button>

      {firebaseError && (
        <p className="text-sm text-red-500 text-center mt-2">{firebaseError}</p>
      )}
    </div>
  )
}
