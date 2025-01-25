import { Table, Checkbox } from "@radix-ui/themes"
import React from "react"


function TableCobranzas({ cobranzas, setCobranzas, tracker, setTracker }) {

    const totalOrigen = cobranzas.reduce((total, grupo) => grupo.subtotalOrigen + total, 0)

    const totalDestino = cobranzas.reduce((total, grupo) => grupo.subtotalDestino + total, 0)

    const totalDiferencia = cobranzas.reduce((total, grupo) => grupo.subtotalDiferencia + total, 0)

    const totalGS = cobranzas.reduce((total, grupo) => grupo.subtotalGS + total, 0)

    const handleChange = (indexGrupo, indexViaje) => {

        const newCobranzas = cobranzas.map((grupo, indexCobranzas) => (
            indexCobranzas === indexGrupo ? (
                {
                    ...grupo, viajes: grupo.viajes.map((viaje, index) => (index === indexViaje) ? (
                        { ...viaje, checked: !viaje.checked }
                    ) : viaje)
                }
            ) : grupo))

        if (!cobranzas[indexGrupo].viajes[indexViaje].checked) {
            setTracker([...tracker, { id: cobranzas[indexGrupo].viajes[indexViaje].viaje.id, grupo: indexGrupo, index: indexViaje }])
        } else {
            setTracker(tracker.filter(viaje => viaje.id !== cobranzas[indexGrupo].viajes[indexViaje].viaje.id))
        }

        setCobranzas(newCobranzas)
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
                    <Table.ColumnHeaderCell>Tiquet Remisión</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Kg. Origen</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Kg. Destino</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Dif</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Precio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {cobranzas.map((grupo, index) => {
                    const { producto, origen, destino } = grupo.viajes.at(0).viaje
                    return (
                        <React.Fragment key={`${producto}|${origen}|${destino}`}>
                            {grupo.viajes.map((cobranza, indexViaje) => (
                                <Table.Row key={cobranza.viaje.id} className={cobranza.checked ? "bg-gray-200" : ""}>
                                    <Table.Cell>
                                        <Checkbox
                                            checked={cobranza.checked}
                                            onCheckedChange={() => handleChange(index, indexViaje)}
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
                                    <Table.Cell>{cobranza.viaje.tiquetRemision}</Table.Cell>
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
                                <Table.Cell></Table.Cell>
                                <Table.Cell>
                                    <em className="font-bold">{Number(grupo.subtotalOrigen)
                                        .toLocaleString("es-ES", {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 1,
                                        })}
                                    </em>
                                </Table.Cell>
                                <Table.Cell>
                                    <em className="font-bold">{Number(grupo.subtotalDestino)
                                        .toLocaleString("es-ES", {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 1,
                                        })}
                                    </em>
                                </Table.Cell>
                                <Table.Cell>
                                    <em className="font-bold">{Number(grupo.subtotalDiferencia)
                                        .toLocaleString("es-ES", {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 1,
                                        })}
                                    </em>
                                </Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell>
                                    <em className="font-bold">{Number(grupo.subtotalGS)
                                        .toLocaleString("es-ES", {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 1,
                                        })}
                                    </em>
                                </Table.Cell>
                            </Table.Row>
                        </React.Fragment>
                    )
                })}
                {cobranzas.length > 0 && (
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

export default React.memo(TableCobranzas, (prevProps, nextProps) => {
    // Only re-render when cobranzas or tracker change
    return (
        prevProps.cobranzas === nextProps.cobranzas
    );
});