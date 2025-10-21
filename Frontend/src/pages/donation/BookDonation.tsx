import { BookDonationForm } from "@/components/donations/BookDonationForm";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Mock data for UI display only (not API data)
import { donationGuidelines, donationStats } from "@/data/mockData";
import { getAllCategories } from "@/services/categoryService";
import { getAllCampuses } from "@/services/campusService";
import { getConfiguration } from "@/services/configurationService";
import type { Campus, Category } from "@/types";
import { CheckCircle, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BookDonation = () => {
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingCampuses, setIsLoadingCampuses] = useState(true);
  const [isLoadingShelfLocations, setIsLoadingShelfLocations] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [shelfLocations, setShelfLocations] = useState<string[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await getAllCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories. Please try again.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    const getCampuses = async () => {
      try {
        setIsLoadingCampuses(true);
        const response = await getAllCampuses();
        if (response.success && response.data) {
          setCampuses(response.data);
        }
      } catch (err) {
        console.error("Error fetching campuses:", err);
        toast.error("Failed to load campuses. Please try again.");
      } finally {
        setIsLoadingCampuses(false);
      }
    };

    const getShelfLocations = async () => {
      try {
        setIsLoadingShelfLocations(true);
        const response = await getConfiguration();
        if (response.success && response.data) {
          setShelfLocations(response.data.shelfLocations || []);
        }
      } catch (err) {
        console.error("Error fetching shelf locations:", err);
        toast.error("Failed to load shelf locations. Please try again.");
      } finally {
        setIsLoadingShelfLocations(false);
      }
    };

    getCategories();
    getCampuses();
    getShelfLocations();
  }, []);

  return (
    <div className="space-y-6 m-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Heart className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Book Donation</h1>
            <p className="text-muted-foreground">
              Share the joy of reading by donating books to our library
              community
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {donationStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BookDonationForm
            categories={categories}
            campuses={campuses}
            shelfLocations={shelfLocations}
            isLoadingCategories={isLoadingCategories}
            isLoadingCampuses={isLoadingCampuses}
            isLoadingShelfLocations={isLoadingShelfLocations}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Donation Guidelines
              </CardTitle>
              <CardDescription>
                Please review these guidelines before donating your books
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donationGuidelines.map((guideline, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {guideline}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation Process</CardTitle>
              <CardDescription>
                What happens after you submit your donation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">
                    1
                  </Badge>
                  <div>
                    <h4 className="font-medium">Review & Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Our team reviews your submission within 2-3 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">
                    2
                  </Badge>
                  <div>
                    <h4 className="font-medium">Collection Arrangement</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll contact you to arrange book collection or drop-off
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">
                    3
                  </Badge>
                  <div>
                    <h4 className="font-medium">Cataloging & Placement</h4>
                    <p className="text-sm text-muted-foreground">
                      Books are cataloged and placed in the specified location
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">
                    4
                  </Badge>
                  <div>
                    <h4 className="font-medium">Thank You Note</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a confirmation and thank you message
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Contact our donation team for assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Email Support</h4>
                  <p className="text-sm text-muted-foreground">
                    donations_library@fpt.com
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Phone Support</h4>
                  <p className="text-sm text-muted-foreground">
                    +84 (0) 123 456 789
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Office Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 8:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookDonation;
