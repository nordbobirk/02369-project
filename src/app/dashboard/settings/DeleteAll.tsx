"use client";

import { useState } from "react";
import { deleteAll } from "./action";
import { Button } from "@/components/ui/button";

export function DeleteAll() {
  const [loading, setLoading] = useState(false);
  const onClick = () => {
    setLoading(true);
    deleteAll().then(() => setLoading(false));
  };
  return <Button onClick={onClick}>{loading ? "loading" : "delete all"}</Button>;
}
