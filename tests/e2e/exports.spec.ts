/**
 * The export flows, driven through the built app in a real browser.
 */
import { expect, test } from "./fixtures";

test.describe("settlement", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/driver-payrolls/1/payroll/1");
    });

    test("shows the dispatch number of the shipment", async ({ page }) => {
        await expect(page.getByRole("columnheader", { name: "Remisión" })).toBeVisible();
        await expect(page.getByRole("gridcell", { name: "REM-1000" })).toBeVisible();
    });

    test("offers both exports", async ({ page }) => {
        await expect(page.getByRole("button", { name: "Exportar", exact: true })).toBeVisible();
        await expect(page.getByRole("button", { name: "PDF", exact: true })).toBeVisible();
    });

    test("asks for confirmation before exporting the PDF", async ({ page }) => {
        await page.getByRole("button", { name: "PDF", exact: true }).click();

        const dialog = page.getByRole("dialog");
        await expect(dialog).toContainText("Confirmar Exportación a PDF");
        await expect(dialog.getByRole("button", { name: "Exportar PDF" })).toBeVisible();
        await expect(dialog.getByRole("button", { name: "Cancel" })).toBeVisible();
    });

    test("downloads the PDF with the name the API sends", async ({ page }) => {
        await page.getByRole("button", { name: "PDF", exact: true }).click();

        const [download] = await Promise.all([
            page.waitForEvent("download"),
            page.getByRole("button", { name: "Exportar PDF" }).click(),
        ]);

        expect(download.suggestedFilename()).toContain("Liquidacion");
        expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    });

    test("downloads nothing when the dialog is cancelled", async ({ page }) => {
        let downloadStarted = false;
        page.on("download", () => (downloadStarted = true));

        await page.getByRole("button", { name: "PDF", exact: true }).click();
        await page.getByRole("button", { name: "Cancel" }).click();
        await page.waitForTimeout(500);

        expect(downloadStarted).toBe(false);
    });

    test("reports the error when the API fails", async ({ page }) => {
        await page.route("**/driver-payroll/export-pdf/**", (route) =>
            route.fulfill({ status: 500, contentType: "application/json", body: "{}" })
        );

        await page.getByRole("button", { name: "PDF", exact: true }).click();
        await page.getByRole("button", { name: "Exportar PDF" }).click();

        await expect(page.getByText(/Error al exportar el PDF/i)).toBeVisible();
    });

    test("still exports the Excel", async ({ page }) => {
        await page.getByRole("button", { name: "Exportar", exact: true }).click();

        const [download] = await Promise.all([
            page.waitForEvent("download"),
            page.getByRole("dialog").getByRole("button", { name: "Exportar", exact: true }).click(),
        ]);

        expect(download.suggestedFilename()).toMatch(/\.xlsx$/);
    });
});

test.describe("collection sheet", () => {
    test("downloads its PDF", async ({ page }) => {
        await page.goto("/shipment-payrolls/payroll/1");

        await page.getByRole("button", { name: "PDF", exact: true }).click();
        const [download] = await Promise.all([
            page.waitForEvent("download"),
            page.getByRole("button", { name: "Exportar PDF" }).click(),
        ]);

        expect(download.suggestedFilename()).toBe("cobranza_1.pdf");
    });
});

test.describe("session", () => {
    test("sends the token in the Authorization header", async ({ page }) => {
        const authorizations: (string | undefined)[] = [];
        page.on("request", (request) => {
            if (request.url().includes("/stub/api/")) {
                authorizations.push(request.headers()["authorization"]);
            }
        });

        await page.goto("/driver-payrolls/1/payroll/1");
        await expect(page.getByRole("gridcell", { name: "REM-1000" })).toBeVisible();

        expect(authorizations.length).toBeGreaterThan(0);
        expect(authorizations.every((value) => value?.startsWith("Bearer "))).toBe(true);
    });
});
