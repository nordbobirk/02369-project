"use client";

import { useState } from "react";
import { setSetting } from "./action";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const [loading, setLoading] = useState(false);
  const [settingKey, setKey] = useState("");
  const [settingValue, setValue] = useState("");

  const onClick = () => {
    setLoading(true);
    console.log("Before if")
    if(settingKey !== null && settingValue !== null ){
      console.log("in if")
      setSetting(settingKey, settingValue).then(() => setLoading(false));
    } else {
      console.log("In else")
      alert("Fields can't be empty!");
      setLoading(false);
    }
  };

  return (
    <div>
      <input className="outline" type="text" onChange={(e) => setKey(e.target.value)} value={settingKey}/>
      <input className="outline" type="text" onChange={(e) => setValue(e.target.value)} value={settingValue}/>
      <Button onClick={onClick}>
        {loading ? "loading" : "Set setting"}
      </Button>
    </div>
  );
}
