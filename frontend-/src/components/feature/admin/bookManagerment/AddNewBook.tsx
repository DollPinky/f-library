import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useIsMobile } from '@/hooks/use-mobile'
import type {
  Book,
  CreateBookRequest,
  UpdateBookRequest,
  Category
} from '@/types'
import { createBooks, updateBook } from '@/services/bookManagementService'
import { getAllCategories } from '@/services/categoryService'

import { useEffect, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'

interface AddNewBookProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (book: Book) => void
  isEdit: boolean
  editData?: Book | null
}

export default function AddNewBook({
  open,
  isEdit,
  editData,
  onOpenChange,
  onSubmit
}: AddNewBookProps) {
  const [book, setBook] = useState<Book>({
    bookId: '',
    title: '',
    author: '',
    publisher: '',
    year: new Date().getFullYear(),
    description: '',
    bookCoverUrl: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoryId, setCategoryId] = useState<string>('')
  const isMobile = useIsMobile()

  // Fetch categories when component mounts or dialog opens
  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  const fetchCategories = async () => {
    setCategoriesLoading(true)
    try {
      const response = await getAllCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setCategoriesLoading(false)
    }
  }

  useEffect(() => {
    if (isEdit && editData) {
      setBook(editData)
      setCategoryId(editData.category?.categoryId || '')
    } else {
      setBook({
        bookId: `book-${Date.now()}`,
        title: '',
        author: '',
        publisher: '',
        year: new Date().getFullYear(),
        description: '',
        bookCoverUrl: ''
      })
      setCategoryId('')
    }
  }, [isEdit, editData, open])
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBook((prev) => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : value
    }))
  }

  const handleSubmit = async () => {
    if (!categoryId) {
      toast.error('Please select a category')
      return
    }

    setIsLoading(true)
    try {
      if (isEdit && editData?.bookId) {
        // Update existing book
        const updatePayload: UpdateBookRequest = {
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          publishYear: book.year,
          description: book.description,
          bookCover: book.bookCoverUrl,
          categoryId: categoryId
        }
        const response = await updateBook(editData.bookId, updatePayload)
        if (response.success && response.data) {
          onSubmit(response.data)
          toast.success('Đã cập nhật sách thành công')
          onOpenChange(false)
        }
      } else {
        // Create new book
        const createPayload: CreateBookRequest = {
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          publishYear: book.year,
          description: book.description,
          bookCover: book.bookCoverUrl,
          categoryId: categoryId
        }
        const response = await createBooks(createPayload)
        if (response.success && response.data) {
          onSubmit(response.data)
          toast.success('Đã thêm sách thành công')
          onOpenChange(false)
        }
      }
    } catch (error) {
      console.error('Error submitting book:', error)
      toast.error(isEdit ? 'Lỗi khi cập nhật sách' : 'Lỗi khi thêm sách')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${
          isMobile ? 'w-[100vw] h-[60vh] p-6' : 'sm:max-w-[500px]'
        }`}
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Update Book' : 'Add New Book'}</DialogTitle>

          <DialogDescription>
            Fill in the book information and save.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={book.title}
              onChange={handleOnChange}
              placeholder="Enter book title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              value={book.author}
              onChange={handleOnChange}
              placeholder="Enter author name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              name="publisher"
              value={book.publisher || ''}
              onChange={handleOnChange}
              placeholder="Enter publisher"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Published Year</Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={book.year || ''}
              onChange={handleOnChange}
              placeholder="Enter published year"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="categoryId">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesLoading ? (
                  <SelectItem value="" disabled>
                    Loading categories...
                  </SelectItem>
                ) : categories.length === 0 ? (
                  <SelectItem value="" disabled>
                    No categories available
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={book.description || ''}
              onChange={handleOnChange}
              placeholder="Enter description"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bookCoverUrl">Image Cover</Label>
            <Input
              id="bookCoverUrl"
              name="bookCoverUrl"
              value={book.bookCoverUrl || ''}
              onChange={handleOnChange}
              placeholder="https://example.com/book.jpg"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 cursor-pointer"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
