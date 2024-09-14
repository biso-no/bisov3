"use client";

import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";
import { conf } from "../../../../lib/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deletePage, savePage } from "@/lib/actions/save-page";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export function Client({ path, data }: { path: string; data: Data }) {
  const [newPath, setNewPath] = useState(path);

  const router = useRouter();



  
  return (
    <Puck
      config={conf}
      data={data}
      onPublish={async (data: Data) => {
        const response = await savePage({ data, path });
        if (response.status === "ok") {
          const url = `${BASE_URL}/${response.path}/edit`;
          router.push(url);
        } else {
          alert(response.message);
          setNewPath(path);
        }
      }}
    />
  );
}
