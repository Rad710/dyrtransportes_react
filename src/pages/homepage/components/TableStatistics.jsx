import { Table } from "@radix-ui/themes"

function TableStatistics({ statistics }) {

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Chofer</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Viajes</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Kg. Origen</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Kg. Destino</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Dif</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Fletes (Gs.)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Liquidaciones (Gs.)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Gastos Facturados (Gs.)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Gastos No Facturados (Gs.)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Total Gastos (Gs.)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Pérdidas (Gs.)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Ganancias (Gs.)</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>


            <Table.Body>
                {Object.keys(statistics).sort().map(chofer => {

                    const {
                        totalOrigen, totalDestino, totalFlete, totalLiquidacion,
                        totalFacturado, totalNoFacturado, viajes } = statistics[chofer]

                    const gastoTotal = totalFacturado + totalNoFacturado
                    const difference = totalLiquidacion - gastoTotal
                    const perdida = difference < 0 ? difference : 0

                    return (
                        <Table.Row key={chofer}>
                            <Table.RowHeaderCell>{chofer}</Table.RowHeaderCell>
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

                            <Table.Cell>
                                {totalFacturado.toLocaleString("es-ES")}
                            </Table.Cell>

                            <Table.Cell>
                                {totalNoFacturado.toLocaleString("es-ES")}
                            </Table.Cell>

                            <Table.Cell>
                                {gastoTotal.toLocaleString("es-ES")}
                            </Table.Cell>

                            <Table.Cell className="text-red-600 font-black">
                                {perdida.toLocaleString("es-ES")}
                            </Table.Cell>

                            <Table.Cell className="text-green-600 font-black">
                                {(totalFlete - totalLiquidacion + perdida).toLocaleString("es-ES")}
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table.Root>
    )
}

export default TableStatistics