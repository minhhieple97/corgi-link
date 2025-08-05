"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader2, Shield } from "lucide-react";

type AnalyzingModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AnalyzingModal = ({
  isOpen,
  onOpenChange,
}: AnalyzingModalProps) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="size-5 text-blue-600" />
            AI Security Analysis
          </DialogTitle>
          <DialogDescription>
            Our AI is analyzing your URL for security threats and malicious
            content{dots}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <Loader2 className="size-12 animate-spin text-blue-600" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-100 animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            This usually takes a few seconds
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
