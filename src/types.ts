import { GroupBase } from "react-select";

export type PropsTitle = {
    title: string;
};

export type PromiseResult = {
    success?: string;
    error?: string;
};

export type SelectOption = {
    label: string;
    value: string;
} & GroupBase<number> &
    GroupBase<string>;
