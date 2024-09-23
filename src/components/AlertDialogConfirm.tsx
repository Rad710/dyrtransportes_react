"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useState } from "react";

type AlertDialogProps = {
    buttonContent: React.ReactNode;
    buttonClassName?: string;
    onClickFunctionPromise: () => Promise<unknown>;
    disabled?: boolean;
    variant:
        | "link"
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "green"
        | "indigo"
        | "cyan";
    size: "default" | "sm" | "lg" | "md-lg" | "icon";
    open?: boolean;
    onOpenChange?(open: boolean): void;
};

export const AlertDialogConfirm = ({
    buttonContent,
    buttonClassName,
    onClickFunctionPromise,
    disabled,
    variant,
    size,
    children,
    open,
    onOpenChange,
}: React.PropsWithChildren<AlertDialogProps>) => {
    const [debounceDisabled, setDebounceDisabled] = useState(false);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    disabled={debounceDisabled || disabled}
                    className={buttonClassName}
                >
                    {buttonContent}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar ¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription>{children}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="md:mr-4">
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant={variant}
                        disabled={debounceDisabled || disabled}
                        onClick={async () => {
                            setDebounceDisabled(true);
                            await onClickFunctionPromise();
                            setDebounceDisabled(false);
                        }}
                    >
                        {buttonContent}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
