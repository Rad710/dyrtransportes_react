import Globalize from "globalize";
import cldrDataES from "cldr-data/main/es/numbers.json";
import cldrDataEN from "cldr-data/main/en/numbers.json";
import cldrDataSupplementSubTags from "cldr-data/supplemental/likelySubtags.json";

Globalize.load(cldrDataSupplementSubTags);
Globalize.load(cldrDataEN);
Globalize.load(cldrDataES);

Globalize.locale("es");

export const getGlobalizeParser = () => {
    return Globalize.numberParser();
};

export const getGlobalizeNumberFormatter = (
    minimumFractionDigits: number,
    maximumFractionDigits: number,
) => {
    return Globalize.numberFormatter({
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: maximumFractionDigits,
    });
};
