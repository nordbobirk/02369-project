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
    if(settingKey.length > 0 && settingValue.length > 0){
      setSetting(settingKey, settingValue).then(() => setLoading(false));
    } else {
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
