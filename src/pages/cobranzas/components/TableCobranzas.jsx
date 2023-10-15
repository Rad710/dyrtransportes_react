import { Table, Checkbox } from "@radix-ui/themes"
import React from "react"


function TableCobranzas({ cobranzas, setCobranzas, tracker, setTracker }) {

    const groupsAndProducts = Object.keys(cobranzas).map(group => {
        const [origen, destino] = group.split('/')

        return {
            group: group, origen: origen, destino: destino,
            product: cobranzas[group].viajes.at(0)?.viaje?.producto
        }
    })

    const orderedGroups = groupsAndProducts
        .sort((a, b) => ['product', 'origen', 'destino'].reduce((acc, key) => acc || a[key].localeCompare(b[key]), 0))
        .map(item => item.group)

    const totalOrigen = Object.keys(cobranzas)
        .reduce((total, grupo) => cobranzas[grupo].subtotalOrigen + total, 0)

    const totalDestino = Object.keys(cobranzas)
        .reduce((total, grupo) => cobranzas[grupo].subtotalDestino + total, 0)

    const totalDiferencia = Object.keys(cobranzas)
        .reduce((total, grupo) => cobranzas[grupo].subtotalDiferencia + total, 0)

    const totalGS = Object.keys(cobranzas)
        .reduce((total, grupo) => cobranzas[grupo].subtotalGS + total, 0)


    const handleChange = (grupo, index) => {
        const newViaje = {
            ...cobranzas[grupo].viajes[index],
            checked: !cobranzas[grupo].viajes[index].checked
        }

        const newCobranza = {
            ...cobranzas[grupo],
            viajes: cobranzas[grupo].viajes.map((viaje, i) => (
                i === index ? newViaje : viaje
            ))
        }

        if (!cobranzas[grupo].viajes[index].checked) {
            setTracker([...tracker, { id: cobranzas[grupo].viajes[index].viaje.id, grupo: grupo, index: index }])
        } else {
            setTracker(tracker.filter(viaje => viaje.id !== cobranzas[grupo].viajes[index].viaje.id))
        }

        setCobranzas({ ...cobranzas, [grupo]: newCobranza })
    }


    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell width="0.5rem"></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Chofer</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Chapa</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Origen</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Destino</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Tiquet</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Kg. Origen</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Kg. Destino</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Dif</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Precio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {orderedGroups.map(grupo => (
                    <React.Fragment key={grupo}>
                        {cobranzas[grupo].viajes.map((cobranza, index) => (
                            <Table.Row key={cobranza.viaje.id}>
                                <Table.Cell>
                                    <Checkbox
                                        checked={cobranza.checked}
                                        onCheckedChange={() => handleChange(grupo, index)}
                                    />
                                </Table.Cell>

                                <Table.RowHeaderCell>{new Date(cobranza.viaje.fechaViaje)
                                    .toLocaleDateString("es-ES", {
                                        year: "numeric", month: "numeric", day: "numeric", timeZone: "GMT"
                                    })}
                                </Table.RowHeaderCell>
                                <Table.Cell>{cobranza.viaje.chofer}</Table.Cell>
                                <Table.Cell>{cobranza.viaje.chapa}</Table.Cell>
                                <Table.Cell>{cobranza.viaje.producto}</Table.Cell>
                                <Table.Cell>{cobranza.viaje.origen}</Table.Cell>
                                <Table.Cell>{cobranza.viaje.destino}</Table.Cell>
                                <Table.Cell>
                                    {Number(cobranza.viaje.tiquet).toLocaleString("es-ES")}
                                </Table.Cell>
                                <Table.Cell>
                                    {Number(cobranza.viaje.kgOrigen).toLocaleString("es-ES")}
                                </Table.Cell>
                                <Table.Cell>
                                    {Number(cobranza.viaje.kgDestino).toLocaleString("es-ES")}
                                </Table.Cell>
                                <Table.Cell>{cobranza.viaje.kgDestino - cobranza.viaje.kgOrigen}</Table.Cell>
                                <Table.Cell>{Number(cobranza.viaje.precio).toLocaleString("es-ES", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                                </Table.Cell>
                                <Table.Cell>{(Number(cobranza.viaje.precio) * cobranza.viaje.kgDestino)
                                    .toLocaleString("es-ES", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 1,
                                    })}
                                </Table.Cell>
                            </Table.Row>
                        ))}

                        <Table.Row>
                            <Table.Cell></Table.Cell>

                            <Table.RowHeaderCell>
                                <em className="font-bold">Subtotal:</em>
                            </Table.RowHeaderCell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>
                                <em className="font-bold">{Number(cobranzas[grupo].subtotalOrigen)
                                    .toLocaleString("es-ES", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 1,
                                    })}
                                </em>
                            </Table.Cell>
                            <Table.Cell>
                                <em className="font-bold">{Number(cobranzas[grupo].subtotalDestino)
                                    .toLocaleString("es-ES", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 1,
                                    })}
                                </em>
                            </Table.Cell>
                            <Table.Cell>
                                <em className="font-bold">{Number(cobranzas[grupo].subtotalDiferencia)
                                    .toLocaleString("es-ES", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 1,
                                    })}
                                </em>
                            </Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>
                                <em className="font-bold">{Number(cobranzas[grupo].subtotalGS)
                                    .toLocaleString("es-ES", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 1,
                                    })}
                                </em>
                            </Table.Cell>
                        </Table.Row>
                    </React.Fragment>
                ))}
                {Object.keys(cobranzas).length > 0 && (
                    <Table.Row className="bg-gray-200">
                        <Table.Cell></Table.Cell>

                        <Table.RowHeaderCell>
                            <em className="font-bold">TOTAL:</em>
                        </Table.RowHeaderCell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell>
                            <em className="font-bold">
                                {totalOrigen.toLocaleString("es-ES", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 1,
                                })}
                            </em>
                        </Table.Cell>
                        <Table.Cell>
                            <em className="font-bold">
                                {totalDestino.toLocaleString("es-ES", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 1,
                                })}
                            </em>
                        </Table.Cell>
                        <Table.Cell>
                            <em className="font-bold">
                                {totalDiferencia.toLocaleString("es-ES", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 1,
                                })}
                            </em>
                        </Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell>
                            <em className="font-bold">
                                {totalGS.toLocaleString("es-ES", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 1,
                                })}
                            </em>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    )
}

export default TableCobranzas