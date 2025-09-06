// components/dashboard/UserProfileCard.tsx

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { userStore } from "@/stores/userStore";
import { IUserData } from "@/types/userTypes";
import { Calendar, LogOut, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const formatMemberSince = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

export default function UserProfileCard() {
  const { user, isLoading, error, fetchGetUser } = userStore();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated" && !user) {
      fetchGetUser();
    }
  }, [sessionStatus, user, fetchGetUser]);
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-user.png" />
              <AvatarFallback className="text-lg">
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">{user?.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since {formatMemberSince(user?.createdAt!)}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
