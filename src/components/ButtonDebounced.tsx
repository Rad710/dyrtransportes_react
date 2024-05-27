import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";

interface PropsButtonDebounced extends ButtonProps {
    onClickPromise?: Promise<unknown>;
}

export const ButtonDebounced = ({
    children,
    onClickPromise,
    variant,
    size,
    disabled,
}: React.PropsWithChildren<PropsButtonDebounced>) => {
    const [debounceDisabled, setDebounceDisabled] = useState(disabled ?? false);

    return (
        <Button
            variant={variant}
            size={size}
            disabled={debounceDisabled}
            onClick={async () => {
                setDebounceDisabled(true);
                onClickPromise?.then(() => setDebounceDisabled(false));
            }}
        >
            {children}
        </Button>
    );
};
