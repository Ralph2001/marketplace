"use client";

import { useAuth } from "../../../context/AuthContext";
import Header from "./header";

export default function HeaderWrapper() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <Header />;
}
