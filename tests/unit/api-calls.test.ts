/**
 * The API helpers: which URL they hit and how the parameters travel.
 *
 * The axios instance is mocked, these tests are about the request the frontend
 * builds, not about the server.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DateTime } from "luxon";

const get = vi.fn(() => Promise.resolve({ data: null, headers: {} }));

vi.mock("@/utils/axios", () => ({
    api: {
        get,
        post: vi.fn(() => Promise.resolve({ data: null })),
        put: vi.fn(() => Promise.resolve({ data: null })),
        patch: vi.fn(() => Promise.resolve({ data: null })),
        delete: vi.fn(() => Promise.resolve({ data: null })),
    },
}));

const { DriverPayrollApi } = await import("@/pages/driver-payrolls/utils");
const { ShipmentApi, ShipmentPayrollApi } = await import("@/pages/shipment-payrolls/utils");
const { getStatisticsData, exportStatisticData } = await import(
    "@/pages/home/components/DriverStatisticsTabContent"
);

const lastCall = () => ({ url: get.mock.calls.at(-1)?.[0], config: get.mock.calls.at(-1)?.[1] });

describe("PDF exports", () => {
    beforeEach(() => get.mockClear());

    it("the settlement asks the export-pdf endpoint for a blob", async () => {
        await DriverPayrollApi.exportDriverPayrollPdf(7);

        expect(lastCall().url).toBe("/driver-payroll/export-pdf/7");
        expect(lastCall().config).toMatchObject({ responseType: "blob" });
    });

    it("the collection sheet asks the export-pdf endpoint for a blob", async () => {
        await ShipmentApi.exportShipmentListPdf(3);

        expect(lastCall().url).toBe("/shipments/export-pdf?shipment_payroll_code=3");
        expect(lastCall().config).toMatchObject({ responseType: "blob" });
    });

    it("the Excel exports keep pointing at export-excel", async () => {
        await DriverPayrollApi.exportDriverPayroll(7);
        expect(lastCall().url).toBe("/driver-payroll/export-excel/7");

        await ShipmentApi.exportShipmentList(3);
        expect(lastCall().url).toBe("/shipments/export-excel?shipment_payroll_code=3");
    });
});

describe("dates in the query string", () => {
    beforeEach(() => get.mockClear());

    // A Luxon date with a positive offset writes '+00:00'. Interpolated into
    // the URL the '+' means a space and the API answered 500.
    const start = DateTime.fromISO("2026-07-15T00:00:00", { zone: "UTC" });
    const end = DateTime.fromISO("2026-08-16T00:00:00", { zone: "UTC" });

    it("the statistics send the dates as params, not glued to the url", async () => {
        await getStatisticsData(start, end);

        expect(lastCall().url).toBe("/statistics/driver");
        expect(lastCall().config).toMatchObject({
            params: { start_date: start, end_date: end },
        });
    });

    it("the statistics export sends them as params too", async () => {
        await exportStatisticData(start, end);

        expect(lastCall().url).toBe("/statistics/driver/export-excel");
        expect(lastCall().config).toMatchObject({
            params: { start_date: start, end_date: end },
            responseType: "blob",
        });
    });

    it("the payroll export by date range sends them as params", async () => {
        await ShipmentPayrollApi.exportShipmentPayrollList(start, end);

        expect(lastCall().url).toBe("/shipment-payrolls/export-excel");
        expect(lastCall().config).toMatchObject({
            params: { start_date: start, end_date: end },
        });
    });

    it("no url built by the helpers carries a raw date", async () => {
        await getStatisticsData(start, end);
        await exportStatisticData(start, end);
        await ShipmentPayrollApi.exportShipmentPayrollList(start, end);

        for (const call of get.mock.calls) {
            expect(String(call[0])).not.toContain("start_date=");
            expect(String(call[0])).not.toContain("+00:00");
        }
    });
});
