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

type AlertDialogProps = {
    readonly buttonText: string;
    readonly dialogText: string;
    readonly handler: React.MouseEventHandler<HTMLButtonElement>;
    readonly disabled: boolean;
};

export function DialogConfirm(
    props: React.PropsWithChildren<AlertDialogProps>
) {
    return (
        <AlertDialog open={props.disabled ? false : undefined}>
            <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Confirmación ¿Está seguro?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {props.dialogText}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={props.handler}>
                        {props.buttonText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
