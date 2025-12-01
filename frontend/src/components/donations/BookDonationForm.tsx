import { Formik, Form, Field, type FormikProps } from "formik";
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
import {
  BookOpen,
  User,
  MapPin,
  Building,
  Tag,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
// import { campusCodes } from "@/data/mockData";
import type { Campus, Category } from "@/types";
import { validationSchema } from "@/utils/validator";
import { donateBook } from "@/services/bookApi";
import type { BookDonationFormData } from "@/types/Book";
import { useAuth } from "@/hooks/useAuth";

const initialValues: BookDonationFormData = {
  username: "",
  title: "",
  campusCode: "",
  shelfLocation: "",
  category: "",
  description: "",
};

interface BookDonationFormProps {
  categories: Category[];
  campuses: Campus[];
  shelfLocations: string[];
  isLoadingCategories?: boolean;
  isLoadingCampuses?: boolean;
  isLoadingShelfLocations?: boolean;
}

export function BookDonationForm({
  categories,
  campuses,
  shelfLocations,
  isLoadingCategories = false,
  isLoadingCampuses = false,
  isLoadingShelfLocations = false
}: BookDonationFormProps) {
  const { user } = useAuth();
  const handleSubmit = async (
    values: BookDonationFormData,
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      // Use authenticated user's email as username
      const payload = {
        ...values,
        username: user?.email || user?.companyAccount || values.username
      };

      await donateBook(payload);

      toast.success(
        "Book donation submitted successfully! We will review your submission."
      );
      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit donation. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
          initialValues={{
            ...initialValues,
            username: user?.email || user?.companyAccount || ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
            resetForm,
          }: FormikProps<BookDonationFormData>) => {
            const selectedCampus = campuses.find(
              (campus) => campus.code === values.campusCode
            );

            return (
              <Form className="space-y-6">
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
                      placeholder="Logged in user"
                      readOnly
                      disabled
                      className={
                        errors.username && touched.username
                          ? "border-destructive bg-muted"
                          : "bg-muted cursor-not-allowed"
                      }
                    />
                    {errors.username && touched.username && (
                      <div className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.username}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Your account will be associated with this donation
                    </div>
                  </div>
                </div>

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
                      disabled={isLoadingCategories}
                    >
                      <SelectTrigger
                        className={
                          errors.category && touched.category
                            ? "border-destructive"
                            : ""
                        }
                      >
                        <SelectValue
                          placeholder={
                            isLoadingCategories
                              ? "Loading categories..."
                              : "Select book category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCategories ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            Loading categories...
                          </div>
                        ) : categories.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No categories available
                          </div>
                        ) : (
                          categories
                            .filter((cat) => cat.name !== "All Categories")
                            .map((category) => (
                              <SelectItem
                                key={category.categoryId}
                                value={category.name}
                              >
                                <div className="flex items-center gap-2">
                                  <Tag className="h-3 w-3" />
                                  {category.name}
                                </div>
                              </SelectItem>
                            ))
                        )}
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
                    <Label htmlFor="description">Additional Description</Label>
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
                      disabled={isLoadingCampuses}
                    >
                      <SelectTrigger
                        className={
                          errors.campusCode && touched.campusCode
                            ? "border-destructive"
                            : ""
                        }
                      >
                        <SelectValue
                          placeholder={
                            isLoadingCampuses
                              ? "Loading campuses..."
                              : "Select campus location"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCampuses ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            Loading campuses...
                          </div>
                        ) : campuses.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No campuses available
                          </div>
                        ) : (
                          campuses.map((campus) => (
                            <SelectItem key={campus.campusId} value={campus.code}>
                              <div className="flex items-center gap-2">
                                <Building className="h-3 w-3" />
                                <div>
                                  <div className="font-medium">{campus.code}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {campus.name}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        )}
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
                          <span className="font-medium">Selected Campus:</span>{" "}
                          {selectedCampus.name}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shelfLocation">
                      Shelf Location <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={values.shelfLocation}
                      onValueChange={(value) =>
                        setFieldValue("shelfLocation", value)
                      }
                      disabled={isLoadingShelfLocations}
                    >
                      <SelectTrigger
                        className={
                          errors.shelfLocation && touched.shelfLocation
                            ? "border-destructive"
                            : ""
                        }
                      >
                        <SelectValue
                          placeholder={
                            isLoadingShelfLocations
                              ? "Loading shelf locations..."
                              : "Select shelf location"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingShelfLocations ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            Loading shelf locations...
                          </div>
                        ) : shelfLocations.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No shelf locations available
                          </div>
                        ) : (
                          shelfLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                {location}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.shelfLocation && touched.shelfLocation && (
                      <div className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.shelfLocation}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Select the library location where the book should be placed
                    </div>
                  </div>
                </div>

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
                    Reset
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </CardContent>
    </Card>
  );
}
