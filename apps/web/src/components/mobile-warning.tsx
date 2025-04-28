import { AlertCircle } from "lucide-react";

export function MobileWarning() {
  return (
    <div className="flex items-center gap-2 text-yellow-500">
      <AlertCircle size={20} />
      <span>This app is not optimized for mobile devices. Please use a desktop browser for the best experience.</span>
    </div>
  );
} 