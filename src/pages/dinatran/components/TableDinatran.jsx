import { Table } from "@radix-ui/themes"

function TableDinatran({ statistics }) {

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Chapa</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Viajes</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Kg. Origen</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Kg. Destino</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Dif</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Fletes (Gs.)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Liquidaciones (Gs.)</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>


            <Table.Body>
                {Object.keys(statistics).sort().map(unidad => {

                    const { viajes, totalOrigen, totalDestino, 
                        totalFlete, totalLiquidacion} = statistics[unidad]

                    return (
                        <Table.Row key={unidad}>
                            <Table.RowHeaderCell>{unidad}</Table.RowHeaderCell>
                            <Table.Cell>{viajes}</Table.Cell>

                            <Table.Cell>
                                {totalOrigen.toLocaleString("es-ES")}
                            </Table.Cell>

                            <Table.Cell>
                                {totalDestino.toLocaleString("es-ES")}
                            </Table.Cell>

                            <Table.Cell>
                                {(totalDestino - totalOrigen).toLocaleString("es-ES")}
                            </Table.Cell>

                            <Table.Cell>
                                {totalFlete.toLocaleString("es-ES")}
                            </Table.Cell>

                            <Table.Cell>
                                {totalLiquidacion.toLocaleString("es-ES")}
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table.Root>
    )
}

export default TableDinatran
