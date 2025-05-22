import { Label } from "@/components/ui/label";

// Example ViewField component
type ViewFieldProps = {
    label: string;
    value: string;
    isTextarea?: boolean;
    description?: string;
  };
  
 export const ViewField = ({ label, value, isTextarea, description }: ViewFieldProps) => (
    <div className="flex flex-col gap-1">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-50">{label}</Label>
      <div
        className={`bg-white dark:bg-gray-800 border rounded px-2 py-1 text-sm text-gray-900 dark:text-gray-50 ${
          isTextarea ? "min-h-[80px]" : ""
        }`}
      >
        {value || "-"}
      </div>
      {description && <span className="text-xs text-gray-500 dark:text-gray-200">{description}</span>}
    </div>
  );