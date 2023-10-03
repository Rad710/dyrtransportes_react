import { Table, Checkbox } from "@radix-ui/themes"

function TableNomina({ nomina, setNomina }) {

    const handleChange = (index) => {
        setNomina(nomina.map((entrada, i) => (
            index === i ? { ...entrada, checked: !entrada.checked } : entrada
        )))
    }

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell width="5rem"></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Chofer</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Chapa</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {nomina.map((entrada, index) => (
                    <Table.Row key={entrada.chofer + entrada.chapa}>
                        <Table.Cell>
                            <Checkbox
                                checked={entrada.checked}
                                onCheckedChange={() => handleChange(index)}
                            />
                        </Table.Cell>

                        <Table.RowHeaderCell>{entrada.chofer}</Table.RowHeaderCell>
                        <Table.Cell>{entrada.chapa}</Table.Cell>
                        {/* <Table.Cell>
                            {Number(entrada.precio).toLocaleString("es-ES", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Table.Cell> */}

                    </Table.Row>
                ))}

            </Table.Body>
        </Table.Root >
    )
}

export default TableNomina