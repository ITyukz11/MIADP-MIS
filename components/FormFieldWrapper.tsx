import { useEffect, useRef } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
} from "react-hook-form";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

type FormFieldWrapperProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?:
    | "text"
    | "email"
    | "checkbox"
    | "password"
    | "select"
    | "number"
    | "amount"
    | "date";
  isTextarea?: boolean;
  isDisabled?: boolean;
  isOptional?: boolean;
  selectOptions?: {
    value: string;
    label: string;
    selectItemDisable?: boolean;
  }[];
  showPassword?: boolean;
  onTogglePasswordVisibility?: () => void;
  tabIndex?: number;
  isFocus?: boolean;
  note?: string;
  className?: string;
  value?: string;
  readOnly?: boolean;
};

const FormFieldWrapper = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  isTextarea = false,
  isDisabled = false,
  isOptional = false,
  selectOptions = [],
  showPassword = false,
  onTogglePasswordVisibility,
  tabIndex = -1,
  isFocus = false,
  note,
  className,
  value,
  readOnly = false,
}: FormFieldWrapperProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isFocus) {
      if (isTextarea && textareaRef.current) {
        textareaRef.current.focus();
      } else if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isFocus, isTextarea]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
        <FormItem className="w-full">
          <FormLabel className="flex flex-row gap-1">
            {label}{" "}
            {isOptional && (
              <Label className="text-xs font-light">(Optional)</Label>
            )}
            {note && <Label className="text-xs font-light">{note}</Label>}
            <FormMessage />
          </FormLabel>
          <FormControl className="overflow-hidden">
            {type === "select" ? (
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                disabled={isDisabled}
              >
                <SelectTrigger
                  className="overflow-hidden"
                  tabIndex={isDisabled ? -1 : tabIndex}
                >
                  {field.value
                    ? selectOptions.find(
                        (option) => option.value === field.value
                      )?.label
                    : placeholder}
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((option: any) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.selectItemDisable || false}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : isTextarea ? (
              <Textarea
                {...field}
                className={className}
                disabled={isDisabled}
                placeholder={placeholder}
                tabIndex={isDisabled ? -1 : tabIndex}
                ref={textareaRef}
                readOnly={readOnly}
              />
            ) : type === "password" ? (
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isDisabled}
                  placeholder={placeholder}
                  className="pr-10"
                  tabIndex={isDisabled ? -1 : tabIndex}
                  ref={inputRef}
                  readOnly={readOnly}
                />
                {showPassword ? (
                  <motion.div
                    key="open"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute right-3 top-[0.7rem] transform -translate-y-1/2 cursor-pointer"
                    onClick={onTogglePasswordVisibility}
                    tabIndex={isDisabled ? -1 : tabIndex}
                  >
                    <PiEyeBold />
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute right-3 top-[0.7rem] transform -translate-y-1/2 cursor-pointer"
                    onClick={onTogglePasswordVisibility}
                    tabIndex={isDisabled ? -1 : tabIndex}
                  >
                    <PiEyeClosedBold />
                  </motion.div>
                )}
              </div>
            ) : type === "date" ? (
              <Input
                {...field}
                type="date"
                disabled={isDisabled}
                placeholder={placeholder}
                className={className}
                tabIndex={isDisabled ? -1 : tabIndex}
                ref={inputRef}
                value={field.value || ""}
                readOnly={readOnly}
              />
            ) : type === "amount" ? (
              <div className="relative overflow-visible">
                <Label className="absolute left-2 bottom-3">₱</Label>
                <Input
                  className="pl-5 z-auto"
                  type="number"
                  placeholder={placeholder}
                  {...field}
                  disabled={isDisabled}
                  tabIndex={isDisabled ? -1 : tabIndex}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || null)
                  }
                />
              </div>
            ) : (
              <Input
                {...field}
                type={type === "number" ? "number" : "text"}
                autoComplete="new-password"
                disabled={isDisabled}
                placeholder={
                  isOptional ? `${placeholder} (if any)` : placeholder
                }
                className="pr-10 appearance-none"
                tabIndex={isDisabled ? -1 : tabIndex}
                ref={inputRef}
                value={value}
              />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormFieldWrapper;
