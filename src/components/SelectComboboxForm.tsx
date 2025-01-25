"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ComboboxSelectOption } from "@/types";

type SelectComboboxFormProps = {
    placeholder: string;
    optionList: ComboboxSelectOption[];
    selectedOption: string;
    setSelectedOption: (value: string) => void;
};

export function SelectComboboxForm({
    placeholder,
    optionList,
    selectedOption,
    setSelectedOption,
}: SelectComboboxFormProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-[200px] justify-between",
                            !selectedOption && "text-muted-foreground",
                        )}
                    >
                        {selectedOption
                            ? optionList.find((option) => option.value === selectedOption)?.label
                            : placeholder}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent>
                <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {optionList.map((option) => (
                                <CommandItem
                                    value={option.label}
                                    key={option.value}
                                    onSelect={setSelectedOption}
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            option.value === selectedOption
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
