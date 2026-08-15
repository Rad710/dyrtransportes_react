import { beforeEach, describe, expect, it, vi } from "vitest";

import { downloadFile } from "@/utils/file";

describe("downloadFile", () => {
    beforeEach(() => {
        // downloadFile leaves its link in the DOM until its timeout runs
        document.body.innerHTML = "";
        URL.createObjectURL = vi.fn(() => "blob:fake-url");
        URL.revokeObjectURL = vi.fn();
    });

    const download = (filename: string, contentDisposition?: string) => {
        const clicked: HTMLAnchorElement[] = [];
        const realClick = HTMLAnchorElement.prototype.click;
        HTMLAnchorElement.prototype.click = function click(this: HTMLAnchorElement) {
            clicked.push(this);
        };

        downloadFile(new Blob(["contenido"]), filename, contentDisposition);

        HTMLAnchorElement.prototype.click = realClick;
        return clicked;
    };

    it("takes the name from the Content-Disposition header", () => {
        const [link] = download(
            "por-defecto.pdf",
            "attachment; filename=JUAN PEREZ_Liquidacion_31/03/2026.pdf"
        );

        expect(link.download).toBe("JUAN PEREZ_Liquidacion_31/03/2026.pdf");
    });

    it("falls back to the given name when there is no header", () => {
        const [link] = download("liquidacion.pdf");

        expect(link.download).toBe("liquidacion.pdf");
    });

    it("falls back when the header carries no filename", () => {
        const [link] = download("cobranza.xlsx", "attachment");

        expect(link.download).toBe("cobranza.xlsx");
    });

    it("points the link at the blob", () => {
        const [link] = download("archivo.pdf");

        expect(URL.createObjectURL).toHaveBeenCalledOnce();
        expect(link.href).toContain("blob:fake-url");
    });

    it("cleans up the object url and the link", async () => {
        vi.useFakeTimers();
        downloadFile(new Blob(["x"]), "archivo.pdf");
        const linksWhileDownloading = document.querySelectorAll("a").length;

        vi.runAllTimers();
        vi.useRealTimers();

        expect(linksWhileDownloading).toBe(1);
        expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:fake-url");
        expect(document.querySelectorAll("a")).toHaveLength(0);
    });
});
