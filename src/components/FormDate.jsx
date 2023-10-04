import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Text, TextField, IconButton } from "@radix-ui/themes"

function FormDate({ startDate, setStartDate, endDate, setEndDate, onClick }) {
    return (
        <div className="flex flex-row gap-8 items-center justify-center mb-2">
            <label>
                <Text as="div" size="3" mb="1" weight="bold">
                    Fecha Inicio
                </Text>
                <TextField.Input
                    name="startDate"
                    type="date"
                    onChange={e => setStartDate(new Date(e.target.value))}
                    value={startDate.toISOString().slice(0, 10)}
                />
            </label>
            <label>
                <Text as="div" size="3" mb="1" weight="bold">
                    Fecha Fin
                </Text>
                <TextField.Input
                    name="endDate"
                    type="date"
                    onChange={e => setEndDate(new Date(e.target.value))}
                    value={endDate.toISOString().slice(0, 10)}
                />
            </label>
            <div className="mt-4">
            <IconButton size="3" onClick={onClick}>
                <MagnifyingGlassIcon width="20" height="20" />
            </IconButton>
            </div>
        </div>
    )
}

export default FormDate