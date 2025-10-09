import { Formik, type FormikProps } from 'formik'
import * as Yup from 'yup'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import type {
  Book,
  CreateBookRequest,
  UpdateBookRequest,
  Category
} from '@/types'
import { Textarea } from '../ui/textarea'
import { createBooks, updateBook } from '@/services/bookManagementService'
import { getAllCategories } from '@/services/categoryService'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

interface BookFormProps {
  book?: Book
  isOpen: boolean
  onClose: () => void
  onSave: (book: Book) => void
}

interface FormValues {
  title: string
  author: string
  publisher: string
  year: number
  description: string
  bookCoverUrl: string
  categoryId: string
}

const validationSchema = Yup.object({
  title: Yup.string().required('Book title is required'),
  author: Yup.string().required('Author is required'),
  publisher: Yup.string(),
  year: Yup.number()
    .required('Published year is required')
    .min(1800, 'Year must be after 1800')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  description: Yup.string(),
  bookCoverUrl: Yup.string().url('Must be a valid URL').nullable(),
  categoryId: Yup.string().required('Category is required')
})

export function BookForm({ book, isOpen, onClose, onSave }: BookFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  // Fetch categories when component mounts or dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {book ? 'Update book information' : 'Add a new book to the library'}
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            title: book?.title || '',
            author: book?.author || '',
            publisher: book?.publisher || '',
            year: book?.year || new Date().getFullYear(),
            description: book?.description || '',
            bookCoverUrl: book?.bookCoverUrl || '',
            categoryId: book?.category?.categoryId || ''
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values: FormValues) => {
            setIsLoading(true)
            try {
              if (book?.bookId) {
                // Update existing book
                const updatePayload: UpdateBookRequest = {
                  title: values.title,
                  author: values.author,
                  publisher: values.publisher,
                  publishYear: values.year,
                  description: values.description,
                  bookCover: values.bookCoverUrl,
                  categoryId: values.categoryId
                }
                const response = await updateBook(book.bookId, updatePayload)
                if (response.success && response.data) {
                  onSave(response.data)
                  toast.success('Book updated successfully!')
                  onClose()
                }
              } else {
                // Create new book
                const createPayload: CreateBookRequest = {
                  title: values.title,
                  author: values.author,
                  publisher: values.publisher,
                  publishYear: values.year,
                  description: values.description,
                  bookCover: values.bookCoverUrl,
                  categoryId: values.categoryId
                }
                const response = await createBooks(createPayload)
                if (response.success && response.data) {
                  onSave(response.data)
                  toast.success('Book created successfully!')
                  onClose()
                }
              }
            } catch (error) {
              console.error('Error submitting book:', error)
              toast.error(
                book?.bookId ? 'Failed to update book' : 'Failed to create book'
              )
            } finally {
              setIsLoading(false)
            }
          }}
        >
          {(formikProps: FormikProps<FormValues>) => {
            const {
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit
            } = formikProps
            return (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Book Name *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.title && touched.title
                          ? 'border-destructive'
                          : ''
                      }
                    />
                    {errors.title && touched.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      name="author"
                      value={values.author}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.author && touched.author
                          ? 'border-destructive'
                          : ''
                      }
                    />
                    {errors.author && touched.author && (
                      <p className="text-sm text-destructive">
                        {errors.author}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      name="publisher"
                      value={values.publisher}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter publisher"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Published Year *</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={values.year}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.year && touched.year ? 'border-destructive' : ''
                      }
                    />
                    {errors.year && touched.year && (
                      <p className="text-sm text-destructive">{errors.year}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={values.categoryId}
                    onValueChange={(value) => {
                      formikProps.setFieldValue('categoryId', value)
                    }}
                  >
                    <SelectTrigger
                      className={
                        errors.categoryId && touched.categoryId
                          ? 'border-destructive'
                          : ''
                      }
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading categories...
                        </SelectItem>
                      ) : categories.length === 0 ? (
                        <SelectItem value="no-categories" disabled>
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
                  {errors.categoryId && touched.categoryId && (
                    <p className="text-sm text-destructive">
                      {errors.categoryId}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={3}
                    placeholder="Book description..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bookCoverUrl">Cover Image URL</Label>
                  <Input
                    id="bookCoverUrl"
                    name="bookCoverUrl"
                    value={values.bookCoverUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="https://example.com/book-cover.jpg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Optional: Enter a URL for the book cover image
                  </p>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading
                      ? 'Saving...'
                      : book
                      ? 'Update Book'
                      : 'Add Book'}
                  </Button>
                </DialogFooter>
              </form>
            )
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
