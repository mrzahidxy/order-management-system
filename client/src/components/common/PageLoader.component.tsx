"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  isLoading: boolean;
}

export function PageLoader({ isLoading }: PageLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h2 className="text-lg font-semibold">Loading...</h2>
        <p className="text-sm text-muted-foreground">
          Please wait while we load your content.
        </p>
      </div>
    </div>
  );
}
