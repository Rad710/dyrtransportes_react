import { Table, Checkbox } from "@radix-ui/themes"


function TableLiquidacionViajes({ liquidacionViajes, setLiquidacionViajes }) {

    const handleCheckedChange = (index) => {
        const newViajes = liquidacionViajes.map((viaje, i) => (
            i === index ? { ...viaje, checked: !viaje.checked } : viaje
        ))
        setLiquidacionViajes(newViajes)
    }

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell width="0.5rem"></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Tiquet</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Origen</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Destino</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Kg. Origen</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Kg. Destino</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Dif</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Precio Liquidación</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>


            <Table.Body>
                {liquidacionViajes.map((viaje, index) => (
                    <Table.Row key={viaje.id}>
                        <Table.Cell>
                            <Checkbox
                                checked={viaje.checked}
                                onCheckedChange={() => handleCheckedChange(index)}
                            />
                        </Table.Cell>

                        <Table.RowHeaderCell>{new Date(viaje.fechaViaje)
                            .toLocaleDateString("es-ES", {
                                year: "numeric", month: "numeric", day: "numeric", timeZone: "GMT"
                            })}
                        </Table.RowHeaderCell>
                        <Table.Cell>
                            {Number(viaje.tiquet).toLocaleString("es-ES")}
                        </Table.Cell>
                        <Table.Cell>{viaje.producto}</Table.Cell>
                        <Table.Cell>{viaje.origen}</Table.Cell>
                        <Table.Cell>{viaje.destino}</Table.Cell>
                        <Table.Cell>
                            {Number(viaje.kgOrigen).toLocaleString("es-ES")}
                        </Table.Cell>
                        <Table.Cell>
                            {Number(viaje.kgDestino).toLocaleString("es-ES")}
                        </Table.Cell>

                        <Table.Cell>
                            {(viaje.kgDestino - viaje.kgOrigen).toLocaleString("es-ES")}
                        </Table.Cell>

                        <Table.Cell>{Number(viaje.precioLiquidacion).toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                        </Table.Cell>
                        <Table.Cell>{(Number(viaje.precioLiquidacion) * viaje.kgDestino)
                            .toLocaleString("es-ES", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 1,
                            })}
                        </Table.Cell>
                    </Table.Row>
                ))}

                {liquidacionViajes.length > 0 && (
                    <Table.Row className="bg-gray-200">
                        <Table.Cell></Table.Cell>

                        <Table.RowHeaderCell>
                            <em className="font-bold">TOTAL:</em>
                        </Table.RowHeaderCell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell>
                            <em className="font-bold">
                                {liquidacionViajes.reduce((total, viaje) => viaje.kgOrigen + total, 0)
                                    .toLocaleString("es-ES")}
                            </em>
                        </Table.Cell>

                        <Table.Cell>
                            <em className="font-bold">
                                {liquidacionViajes.reduce((total, viaje) => viaje.kgDestino + total, 0)
                                    .toLocaleString("es-ES")}
                            </em>
                        </Table.Cell>

                        <Table.Cell>
                            <em className="font-bold">
                                {liquidacionViajes.reduce((total, viaje) => (viaje.kgDestino - viaje.kgOrigen) + total, 0)
                                    .toLocaleString("es-ES")}
                            </em>
                        </Table.Cell>

                        <Table.Cell></Table.Cell>

                        <Table.Cell>
                            <em className="font-bold">
                                {liquidacionViajes.reduce((total, viaje) => (
                                    (Number(viaje.precioLiquidacion) * viaje.kgDestino) + total), 0)
                                    .toLocaleString("es-ES", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 1,
                                    })
                                }
                            </em>
                        </Table.Cell>

                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    )
}

export default TableLiquidacionViajes