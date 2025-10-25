import type { AutocompleteOption } from "@/types";
import type { ShipmentType } from "./schema";

export type GroupedShipments = {
    shipments: ShipmentType[];
    product: string;
    origin: string;
    destination: string;

    subtotal_origin_weight: string;
    subtotal_destination_weight: string;
    subtotal_difference: string;
    subtotal_money: string;
};

export interface AutocompleteOptionDriver extends AutocompleteOption {
    truck_plate: string;
    trailer_plate: string;
}
