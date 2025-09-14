"use client";
import React, { useEffect, useState } from "react";
import BookingForm from "../../components/BookingForm";
import { useCurrentUser } from "../../hooks/useCurrentUser";
export default function BookCongregationPage() {
  
  const { user, loading: userLoading } = useCurrentUser();
  if (userLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-red-600">Not logged in</div>;
  return <BookingForm user={user} />;
}
