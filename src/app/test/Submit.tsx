"use client";

import { useState } from "react";
import { newMotd } from "./action";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onClick = () => {
    setLoading(true);
    newMotd(msg).then(() => setLoading(false));
  };

  return (
    <div>
      <input className="outline" type="text" onChange={(e) => setMsg(e.target.value)} value={msg}/>
      <Button onClick={onClick}>
        {loading ? "loading" : "submit new motd"}
      </Button>
    </div>
  );
}
