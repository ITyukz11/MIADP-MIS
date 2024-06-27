"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export type Framework = Record<"value" | "label", string>;

interface FancyMultiSelectProps {
    data: Framework[];
    onSelectionChange: (selected: string[]) => void;
    clearFunctionRef: React.MutableRefObject<(() => void) | null>;
    selectAllFunctionRef: React.MutableRefObject<(() => void) | null>;
    disabled: boolean;
    selectedData?: Framework[];
}

export function FancyMultiSelectUpdateActivity({
    data,
    onSelectionChange,
    clearFunctionRef,
    selectAllFunctionRef,
    disabled,
    selectedData = []
}: FancyMultiSelectProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<Framework[]>(selectedData);
    const [inputValue, setInputValue] = React.useState("");
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
        selectedData.map((item) => item.value)
    );

    const clearSelectedValues = React.useCallback(() => {
        setSelected([]);
        setSelectedValues([]);
        onSelectionChange([]);
    }, [onSelectionChange]);

    const selectAllValues = React.useCallback(() => {
        const allValues = data.map((framework) => framework.value);
        setSelected(data);
        setSelectedValues(allValues);
        onSelectionChange(allValues);
    }, [data, onSelectionChange]);

    React.useEffect(() => {
        clearFunctionRef.current = clearSelectedValues;
        return () => {
            clearFunctionRef.current = null;
        };
    }, [clearSelectedValues, clearFunctionRef]);

    React.useEffect(() => {
        selectAllFunctionRef.current = selectAllValues;
        return () => {
            selectAllFunctionRef.current = null;
        };
    }, [selectAllValues, selectAllFunctionRef]);

    React.useEffect(() => {
        setSelected(selectedData);
        setSelectedValues(selectedData.map((item) => item.value));
    }, [selectedData]);

    const handleUnselect = React.useCallback(
        (framework: Framework) => {
            const updatedSelected = selected.filter((s) => s.value !== framework.value);
            const updatedSelectedValues = selectedValues.filter((value) => value !== framework.value);
            setSelected(updatedSelected);
            setSelectedValues(updatedSelectedValues);
            onSelectionChange(updatedSelectedValues);
        },
        [selected, selectedValues, onSelectionChange]
    );

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (input) {
                if (e.key === "Delete" || e.key === "Backspace") {
                    if (input.value === "") {
                        const newSelected = [...selected];
                        newSelected.pop();
                        setSelected(newSelected);
                        const newSelectedValues = [...selectedValues];
                        newSelectedValues.pop();
                        setSelectedValues(newSelectedValues);
                        onSelectionChange(newSelectedValues);
                    }
                }
                if (e.key === "Escape") {
                    input.blur();
                }
            }
        },
        [selected, selectedValues, onSelectionChange]
    );

    const selectables = data.filter(
        (framework) => !selected.some((selectedFramework) => selectedFramework.value === framework.value)
    );

    return (
        <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {selected.map((framework) => (
                        <Badge key={framework.value} variant="secondary">
                            {framework.label}
                            <button
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleUnselect(framework);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(framework)}
                                disabled={disabled}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onFocus={() => setOpen(true)}
                        disabled={disabled}
                        placeholder="Select participants..."
                        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-xs sm:text-sm"
                        style={!open ? { cursor: 'pointer' } : {}}
                    />
                    {open && selectables.length > 0 ? (
                        <FaChevronUp
                            className="cursor-pointer mt-auto"
                            onClick={!disabled ? () => setOpen(false) : undefined}
                        />
                    ) : (
                        <FaChevronDown
                            className="cursor-pointer mt-auto"
                            onClick={!disabled ? () => setOpen(true) : undefined}
                        />
                    )}
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open && selectables.length > 0 ? (
                        <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto">
                                {selectables.map((framework) => (
                                    <CommandItem
                                        key={framework.value}
                                        onSelect={() => {
                                            setInputValue("");
                                            const newSelected = [...selected, framework];
                                            setSelected(newSelected);
                                            const newSelectedValues = [...selectedValues, framework.value];
                                            setSelectedValues(newSelectedValues);
                                            onSelectionChange(newSelectedValues);
                                        }}
                                        className="cursor-pointer text-xs sm:text-sm"
                                        disabled={disabled}
                                    >
                                        {framework.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
}

export default FancyMultiSelectUpdateActivity;
