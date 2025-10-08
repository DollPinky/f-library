import { useForm } from 'react-hook-form'
import { LockKeyhole } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import type { LoginRequest } from '@/types/authTypes'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  LOGIN_EMAIL_REQUIRED,
  LOGIN_PASSWORD_REQUIRED,
  LOGIN_EMAIL_INVALID,
  LOGIN_PASSWORD_INVALID
} from '@/utils/validator'

interface LoginFormData {
  email: string
  password: string
}

function LoginForm() {
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      const credentials: LoginRequest = {
        email: data.email,
        password: data.password
      }

      await login(credentials)
      toast.success('Đăng nhập thành công!')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Đăng nhập thất bại'
      toast.error(errorMessage)
    }
  }

  return (
    <Card className="w-full max-w-2xl shadow-2xl p-8">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary rounded-full">
            <LockKeyhole className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
        <CardDescription className="text-base">
          Enter your credentials to access admin dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              autoFocus
              className={`h-12 text-base placeholder:text-base ${
                errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              {...register('email', {
                required: LOGIN_EMAIL_REQUIRED,
                pattern: { value: EMAIL_RULE, message: LOGIN_EMAIL_INVALID }
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className={`h-12 text-base placeholder:text-base ${
                errors.password
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : ''
              }`}
              {...register('password', {
                required: LOGIN_PASSWORD_REQUIRED,
                pattern: {
                  value: PASSWORD_RULE,
                  message: LOGIN_PASSWORD_INVALID
                }
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="font-medium">Library Management System</p>
          <p className="mt-1">Admin Access Only</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default LoginForm
