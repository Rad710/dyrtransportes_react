import { useState, useEffect } from "react"

import { Link, Form, useLoaderData } from "react-router-dom"
import { Checkbox, Flex, Button } from "@radix-ui/themes"
import { PlusIcon, TableIcon } from "@radix-ui/react-icons";

import AlertButton from "../../components/AlertButton"
import CalloutMessage from "../../components/CalloutMessage";

import { getPlanillas, postPlanilla, deletePlanilla, getExportarInforme } from "../../utils/cobranza";


export async function loader() {
    const result = await getPlanillas()

    if (!result?.response) {
        const fechas = result.map(fecha => new Date(fecha).toISOString().slice(0, 4))

        // Remove duplicates using a Set
        const uniqueFechasSet = new Set(fechas)
        // Convert the Set back to an array
        const uniqueFechas = Array.from(uniqueFechasSet)
        return uniqueFechas.map(year => ({ year: Number(year), checked: false })).reverse()
    } else {
        setError(data.response.data)
        return []
    }
}


function ListaPlanillas({ title }) {
    useEffect(() => {
        document.title = title;
      }, []);

    const [years, setYears] = useState(useLoaderData())
    const [error, setError] = useState(null)


    const handleDelete = async () => {
        const yearsChecked = years.filter(planilla => planilla.checked === true).map(planilla => planilla.year)

        const result = await getPlanillas()

        const toDelete = result.filter(fecha => {
            const year = Number(new Date(fecha).toISOString().slice(0, 4))
            return yearsChecked.includes(year)

        }).map(fecha => (new Date(fecha).toISOString().slice(0, 10)))

        const deletePromises = toDelete.map(async (item) => (await deletePlanilla(item)))

        const confirmDelete = await Promise.all(deletePromises);

        confirmDelete.forEach(element => {
            if (element?.response) {
                setError(element.response.data)
            }
        });

        const newYears = years.filter(planilla => planilla.checked !== true)
        setYears(newYears)
    }


    const handleCheckboxChange = (year) => {
        const newYears = years.map(planilla => {
            if (planilla.year === year) {
                return { ...planilla, checked: !planilla.checked }
            }
            return planilla
        })
        setYears(newYears)
    }


    const handleSubmit = async (newYear) => {
        const result = await postPlanilla(new Date(newYear, 0, 1))

        if (!result?.response) {
            setYears([{ year: newYear, checked: false }, ...years])
        } else {
            setError(result.response.data)
        }
    }

    const handleExportar = async () => {
        const checkedYears = years.filter(year => year.checked)
        if (checkedYears.length === 1) {
            const [toExport] = checkedYears

            console.log('Exportando...')
            const fechaInicio = new Date(toExport.year, 0, 1).toISOString().slice(0, 10)
            const fechaFin = new Date(toExport.year, 11, 31).toISOString().slice(0, 10)
            console.log(fechaInicio, fechaFin)
            await getExportarInforme(fechaInicio, fechaFin)
        }
    }


    return (
        <div className="p-4">
            <div className="md:flex justify-between mb-8 items-center">
                <h2 className="text-3xl font-bold text-left md:w-1/3">Listado de Planillas</h2>

                <div className="gap-5 flex justify-end md:2/3">
                    <Button color="grass" variant="solid" size="4"
                        onClick={handleExportar}
                        disabled={years.filter(year => year.checked).length > 1}
                    >
                        <TableIcon width="20" height="20" />Exportar
                    </Button>

                    <AlertButton
                        handleDelete={handleDelete}
                        disabled={!years.some(year => year.checked === true)}
                    />
                </div>
            </div>

            <ul className="text-2xl font-bold items-center flex flex-col space-y-5">
                {years.map(planilla => (
                    <li className="flex"
                        key={planilla.year}>
                        <Flex align="center">
                            <Checkbox mr="4"
                                checked={planilla.checked}
                                onCheckedChange={() => handleCheckboxChange(planilla.year)} />
                            <Link
                                className="bg-blue-700 hover:bg-blue-600 text-white text-center rounded-md shadow-md px-10 py-2"
                                to={`/cobranzas/${planilla.year}`}
                            >{planilla.year}</Link>
                        </Flex>
                    </li>
                ))}

                <Form
                    onSubmit={() => handleSubmit(years[years.length - 1] ? years[years.length - 1].year + 1 : 2023)}>
                    {error ?
                        (<CalloutMessage color="red" size="3">A ocurrido un error</CalloutMessage>) :
                        (<Button color="grass" variant="surface" size="4" type="submit" ml="6">
                            <PlusIcon width="20" height="20" />Agregar Año
                        </Button>)
                    }
                </Form>
            </ul>
        </div>
    )
}

export default ListaPlanillas