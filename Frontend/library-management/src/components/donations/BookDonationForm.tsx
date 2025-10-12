import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  BookOpen,
  User,
  MapPin,
  Building,
  Tag,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { bookCategories } from "@/data/mockData";

// TODO: - Implement to call API get campus
const campusCodes = [
  { code: "HN001", name: "Hanoi Main Campus" },
  { code: "HCM001", name: "Ho Chi Minh Campus" },
  { code: "DN001", name: "Da Nang Campus" },
  { code: "CT001", name: "Can Tho Campus" },
];

interface BookDonationFormData {
  username: string;
  title: string;
  author: string;
  campusCode: string;
  shelfLocation: string;
  category: string;
  description: string;
  condition: string;
}

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters"),
  title: Yup.string()
    .required("Book title is required")
    .min(2, "Book title must be at least 2 characters")
    .max(200, "Book title must not exceed 200 characters"),
  author: Yup.string()
    .required("Author name is required")
    .min(2, "Author name must be at least 2 characters")
    .max(100, "Author name must not exceed 100 characters"),
  campusCode: Yup.string()
    .required("Campus selection is required")
    .oneOf(
      campusCodes.map((campus) => campus.code),
      "Please select a valid campus"
    ),
  shelfLocation: Yup.string()
    .required("Shelf location is required")
    .matches(
      /^[A-Z]\d+-\d{2}$/,
      "Shelf location must be in format: A1-05, B2-12, etc."
    )
    .max(10, "Shelf location must not exceed 10 characters"),
  category: Yup.string()
    .required("Category selection is required")
    .oneOf(
      bookCategories.filter((cat) => cat !== "All Categories"),
      "Please select a valid category"
    ),
  condition: Yup.string()
    .required("Book condition is required")
    .oneOf(
      ["excellent", "good", "fair", "poor"],
      "Please select a valid condition"
    ),
  description: Yup.string().max(
    500,
    "Description must not exceed 500 characters"
  ),
});

const initialValues: BookDonationFormData = {
  username: "",
  title: "",
  author: "",
  campusCode: "",
  shelfLocation: "",
  category: "",
  description: "",
  condition: "",
};

export function BookDonationForm() {
  const handleSubmit = async (
    values: BookDonationFormData,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        "Book donation submitted successfully! We will review your submission."
      );
      resetForm();
    } catch (error) {
      toast.error("Failed to submit donation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Book Donation</CardTitle>
              <CardDescription>
                Contribute to our library by donating your books. Help other
                readers discover great content!
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              isSubmitting,
              resetForm,
            }: FormikProps<BookDonationFormData>) => {
              const selectedCampus = campusCodes.find(
                (campus) => campus.code === values.campusCode
              );

              return (
                <Form className="space-y-6">
                  {/* Donor Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">Donor Information</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">
                        Username <span className="text-destructive">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        className={
                          errors.username && touched.username
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.username && touched.username && (
                        <div className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.username}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">Book Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">
                          Book Title <span className="text-destructive">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="title"
                          name="title"
                          placeholder="Enter book title"
                          className={
                            errors.title && touched.title
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.title && touched.title && (
                          <div className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            {errors.title}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="author">
                          Author <span className="text-destructive">*</span>
                        </Label>
                        <Field
                          as={Input}
                          id="author"
                          name="author"
                          placeholder="Enter author name"
                          className={
                            errors.author && touched.author
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.author && touched.author && (
                          <div className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            {errors.author}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={values.category}
                        onValueChange={(value) =>
                          setFieldValue("category", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.category && touched.category
                              ? "border-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select book category" />
                        </SelectTrigger>
                        <SelectContent>
                          {bookCategories
                            .filter((cat) => cat !== "All Categories")
                            .map((category) => (
                              <SelectItem key={category} value={category}>
                                <div className="flex items-center gap-2">
                                  <Tag className="h-3 w-3" />
                                  {category}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {errors.category && touched.category && (
                        <div className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.category}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">
                        Book Condition{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={values.condition}
                        onValueChange={(value) =>
                          setFieldValue("condition", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.condition && touched.condition
                              ? "border-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select book condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                Excellent
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Like new
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="good">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                              >
                                Good
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Minor wear
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="fair">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-yellow-100 text-yellow-800"
                              >
                                Fair
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Some damage
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="poor">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-red-100 text-red-800"
                              >
                                Poor
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Heavy wear
                              </span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.condition && touched.condition && (
                        <div className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.condition}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Additional Description
                      </Label>
                      <Field
                        as={Textarea}
                        id="description"
                        name="description"
                        placeholder="Any additional notes about the book (optional)"
                        rows={3}
                      />
                      {errors.description && touched.description && (
                        <div className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">Location Information</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="campusCode">
                        Campus Code <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={values.campusCode}
                        onValueChange={(value) =>
                          setFieldValue("campusCode", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.campusCode && touched.campusCode
                              ? "border-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select campus location" />
                        </SelectTrigger>
                        <SelectContent>
                          {campusCodes.map((campus) => (
                            <SelectItem key={campus.code} value={campus.code}>
                              <div className="flex items-center gap-2">
                                <Building className="h-3 w-3" />
                                <div>
                                  <div className="font-medium">
                                    {campus.code}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {campus.name}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.campusCode && touched.campusCode && (
                        <div className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.campusCode}
                        </div>
                      )}
                      {selectedCampus && (
                        <div className="p-2 bg-muted/50 rounded-md">
                          <div className="text-sm">
                            <span className="font-medium">
                              Selected Campus:
                            </span>{" "}
                            {selectedCampus.name}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shelfLocation">
                        Shelf Location{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="shelfLocation"
                        name="shelfLocation"
                        placeholder="e.g., A1-05, B2-12, C3-08"
                        className={
                          errors.shelfLocation && touched.shelfLocation
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.shelfLocation && touched.shelfLocation && (
                        <div className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.shelfLocation}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        Please specify the exact shelf location where the book
                        should be placed
                      </div>
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Donation"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resetForm()}
                      disabled={isSubmitting}
                    >
                      Reset Form
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
