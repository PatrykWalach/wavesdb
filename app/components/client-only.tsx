"use client";

import { useSyncExternalStore } from "react";

export function ClientOnly({
  children,
  fallback,
}: {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const isServer = useSyncExternalStore(
    () => () => {},
    () => false,
    () => true,
  );
  return isServer ? fallback : children;
}
