/**
 * The export buttons of the settlement page, rendered for real.
 *
 * The page is heavy, so the pieces under test are a small component built the
 * same way the page builds them: a button that opens the confirmation dialog
 * and, once confirmed, calls the API and hands the blob to downloadFile.
 */
import { describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@mui/material";

import { ConfirmationProvider, useConfirmation } from "@/context/ConfirmationContext";
import { downloadFile } from "@/utils/file";

vi.mock("@/utils/file", () => ({ downloadFile: vi.fn() }));

const exportPdf = vi.fn(() =>
    Promise.resolve({
        data: new Blob(["%PDF-"]),
        headers: { "content-disposition": "attachment; filename=liquidacion.pdf" },
    })
);

const showToastSuccess = vi.fn();
const showToastError = vi.fn();

/** The same flow the pages run: confirm, call, download, toast. */
const ExportPdfButton = ({ fails = false }: { fails?: boolean }) => {
    const { openConfirmDialog } = useConfirmation();

    const handle = () => {
        openConfirmDialog({
            title: "Confirmar Exportación a PDF",
            message: "La liquidación se exportará en PDF.",
            confirmText: "Exportar PDF",
            onConfirm: async () => {
                if (fails) {
                    showToastError("Error al exportar el PDF.");
                    return;
                }
                const response = await exportPdf();
                downloadFile(
                    new Blob([response.data]),
                    "liquidacion.pdf",
                    response.headers["content-disposition"]
                );
                showToastSuccess("PDF exportado exitosamente.");
            },
        });
    };

    return (
        <Button color="error" onClick={handle}>
            PDF
        </Button>
    );
};

const renderButton = (props = {}) =>
    render(
        <ConfirmationProvider>
            <ExportPdfButton {...props} />
        </ConfirmationProvider>
    );

describe("PDF export button", () => {
    it("shows the button", () => {
        renderButton();

        expect(screen.getByRole("button", { name: "PDF" })).toBeInTheDocument();
    });

    it("asks for confirmation before exporting", async () => {
        const user = userEvent.setup();
        renderButton();

        await user.click(screen.getByRole("button", { name: "PDF" }));

        expect(await screen.findByText("Confirmar Exportación a PDF")).toBeInTheDocument();
        expect(screen.getByText("La liquidación se exportará en PDF.")).toBeInTheDocument();
        expect(exportPdf).not.toHaveBeenCalled();
    });

    it("does not export when the dialog is dismissed", async () => {
        const user = userEvent.setup();
        renderButton();

        await user.click(screen.getByRole("button", { name: "PDF" }));
        await user.click(screen.getByRole("button", { name: "Cancel" }));

        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        expect(exportPdf).not.toHaveBeenCalled();
    });

    it("downloads the file when confirmed", async () => {
        const user = userEvent.setup();
        renderButton();

        await user.click(screen.getByRole("button", { name: "PDF" }));
        await user.click(screen.getByRole("button", { name: "Exportar PDF" }));

        await waitFor(() => expect(exportPdf).toHaveBeenCalledOnce());
        expect(downloadFile).toHaveBeenCalledWith(
            expect.any(Blob),
            "liquidacion.pdf",
            "attachment; filename=liquidacion.pdf"
        );
        expect(showToastSuccess).toHaveBeenCalledWith("PDF exportado exitosamente.");
    });

    it("reports the error instead of downloading when the export fails", async () => {
        const user = userEvent.setup();
        renderButton({ fails: true });

        await user.click(screen.getByRole("button", { name: "PDF" }));
        await user.click(screen.getByRole("button", { name: "Exportar PDF" }));

        await waitFor(() => expect(showToastError).toHaveBeenCalled());
        expect(downloadFile).not.toHaveBeenCalled();
    });
});
