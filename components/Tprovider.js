"use client";

import * as React from "react";
import { TooltipProvider } from "./ui/tooltip";

export function TooltipProviders({ children }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
