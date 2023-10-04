import { Table, Checkbox, Heading } from "@radix-ui/themes"

function TableLiquidacionGastos({ liquidacionGastos, setLiquidacionGastos }) {

  const handleCheckedChange = (tipo, index) => {
    const newGastos = liquidacionGastos[tipo].map((gasto, i) => (
      i === index ? { ...gasto, checked: !gasto.checked } : gasto
    ))
    setLiquidacionGastos({ ...liquidacionGastos, [tipo]: newGastos })
  }


  return (
    <div className="md:grid md:grid-cols-2">
      <div className="mt-2 md:mt-0">
        <Heading mb="2" size="5" ml="4">Con Boleta</Heading>

        <div className="md:border-r md:border-gray-200">
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell width="0.5rem"></Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Boleta</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Importe</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Razón</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {liquidacionGastos.conBoleta.map((gasto, index) => (
                <Table.Row key={gasto.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={gasto.checked}
                      onCheckedChange={() => handleCheckedChange('conBoleta', index)}
                    />
                  </Table.Cell>

                  <Table.RowHeaderCell>{new Date(gasto.fecha)
                    .toLocaleDateString("es-ES", {
                      year: "numeric", month: "numeric", day: "numeric", timeZone: "GMT"
                    })}
                  </Table.RowHeaderCell>
                  <Table.Cell>{gasto.boleta}</Table.Cell>
                  <Table.Cell>{gasto.importe.toLocaleString("es-ES")}</Table.Cell>
                  <Table.Cell>{gasto.razon}</Table.Cell>
                </Table.Row>
              ))}
              {liquidacionGastos.conBoleta.length > 0 && (
                <Table.Row className="bg-gray-200">
                  <Table.Cell></Table.Cell>

                  <Table.RowHeaderCell>
                    <em className="font-bold">Subtotal:</em>
                  </Table.RowHeaderCell>

                  <Table.Cell></Table.Cell>

                  <Table.Cell>
                    <em className="font-bold">
                      {liquidacionGastos.conBoleta.reduce((total, gasto) => gasto.importe + total, 0)
                        .toLocaleString("es-ES")}
                    </em>
                  </Table.Cell>

                  <Table.Cell></Table.Cell>
                </Table.Row>
              )}

            </Table.Body>
          </Table.Root>
        </div>
        {liquidacionGastos.conBoleta.length === 0 && (
          <p className="text-center p-4 text-lg">
            No hay datos ingresados
          </p>
        )}
      </div>

      <div className="mt-4 md:mt-0">
        <Heading mb="2" size="5" ml="4">Sin Boleta</Heading>

        <div className="md:border-l-2 md:border-gray-200">
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell width="0.5rem"></Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Importe</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Razón</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {liquidacionGastos.sinBoleta.map((gasto, index) => (
                <Table.Row key={gasto.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={gasto.checked}
                      onCheckedChange={() => handleCheckedChange('sinBoleta', index)}
                    />
                  </Table.Cell>

                  <Table.RowHeaderCell>{new Date(gasto.fecha)
                    .toLocaleDateString("es-ES", {
                      year: "numeric", month: "numeric", day: "numeric", timeZone: "GMT"
                    })}
                  </Table.RowHeaderCell>
                  <Table.Cell>{gasto.importe.toLocaleString("es-ES")}</Table.Cell>
                  <Table.Cell>{gasto.razon}</Table.Cell>
                </Table.Row>
              ))}

              {liquidacionGastos.sinBoleta.length > 0 && (
                <Table.Row className="bg-gray-200">
                  <Table.Cell></Table.Cell>

                  <Table.RowHeaderCell>
                    <em className="font-bold">Subtotal:</em>
                  </Table.RowHeaderCell>

                  <Table.Cell>
                    <em className="font-bold">
                      {liquidacionGastos.sinBoleta.reduce((total, gasto) => gasto.importe + total, 0)
                        .toLocaleString("es-ES")}
                    </em>
                  </Table.Cell>

                  <Table.Cell></Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
          {liquidacionGastos.sinBoleta.length === 0 && (
            <p className="text-center p-4 text-lg">
              No hay datos ingresados
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TableLiquidacionGastos