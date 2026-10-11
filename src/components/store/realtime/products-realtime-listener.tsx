"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface ProductsRealtimeListenerProps {
  channelName?: string;
}

/**
 * ProductsRealtimeListener listens to Supabase Realtime postgres_changes
 * on the 'products' table. When any product is INSERTed, UPDATEd, or DELETEd
 * (e.g. by an admin adding, editing, or updating stock), this component
 * instantly refreshes server components via Next.js router.refresh() without
 * a full hard page reload, keeping storefront and categories synced in real time.
 */
export function ProductsRealtimeListener({
  channelName = "realtime-products",
}: ProductsRealtimeListenerProps) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          // Instantly refresh Server Components to load new products or updated stock
          routerRef.current.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  return null;
}

