/**
 * The confirmation dialog every destructive or exporting action goes through.
 */
import { describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@mui/material";

import { ConfirmationProvider, useConfirmation } from "@/context/ConfirmationContext";

const Opener = ({ options }: { options: Record<string, unknown> }) => {
    const { openConfirmDialog } = useConfirmation();

    return (
        <Button
            onClick={() =>
                openConfirmDialog({
                    title: "Título",
                    message: "Mensaje",
                    confirmText: "Confirmar",
                    onConfirm: () => {},
                    ...options,
                })
            }
        >
            abrir
        </Button>
    );
};

const open = async (options: Record<string, unknown> = {}) => {
    const user = userEvent.setup();
    render(
        <ConfirmationProvider>
            <Opener options={options} />
        </ConfirmationProvider>
    );
    await user.click(screen.getByRole("button", { name: "abrir" }));
    return user;
};

describe("confirmation dialog", () => {
    it("shows the title, the message and both buttons", async () => {
        await open();

        expect(await screen.findByText("Título")).toBeInTheDocument();
        expect(screen.getByText("Mensaje")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
    });

    it("labels the cancel button even when the caller does not pass a label", async () => {
        // No caller passes cancelText. Building the state without the defaults
        // left this button blank in every dialog of the app.
        await open();

        expect(await screen.findByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });

    it("runs the action and closes when confirmed", async () => {
        const onConfirm = vi.fn();
        const user = await open({ onConfirm });

        await user.click(await screen.findByRole("button", { name: "Confirmar" }));

        expect(onConfirm).toHaveBeenCalledOnce();
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("closes without running the action when cancelled", async () => {
        const onConfirm = vi.fn();
        const user = await open({ onConfirm });

        await user.click(await screen.findByRole("button", { name: "Cancel" }));

        expect(onConfirm).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("waits for an async action before closing", async () => {
        let resolve: () => void = () => {};
        const onConfirm = vi.fn(() => new Promise<void>((r) => (resolve = r)));
        const user = await open({ onConfirm });

        await user.click(await screen.findByRole("button", { name: "Confirmar" }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();

        resolve();
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("does not carry options over from the previous dialog", async () => {
        const user = userEvent.setup();
        const Two = () => {
            const { openConfirmDialog } = useConfirmation();
            return (
                <>
                    <Button
                        onClick={() =>
                            openConfirmDialog({
                                title: "Primero",
                                message: "uno",
                                confirmText: "Exportar PDF",
                                onConfirm: () => {},
                            })
                        }
                    >
                        primero
                    </Button>
                    <Button
                        onClick={() =>
                            openConfirmDialog({
                                title: "Segundo",
                                message: "dos",
                                onConfirm: () => {},
                            })
                        }
                    >
                        segundo
                    </Button>
                </>
            );
        };
        render(
            <ConfirmationProvider>
                <Two />
            </ConfirmationProvider>
        );

        await user.click(screen.getByRole("button", { name: "primero" }));
        await user.click(await screen.findByRole("button", { name: "Cancel" }));
        // MUI keeps the background inert while the dialog closes
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        await user.click(screen.getByRole("button", { name: "segundo" }));

        expect(await screen.findByText("Segundo")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Exportar PDF" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    });
});
