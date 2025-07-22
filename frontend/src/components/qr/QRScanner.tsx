'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  QrCode,
  Camera,
  CameraOff,
  RotateCcw,
  CheckCircle,
  X,
  AlertCircle,
  BookOpen,
  User,
  Calendar,
  MapPin,
  Library,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react'
import { bookCopiesAPI, borrowingsAPI, usersAPI } from '@/lib/api'
import { BookCopy, User as UserType, Borrowing } from '@/types'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface QRScannerProps {
  mode: 'borrow' | 'return' | 'scan'
  onSuccess?: (data: any) => void
  onClose?: () => void
}

export default function QRScanner({ mode, onSuccess, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string>('')
  const [currentBookCopy, setCurrentBookCopy] = useState<BookCopy | null>(null)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanHistory, setScanHistory] = useState<string[]>([])
  const [error, setError] = useState<string>('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isScanning) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isScanning])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      
      setError('')
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.')
      toast.error('Không thể truy cập camera')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const toggleScanning = () => {
    setIsScanning(!isScanning)
    setScannedData('')
    setCurrentBookCopy(null)
    setCurrentUser(null)
    setError('')
  }

  const handleScan = async (qrData: string) => {
    if (scannedData === qrData) return // Prevent duplicate scans
    
    setScannedData(qrData)
    setScanHistory(prev => [...prev, qrData])
    setIsProcessing(true)
    
    try {
      // Simulate QR code processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Parse QR data (assuming format: "BOOK_COPY:123" or "USER:456")
      const [type, id] = qrData.split(':')
      
      if (type === 'BOOK_COPY') {
        await handleBookCopyScan(Number(id))
      } else if (type === 'USER') {
        await handleUserScan(Number(id))
      } else {
        setError('QR code không hợp lệ')
        toast.error('QR code không hợp lệ')
      }
    } catch (error) {
      console.error('Error processing QR code:', error)
      setError('Không thể xử lý QR code')
      toast.error('Không thể xử lý QR code')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBookCopyScan = async (copyId: number) => {
    try {
      const response = await bookCopiesAPI.getBookCopy(copyId)
      const bookCopy = response.data
      
      setCurrentBookCopy(bookCopy)
      
             if (mode === 'return') {
         // Check if this copy is currently borrowed
         const borrowingResponse = await borrowingsAPI.getBorrowings({ 
           status: 'BORROWED' 
         })
         
         if (borrowingResponse.content && borrowingResponse.content.length > 0) {
           const borrowing = borrowingResponse.content.find(b => b.bookCopy?.id === copyId)
           if (borrowing?.reader) {
             setCurrentUser(borrowing.reader)
           } else {
             setError('Bản sao này không được mượn')
             toast.error('Bản sao này không được mượn')
           }
         } else {
           setError('Bản sao này không được mượn')
           toast.error('Bản sao này không được mượn')
         }
       }
      
      toast.success(`Đã quét sách: ${bookCopy.book?.title}`)
    } catch (error) {
      console.error('Error fetching book copy:', error)
      setError('Không thể tìm thấy bản sao sách')
      toast.error('Không thể tìm thấy bản sao sách')
    }
  }

  const handleUserScan = async (userId: number) => {
    try {
      const response = await usersAPI.getUser(userId)
      const user = response.data
      
      setCurrentUser(user)
      toast.success(`Đã quét độc giả: ${user.fullName}`)
    } catch (error) {
      console.error('Error fetching user:', error)
      setError('Không thể tìm thấy độc giả')
      toast.error('Không thể tìm thấy độc giả')
    }
  }

  const handleBorrow = async () => {
    if (!currentBookCopy || !currentUser) {
      toast.error('Vui lòng quét cả sách và độc giả')
      return
    }

    if (currentBookCopy.status !== 'AVAILABLE') {
      toast.error('Sách không có sẵn để mượn')
      return
    }

    setIsProcessing(true)
    try {
      const response = await borrowingsAPI.createBorrowing({
        bookCopyId: currentBookCopy.id,
        readerId: currentUser.id,
        borrowDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        status: 'BORROWED'
      })

      if (response.success) {
        toast.success('Mượn sách thành công!')
        onSuccess?.(response.data)
        resetScanner()
      }
    } catch (error) {
      console.error('Error creating borrowing:', error)
      toast.error('Không thể mượn sách')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReturn = async () => {
    if (!currentBookCopy || !currentUser) {
      toast.error('Vui lòng quét cả sách và độc giả')
      return
    }

    setIsProcessing(true)
    try {
       const borrowingResponse = await borrowingsAPI.getBorrowings({ 
         status: 'BORROWED' 
       })
      
      if (borrowingResponse.content && borrowingResponse.content.length > 0) {
        const borrowing = borrowingResponse.content[0]
        
                 const response = await borrowingsAPI.returnBook(borrowing.id)

        if (response.success) {
          toast.success('Trả sách thành công!')
          onSuccess?.(response.data)
          resetScanner()
        }
      } else {
        toast.error('Không tìm thấy giao dịch mượn sách')
      }
    } catch (error) {
      console.error('Error returning book:', error)
      toast.error('Không thể trả sách')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetScanner = () => {
    setScannedData('')
    setCurrentBookCopy(null)
    setCurrentUser(null)
    setError('')
    setScanHistory([])
  }

  const getModeTitle = () => {
    switch (mode) {
      case 'borrow':
        return 'Mượn sách'
      case 'return':
        return 'Trả sách'
      case 'scan':
        return 'Quét QR'
      default:
        return 'QR Scanner'
    }
  }

  const getModeDescription = () => {
    switch (mode) {
      case 'borrow':
        return 'Quét QR code sách và độc giả để mượn sách'
      case 'return':
        return 'Quét QR code sách để trả sách'
      case 'scan':
        return 'Quét QR code để xem thông tin'
      default:
        return 'Quét QR code'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="card-modern w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2 text-green-600" />
              {getModeTitle()}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {getModeDescription()}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Camera View */}
          <div className="relative">
            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
              {isScanning ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Camera chưa được kích hoạt</p>
                    <p className="text-sm text-gray-400">Nhấn nút bên dưới để bắt đầu</p>
                  </div>
                </div>
              )}
              
              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-green-500 rounded-lg relative">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>
                  </div>
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Scanned Data Display */}
          {scannedData && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-900">Đã quét:</span>
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">{scannedData}</code>
              </div>
              
              {/* Book Copy Info */}
              {currentBookCopy && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">{currentBookCopy.book?.title}</span>
                    <Badge className={currentBookCopy.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {currentBookCopy.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{currentBookCopy.library?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Library className="h-3 w-3" />
                      <span>{currentBookCopy.location}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* User Info */}
              {currentUser && (
                <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{currentUser.fullName}</span>
                    <Badge className="bg-blue-100 text-blue-800">{currentUser.role}</Badge>
                  </div>
                                     <div className="text-xs text-gray-600">
                     {currentUser.email && `Email: ${currentUser.email}`}
                   </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={isScanning ? "destructive" : "default"}
                onClick={toggleScanning}
                disabled={isProcessing}
              >
                {isScanning ? (
                  <>
                    <CameraOff className="h-4 w-4 mr-2" />
                    Dừng quét
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Bắt đầu quét
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={resetScanner}
                disabled={isProcessing}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
            </div>

            {/* Mode-specific actions */}
            {mode === 'borrow' && currentBookCopy && currentUser && (
              <Button
                onClick={handleBorrow}
                disabled={isProcessing || currentBookCopy.status !== 'AVAILABLE'}
                className="btn-primary"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Mượn sách
                  </>
                )}
              </Button>
            )}

            {mode === 'return' && currentBookCopy && currentUser && (
              <Button
                onClick={handleReturn}
                disabled={isProcessing}
                className="btn-primary"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Trả sách
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Lịch sử quét:</h4>
              <div className="space-y-1">
                {scanHistory.slice(-3).map((data, index) => (
                  <div key={index} className="text-xs text-gray-600 font-mono">
                    {data}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 