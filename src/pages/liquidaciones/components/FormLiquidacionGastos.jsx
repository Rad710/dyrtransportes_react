import { useRef, useState } from "react";
import { isMobile } from "react-device-detect";

import { FileIcon, PlusIcon } from "@radix-ui/react-icons"
import { Button, Dialog, Flex, Select, Text, TextField } from "@radix-ui/themes"
import { Form } from "react-router-dom";
import CalloutMessage from "../../../components/CalloutMessage";
import { resetFormStyle } from "../../../utils/utils";
import { getLiquidacionGastos, postLiquidacionGasto, putLiquidacionGasto } from "../../../utils/liquidaciones";


function FormLiquidacionGastos({
    formData, setFormData,
    chofer, fecha,
    liquidacionGastos, setLiquidacionGastos
}) {

    const inputRefs = [
        useRef(null), useRef(null), useRef(null), useRef(null)
    ];

    const [inputStyles, setInputStyles] = useState({
        fecha: { color: 'indigo', variant: 'surface' },
        boleta: { color: 'indigo', variant: 'surface' },
        importe: { color: 'indigo', variant: 'surface' }
    })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [buttonText, setButtonText] = useState('')
    const [disableButton, setDisableButton] = useState(false)

    const [select, setSelect] = useState('')


    const handleKeyDown = async (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            if (index < inputRefs.length - 1) {
                inputRefs[index + 1].current.focus();
            }
        }
    }


    const onChange = (e) => {
        const fieldName = e.target.name
        const string = e.target.value

        if (['boleta', 'importe'].includes(fieldName)) {
            if (isNaN(Number(string))) {
                return
            }
        }

        const newFormData = { ...formData, [fieldName]: string }
        setFormData(newFormData)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        setDisableButton(true)
        // Create a new object for styles based on validation
        const newInputStyles = {};

        // Iterate over the keys of formData
        for (const field in formData) {
            if (formData[field] === '' || (formData[field] === null && select === 'conBoleta')) {
                newInputStyles[field] = { color: 'red', variant: 'soft' };
            }
        }

        setInputStyles(prevStyle => ({
            ...prevStyle,
            ...newInputStyles,
        }));

        if (Object.keys(newInputStyles).length > 1) {
            setError('Complete todos los campos');
            setSuccess('')
            setDisableButton(false)
            return
        }
        resetFormStyle(inputStyles, setInputStyles)

        let response = null
        if (formData.id === '') {
            response = await postLiquidacionGasto(formData)
        }
        else {
            response = await putLiquidacionGasto(formData)
            setButtonText('Agregar')
        }

        if (!response?.response && !response?.message) {
            setSuccess(`Entrada ${formData.id === '' ? 'añadida' : 'editada'} correctamente`);
            setError('');

            const resultGastos = await getLiquidacionGastos(chofer, fecha)

            const conBoleta = await resultGastos?.filter(gasto => gasto.boleta !== null)?.map(gasto => ({ ...gasto, checked: false }))
            const sinBoleta = await resultGastos?.filter(gasto => gasto.boleta === null)?.map(gasto => ({ ...gasto, checked: false }))

            setLiquidacionGastos({conBoleta: conBoleta ?? [], sinBoleta: sinBoleta ?? []})

            // resetear el form
            const resetFormData = {}
            for (const field in formData) {
                resetFormData[field] = ''
            }
            setFormData({
                id: "", fecha: "", chofer: chofer, boleta: null,
                importe: "", fechaLiquidacion: fecha, razon: ""
            })

        } else {
            setSuccess('')
            setError('A ocurrido un error');
        }
        setDisableButton(false)
    }


    const handleCerrar = () => {
        // resetear el form
        setFormData({
            id: "", fecha: "", chofer: chofer, boleta: null,
            importe: "", fechaLiquidacion: fecha, razon: ""
        })

        resetFormStyle(inputStyles, setInputStyles)

        setError('');
        setSuccess('')
        setSelect('')
        setDisableButton(false)
    }


    const handleEditar = () => {
        setButtonText('Editar')

        const [toEditConBoleta] = liquidacionGastos.conBoleta?.filter(entry => entry.checked)
        const [toEditSinBoleta] = liquidacionGastos.sinBoleta?.filter(entry => entry.checked)

        let toEdit = null
        if (toEditConBoleta !== undefined) {
            setSelect('conBoleta')
            toEdit = toEditConBoleta
        } else {
            setSelect('sinBoleta')
            toEdit = toEditSinBoleta
        }

        setFormData({
            id: toEdit.id, fecha: new Date(toEdit.fecha).toISOString().slice(0, 10), 
            chofer: chofer, boleta: toEdit.boleta, importe: toEdit.importe, 
            fechaLiquidacion: fecha, razon: toEdit.razon
        })
    }

    const onValueChange = (value) => {
        setSelect(value)

        if (value === 'sinBoleta') {
            setFormData({ ...formData, boleta: null})
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button color="indigo" variant="solid" size="4"
                    onClick={() => setButtonText('Agregar')}
                >
                    <PlusIcon width="20" height="20" />Agregar
                </Button>
            </Dialog.Trigger>
            <Dialog.Trigger>

                <Button color="teal" variant="solid" size="4"
                    disabled={
                        (liquidacionGastos.conBoleta.filter(entry => entry.checked).length + 
                        liquidacionGastos.sinBoleta.filter(entry => entry.checked).length) !== 1
                    }
                    onClick={handleEditar}
                >
                    <FileIcon width="20" height="20" />Editar
                </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }}>
                <Form onSubmit={(e) => handleSubmit(e)}>

                    <Dialog.Title>{`${buttonText} Entrada`}</Dialog.Title>
                    {error ? (
                        <CalloutMessage color="red" size="1">{error}</CalloutMessage>
                    ) : (success ? (
                        <CalloutMessage color="green" size="1">{success}</CalloutMessage>
                    ) : (
                        <Dialog.Description size="2" mb="4">
                            Ingresa los datos del gasto.
                        </Dialog.Description>
                    ))}


                    <Flex direction="column" gap="3">
                        <Flex direction={!isMobile ? "row" : "column"}  gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Tipo
                                </Text>

                                <Select.Root
                                    onValueChange={onValueChange}
                                >
                                    <Select.Trigger placeholder="Seleccione gasto"/>
                                    <Select.Content position="popper">
                                        <Select.Group>
                                            <Select.Item value="conBoleta">Gasto Con Boleta</Select.Item>
                                        </Select.Group>
                                        <Select.Separator />
                                        <Select.Group>
                                            <Select.Item value="sinBoleta">Gasto Sin Boleta</Select.Item>
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            </label>

                            {select === 'conBoleta' && (
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Boleta N°
                                    </Text>
                                    <TextField.Input
                                        name="boleta"
                                        placeholder="Boleta"
                                        ref={inputRefs[0]}
                                        onKeyDown={(e) => handleKeyDown(e, 0)}
                                        onChange={onChange}
                                        value={formData.boleta ?? ''}
                                        color={inputStyles.boleta.color}
                                        variant={inputStyles.boleta.variant}
                                    />
                                </label>
                            )}
                        </Flex>
                        <Flex direction={!isMobile ? "row" : "column"}  gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Fecha
                                </Text>
                                <TextField.Input
                                    name="fecha"
                                    type="date"
                                    ref={inputRefs[1]}
                                    onKeyDown={(e) => handleKeyDown(e, 1)}
                                    onChange={onChange}
                                    value={formData.fecha}
                                    color={inputStyles.fecha.color}
                                    variant={inputStyles.fecha.variant}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Importe
                                </Text>

                                <TextField.Input
                                    name="importe"
                                    type="number"
                                    placeholder="Importe"
                                    ref={inputRefs[2]}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
                                    onChange={onChange}
                                    value={formData.importe}
                                    color={inputStyles.importe.color}
                                    variant={inputStyles.importe.variant}
                                />
                            </label>
                        </Flex>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Razón
                            </Text>

                            <TextField.Input
                                name="razon"
                                type="text"
                                placeholder="Razón"
                                ref={inputRefs[3]}
                                onChange={onChange}
                                value={formData.razon}
                            />
                        </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray"
                                onClick={handleCerrar}
                            >
                                Cancelar
                            </Button>
                        </Dialog.Close>

                        <Button 
                            type="submit" 
                            color={buttonText === "Editar" ? "teal" : "indigo"}
                            disabled={disableButton}
                        >
                            {buttonText}
                        </Button>
                    </Flex>
                </Form>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default FormLiquidacionGastos