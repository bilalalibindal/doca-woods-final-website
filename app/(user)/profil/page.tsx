"use client";

import { useSession } from "next-auth/react";
import { MainHeader } from "@/components/header";
import { LoginPage, UserDashboard } from "@/components/profil";

const AccountPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <>
        <MainHeader />
      </>
    );
  }

  return (
    <>
      <MainHeader />
      {status === "authenticated" ? <UserDashboard /> : <LoginPage />}
    </>
  );
};

export default AccountPage;
