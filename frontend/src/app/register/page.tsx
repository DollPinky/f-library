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
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  GraduationCap,
  Building,
  Calendar,
  Shield,
  CheckCircle
} from 'lucide-react'
import { authAPI, campusesAPI, librariesAPI } from '@/lib/api'
import { Campus, Library } from '@/types'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(20, 'Tên đăng nhập không quá 20 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa chữ hoa, chữ thường và số'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Số điện thoại không hợp lệ'),
  studentId: z.string().optional(),
  faculty: z.string().optional(),
  major: z.string().optional(),
  year: z.number().min(1).max(6).optional(),
  campusId: z.number().optional(),
  libraryId: z.number().optional(),
  role: z.enum(['READER', 'LIBRARIAN', 'MANAGER']),
  agreeToTerms: z.boolean().refine(val => val === true, 'Bạn phải đồng ý với điều khoản sử dụng')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [libraries, setLibraries] = useState<Library[]>([])
  const [selectedCampus, setSelectedCampus] = useState<number | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'READER',
      agreeToTerms: false
    }
  })

  const watchedCampus = watch('campusId')

  // Load campuses and libraries
  useState(() => {
    const loadData = async () => {
      try {
        const [campusesRes, librariesRes] = await Promise.all([
          campusesAPI.getCampuses(),
          librariesAPI.getLibraries()
        ])
        setCampuses(campusesRes.data || [])
        setLibraries(librariesRes.data || [])
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      // Cấu trúc JSON cho backend
      const registerData = {
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        studentId: data.studentId || null,
        faculty: data.faculty || null,
        major: data.major || null,
        year: data.year || null,
        campusId: data.campusId || null,
        libraryId: data.libraryId || null,
        role: data.role,
        isActive: true,
        profile: {
          studentId: data.studentId,
          faculty: data.faculty,
          major: data.major,
          year: data.year,
          campusId: data.campusId,
          libraryId: data.libraryId
        }
      }

      console.log('Register Data for Backend:', JSON.stringify(registerData, null, 2))

      // Gọi API đăng ký
      const response = await authAPI.register(registerData)
      
      if (response.success) {
        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.')
        router.push('/login')
      } else {
        toast.error(response.message || 'Đăng ký thất bại')
      }
    } catch (error: any) {
      console.error('Register error:', error)
      toast.error(error.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCampusChange = (campusId: number) => {
    setValue('campusId', campusId)
    setValue('libraryId', null) // Reset library when campus changes
    setSelectedCampus(campusId)
  }

  const filteredLibraries = libraries.filter(lib => 
    !selectedCampus || lib.campusId === selectedCampus
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đăng ký tài khoản
            </h1>
            <p className="text-gray-600">
              Tham gia hệ thống quản lý thư viện đại học
            </p>
          </div>

          {/* Registration Form */}
          <Card className="card-modern shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Thông tin đăng ký</CardTitle>
              <p className="text-gray-600">Vui lòng điền đầy đủ thông tin bên dưới</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Thông tin tài khoản
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đăng nhập *
                      </label>
                      <Input
                        placeholder="Nhập tên đăng nhập"
                        {...register('username')}
                        className={errors.username ? 'border-red-500' : ''}
                      />
                      {errors.username && (
                        <div className="flex items-center text-sm text-red-600 mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.username.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="example@university.edu.vn"
                        {...register('email')}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <div className="flex items-center text-sm text-red-600 mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu *
                      </label>
                      <div className="relative">
                        <Input
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
                        <div className="flex items-center text-sm text-red-600 mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.password.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu *
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Nhập lại mật khẩu"
                          {...register('confirmPassword')}
                          className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <div className="flex items-center text-sm text-red-600 mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.confirmPassword.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Thông tin cá nhân
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <Input
                        placeholder="Nguyễn Văn A"
                        {...register('fullName')}
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && (
                        <div className="flex items-center text-sm text-red-600 mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.fullName.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <Input
                        placeholder="0123456789"
                        {...register('phone')}
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <div className="flex items-center text-sm text-red-600 mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.phone.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                    Thông tin học tập
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã sinh viên
                      </label>
                      <Input
                        placeholder="SV00123456"
                        {...register('studentId')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Khoa
                      </label>
                      <Input
                        placeholder="Công nghệ thông tin"
                        {...register('faculty')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chuyên ngành
                      </label>
                      <Input
                        placeholder="Kỹ thuật phần mềm"
                        {...register('major')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Năm học
                      </label>
                      <select
                        {...register('year', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Chọn năm học</option>
                        <option value={1}>Năm 1</option>
                        <option value={2}>Năm 2</option>
                        <option value={3}>Năm 3</option>
                        <option value={4}>Năm 4</option>
                        <option value={5}>Năm 5</option>
                        <option value={6}>Năm 6</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Campus & Library Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-orange-600" />
                    Phân hiệu & Thư viện
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phân hiệu
                      </label>
                      <select
                        {...register('campusId', { valueAsNumber: true })}
                        onChange={(e) => handleCampusChange(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Chọn phân hiệu</option>
                        {campuses.map((campus) => (
                          <option key={campus.id} value={campus.id}>
                            {campus.name} - {campus.city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thư viện
                      </label>
                      <select
                        {...register('libraryId', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={!selectedCampus}
                      >
                        <option value="">Chọn thư viện</option>
                        {filteredLibraries.map((library) => (
                          <option key={library.id} value={library.id}>
                            {library.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-red-600" />
                    Vai trò trong hệ thống
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="relative">
                      <input
                        type="radio"
                        value="READER"
                        {...register('role')}
                        className="sr-only"
                      />
                      <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-500 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full hidden"></div>
                          </div>
                          <div>
                            <div className="font-medium">Độc giả</div>
                            <div className="text-sm text-gray-500">Sinh viên, giảng viên</div>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="relative">
                      <input
                        type="radio"
                        value="LIBRARIAN"
                        {...register('role')}
                        className="sr-only"
                      />
                      <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-500 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full hidden"></div>
                          </div>
                          <div>
                            <div className="font-medium">Thủ thư</div>
                            <div className="text-sm text-gray-500">Quản lý mượn/trả</div>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="relative">
                      <input
                        type="radio"
                        value="MANAGER"
                        {...register('role')}
                        className="sr-only"
                      />
                      <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-500 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full hidden"></div>
                          </div>
                          <div>
                            <div className="font-medium">Quản lý</div>
                            <div className="text-sm text-gray-500">Quản lý thư viện</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('agreeToTerms')}
                      className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div className="text-sm text-gray-600">
                      Tôi đồng ý với{' '}
                      <Link href="/terms" className="text-green-600 hover:text-green-700 underline">
                        Điều khoản sử dụng
                      </Link>
                      {' '}và{' '}
                      <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">
                        Chính sách bảo mật
                      </Link>
                      {' '}của hệ thống
                    </div>
                  </label>
                  {errors.agreeToTerms && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.agreeToTerms.message}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang đăng ký...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Đăng ký tài khoản
                    </div>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link
                    href="/login"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 