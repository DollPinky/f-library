import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { borrowedBooks, donatedBooks, profileData } from "@/data/mockData";
import type { UserProfile } from "@/types/User";
import { userProfile } from "@/services/userService";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  BookOpen,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

const LabeledInfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | undefined;
}) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </Label>
    <p className="pl-6">{value}</p>
  </div>
);

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(profileData);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await userProfile();
        if (res) {
          setProfile(res);
        } else {
          toast.error("Something when wrong!");
        }
      } catch (err) {
        toast.error("Something when wrong!");
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, []);

  if (loading) return <Skeleton rows={5} />;

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1>User Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account details
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>View your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarImage src={profile?.avatar} alt={profile?.fullName} />
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2>{profile?.fullName}</h2>
                <p className="text-muted-foreground">{profile?.position}</p>
                <div className="mt-2">
                  <Badge variant="secondary">{profile?.department}</Badge>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3>Contact Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <LabeledInfoRow
                  icon={Mail}
                  label="Email Address"
                  value={profile?.email}
                />
                <LabeledInfoRow
                  icon={Phone}
                  label="Phone Number"
                  value={profile?.phone}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3>Organization</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <LabeledInfoRow
                  icon={Building2}
                  label="Department"
                  value={profile?.department}
                />
                <LabeledInfoRow
                  icon={Briefcase}
                  label="Position"
                  value={profile?.position}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Sách Đã Mượn
            </CardTitle>
            <CardDescription>
              Danh sách các cuốn sách bạn đã mượn từ thư viện
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Sách</TableHead>
                    <TableHead>Ngày Mượn</TableHead>
                    <TableHead>Ngày Trả</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowedBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.bookName}</TableCell>
                      <TableCell>{book.borrowDate}</TableCell>
                      <TableCell>{book.returnDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Sách Đã Quyên Góp
            </CardTitle>
            <CardDescription>
              Danh sách các cuốn sách bạn đã quyên góp cho thư viện
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Sách</TableHead>
                    <TableHead>Ngày Quyên Góp</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donatedBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.bookName}</TableCell>
                      <TableCell>{book.donationDate}</TableCell>
                      <TableCell>{book.campus}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{book.points}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Profile;
