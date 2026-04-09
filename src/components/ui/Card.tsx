"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}

const Card = ({ children, className, padding = "md", hover = false }: CardProps) => {
  const baseStyles = "bg-white border border-border rounded-xl shadow-sm";
  const hoverStyles = hover ? "hover:shadow-lg transition-shadow duration-200" : "";
  
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  return (
    <div className={cn(baseStyles, hoverStyles, paddingStyles[padding], className)}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("border-b border-border pb-4 mb-6", className)}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <h3 className={cn("text-xl font-semibold text-foreground", className)}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <p className={cn("text-muted mt-1", className)}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("border-t border-border pt-4 mt-6", className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
