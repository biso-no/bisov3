"use client";

import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";
import { conf } from "../../../../lib/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export function Client({ path, data }: { path: string; data: Data }) {
  const [newPath, setNewPath] = useState(path);

  const router = useRouter();



  
  return (
    <Puck
      config={conf}
      data={data}
      onPublish={async (data: Data) => {
        const response = await fetch("/puck/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data, path }), // Ensure newPath is used
        });

        // Parse JSON from response
        const json = await response.json();
        console.log(json);
        if (json.status === "ok") {
          const url = `${BASE_URL}/${json.path}/edit`;
            router.push(url);
        } else {
            alert(json.message);
            setNewPath(path);
        }
      }}
    />
  );
}
