'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  username: z.string().min(1, 'Tên đăng nhập là bắt buộc'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(data.username, data.password)
      
      if (response.success) {
        login(response.data.user, response.data.token)
        toast.success('Đăng nhập thành công!')
        
        if (response.data.user.role === 'ADMIN') {
          router.push('/admin')
        } else if (response.data.user.role === 'LIBRARIAN') {
          router.push('/admin/borrowings')
        } else {
          router.push('/books')
        }
      } else {
        toast.error(response.message || 'Đăng nhập thất bại')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Đăng nhập
          </h1>
          <p className="text-gray-600 mt-2">
            Hệ thống quản lý thư viện đại học
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              Đăng nhập vào tài khoản
            </CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Nhập thông tin đăng nhập của bạn
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  {...register('username')}
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.username.message}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    {...register('password')}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password.message}
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">hoặc</span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">Tài khoản demo:</p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Admin:</strong> admin / password
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Librarian:</strong> librarian / password
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Reader:</strong> reader / password
                </div>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 Hệ thống quản lý thư viện. Bảo mật thông tin.
          </p>
        </div>
      </div>
    </div>
  )
} 