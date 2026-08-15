/**
 * A stubbed API, so the end to end suite needs no backend.
 *
 * Every route the pages under test call is answered here with the shape the
 * real API returns.
 */
import { test as base, expect, type Page } from "@playwright/test";

export const TOKEN_PAYLOAD = { user_id: "1", exp: Math.floor(Date.now() / 1000) + 3600 };

const base64url = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");

export const FAKE_TOKEN = `${base64url({ alg: "HS256" })}.${base64url(TOKEN_PAYLOAD)}.firma`;

export const DRIVER = {
    driver_code: 1,
    driver_id: "1234567",
    driver_name: "JUAN",
    driver_surname: "PEREZ",
    truck_plate: "ABC123",
    trailer_plate: "TRA123",
    deleted: false,
};

export const DRIVER_PAYROLL = {
    payroll_code: 1,
    driver_code: 1,
    payroll_timestamp: "Tue, 31 Mar 2026 00:00:00 GMT",
    paid: false,
    paid_timestamp: null,
    deleted: false,
};

export const SHIPMENT = {
    shipment_code: 1,
    shipment_date: "Sun, 01 Mar 2026 00:00:00 GMT",
    driver_code: 1,
    driver_name: "JUAN PEREZ",
    truck_plate: "ABC123",
    trailer_plate: "TRA123",
    product_code: 1,
    product_name: "SOJA",
    route_code: 1,
    origin: "PUERTO CAACUPEMI",
    destination: "CAMPO NUEVE",
    dispatch_code: "REM-1000",
    receipt_code: "REC-2000",
    origin_weight: "30000",
    destination_weight: "29950",
    price: "120.75",
    payroll_price: "55.50",
    shipment_payroll_code: 1,
    driver_payroll_code: 1,
    deleted: false,
};

const PDF_BYTES = "%PDF-1.7 documento de prueba";
const XLSX_BYTES = "PK planilla de prueba";

/** Answers every API call the app makes with canned data. */
export const stubApi = async (page: Page) => {
    await page.route("**/stub/api/**", async (route) => {
        const url = new URL(route.request().url());
        const path = url.pathname.replace("/stub/api", "");

        const json = (body: unknown, status = 200) =>
            route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

        if (path === "/auth/log-in") {
            return json({ token: FAKE_TOKEN, user: { user_id: "1", name: "Tester" } });
        }
        if (path.startsWith("/driver-payroll/export-pdf/")) {
            return route.fulfill({
                status: 200,
                contentType: "application/pdf",
                headers: {
                    "content-disposition":
                        "attachment; filename=JUAN PEREZ_Liquidacion_31/03/2026.pdf",
                },
                body: PDF_BYTES,
            });
        }
        if (path === "/shipments/export-pdf") {
            return route.fulfill({
                status: 200,
                contentType: "application/pdf",
                headers: { "content-disposition": "attachment; filename=cobranza_1.pdf" },
                body: PDF_BYTES,
            });
        }
        if (path.includes("export-excel")) {
            return route.fulfill({
                status: 200,
                contentType:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers: { "content-disposition": "attachment; filename=liquidacion.xlsx" },
                body: XLSX_BYTES,
            });
        }
        if (path === "/driver/1") return json(DRIVER);
        if (path === "/drivers") return json([DRIVER]);
        if (path === "/driver-payroll/1") return json(DRIVER_PAYROLL);
        if (path === "/shipments") return json([SHIPMENT]);
        if (path === "/shipment-expenses") return json([]);
        if (path === "/shipment-payrolls") return json([]);
        if (path === "/products") return json([{ product_code: 1, product_name: "SOJA" }]);
        if (path === "/routes") {
            return json([
                {
                    route_code: 1,
                    origin: "PUERTO CAACUPEMI",
                    destination: "CAMPO NUEVE",
                    price: "120.75",
                    payroll_price: "55.50",
                },
            ]);
        }

        return json([]);
    });
};

/** Puts a session in place so the app does not bounce to the log in page. */
export const logIn = async (page: Page) => {
    await page.addInitScript(
        ([token]) => {
            sessionStorage.setItem("token", token as string);
            sessionStorage.setItem(
                "user",
                JSON.stringify({ user_id: "1", name: "Tester", email: "tester@dyr.com" })
            );
        },
        [FAKE_TOKEN]
    );
};

export const test = base.extend<{ apiStubbed: void }>({
    apiStubbed: [
        async ({ page }, use) => {
            await stubApi(page);
            await logIn(page);
            await use();
        },
        { auto: true },
    ],
});

export { expect };
