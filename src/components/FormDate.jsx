import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Text, TextField, IconButton } from "@radix-ui/themes";

function FormDate({ startDate, setStartDate, endDate, setEndDate, onClick }) {
    return (
        <div className="flex flex-row gap-8 items-center justify-center mb-2">
            <label>
                <Text as="div" size="3" mb="1" weight="bold">
                    Fecha Inicio
                </Text>
                <TextField.Slot
                    name="startDate"
                    type="date"
                    onChange={(e) => {
                        const inputDate = new Date(e.target.value);

                        if (!isNaN(inputDate)) {
                            setStartDate(inputDate);
                        } else {
                            setStartDate(null);
                        }
                    }}
                    value={startDate?.toISOString()?.slice(0, 10)}
                />
            </label>
            <label>
                <Text as="div" size="3" mb="1" weight="bold">
                    Fecha Fin
                </Text>
                <TextField.Slot
                    name="endDate"
                    type="date"
                    onChange={(e) => {
                        const inputDate = new Date(e.target.value);

                        if (!isNaN(inputDate)) {
                            setEndDate(inputDate);
                        } else {
                            setEndDate(null);
                        }
                    }}
                    value={endDate?.toISOString()?.slice(0, 10)}
                />
            </label>
            <div className="mt-4">
                <IconButton size="3" onClick={onClick}>
                    <MagnifyingGlassIcon width="20" height="20" />
                </IconButton>
            </div>
        </div>
    );
}

export default FormDate;
