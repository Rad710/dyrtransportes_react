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
    readonly dialogContent: React.ReactNode;
    readonly buttonContent: React.ReactNode;
    readonly onClickFunctionPromise: () => Promise<unknown>;
    readonly disabled?: boolean;
    variant:
        | "link"
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost";
    size: "default" | "sm" | "lg" | "md-lg" | "icon";
};

export function DialogButtonConfirm({
    dialogContent,
    buttonContent,
    onClickFunctionPromise,
    disabled,
    variant,
    size,
}: React.PropsWithChildren<AlertDialogProps>) {
    const [debounceDisabled, setDebounceDisabled] = useState(false);

    return (
        <AlertDialog open={disabled ? false : undefined}>
            <AlertDialogTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    disabled={debounceDisabled || disabled}
                >
                    {buttonContent}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Confirmación ¿Está seguro?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {dialogContent}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="md:mr-4">
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => {
                            setDebounceDisabled(true);
                            await onClickFunctionPromise();
                            setDebounceDisabled(false);
                        }}
                        variant={variant}
                    >
                        {buttonContent}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
