import { Table, Checkbox } from "@radix-ui/themes"

function TablePrecios({ listaPrecios, setListaPrecios }) {
    const handleChange = (index) => {
        setListaPrecios(listaPrecios.map((entrada, i) => (
            index === i ? { ...entrada, checked: !entrada.checked } : entrada
        )))
    }

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell width="5rem"></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Origen</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Destino</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Precio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Precio Liquidación</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {listaPrecios.map((entrada, index) => (
                    <Table.Row key={entrada.origen + entrada.destino}>
                        <Table.Cell>
                            <Checkbox
                                checked={entrada.checked}
                                onCheckedChange={() => handleChange(index)}
                            />
                        </Table.Cell>

                        <Table.RowHeaderCell>{entrada.origen}</Table.RowHeaderCell>
                        <Table.Cell>{entrada.destino}</Table.Cell>
                        <Table.Cell>
                            {Number(entrada.precio).toLocaleString("es-ES", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Table.Cell>
                        <Table.Cell>
                            {Number(entrada.precioLiquidacion).toLocaleString("es-ES", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Table.Cell>
                    </Table.Row>
                ))}

            </Table.Body>
        </Table.Root >
    )
}

export default TablePrecios