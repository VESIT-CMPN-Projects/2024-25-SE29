
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  fullPage?: boolean;
  overlay?: boolean;
  timeout?: number; // Timeout to auto-hide long-running loading indicators
  id?: string;
}

export function Loading({ 
  size = "md", 
  text, 
  className, 
  fullPage = false,
  overlay = false,
  timeout = 20000, // Default 20 second timeout
  id = "global-loading"
}: LoadingProps) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Apply timeout to auto-hide after a certain period
    if (timeout) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [timeout]);

  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  if (!visible) return null;

  const loadingContent = (
    <div 
      id={id}
      className={cn(
        "flex flex-col items-center justify-center loading-element",
        fullPage ? "h-[calc(100vh-12rem)] w-full" : "",
        overlay ? "fixed inset-0 bg-black/20 z-50" : "",
        className
      )}
    >
      <div className={overlay ? "bg-white p-6 rounded-lg shadow-lg flex flex-col items-center" : ""}>
        <Loader2 
          className={cn(
            "animate-spin text-gov-blue-600",
            sizeClass[size]
          )} 
        />
        {text && (
          <p className="mt-2 text-sm text-gray-600">{text}</p>
        )}
      </div>
    </div>
  );

  return loadingContent;
}
