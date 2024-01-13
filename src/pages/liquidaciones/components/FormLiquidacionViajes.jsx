import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

import { FileIcon, PlusIcon } from "@radix-ui/react-icons"
import { Button, Dialog, Flex, Select, Text, TextField } from "@radix-ui/themes"
import { Form } from "react-router-dom";
import CalloutMessage from "../../../components/CalloutMessage";
import { resetFormStyle } from "../../../utils/utils";
import { getLiquidacionViajes, getLiquidacionesChofer, postLiquidacionViaje, putLiquidacionViaje } from "../../../utils/liquidaciones";


function FormLiquidacionViajes({
    formData, setFormData, chofer, fecha, liquidacionViajes, setLiquidacionViajes
}) {

    const inputRefs = [
        useRef(null), useRef(null), useRef(null), useRef(null),
        useRef(null), useRef(null), useRef(null),
        useRef(null), useRef(null), useRef(null)
    ];

    const [inputStyles, setInputStyles] = useState({
        fechaViaje: { color: 'indigo', variant: 'surface' },
        chapa: { color: 'indigo', variant: 'surface' },
        producto: { color: 'indigo', variant: 'surface' },
        origen: { color: 'indigo', variant: 'surface' },
        destino: { color: 'indigo', variant: 'surface' },
        tiquet: { color: 'indigo', variant: 'surface' },
        precio: { color: 'indigo', variant: 'surface' },
        precioLiquidacion: { color: 'indigo', variant: 'surface' },
        kgOrigen: { color: 'indigo', variant: 'surface' },
        kgDestino: { color: 'indigo', variant: 'surface' }
    })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [buttonText, setButtonText] = useState('')
    const [disableButton, setDisableButton] = useState(false)

    const [liquidacionesChofer, setLiquidacionesChofer] = useState([])

    useEffect(() => {
        const queryLiquidaciones = async () => {
            const result = await getLiquidacionesChofer(chofer)

            if (!result?.response && !result?.message) {
              const formattedResult = result.map(liquidacion => new Date(liquidacion.fechaLiquidacion))
        
              setLiquidacionesChofer(formattedResult)
            }
        }
        queryLiquidaciones()
    }, [])


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

        if (['tiquet', 'precio', 'kgOrigen', 'kgDestino'].includes(fieldName)) {
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
        document.body.style.cursor = 'wait'
        // Create a new object for styles based on validation
        const newInputStyles = {};

        // Iterate over the keys of formData
        for (const field in formData) {
            if (formData[field] === '') {
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
            document.body.style.cursor = 'default'
            return
        }
        resetFormStyle(inputStyles, setInputStyles)

        let response = null
        if (formData.id === '') {
            response = await postLiquidacionViaje(formData)
        }
        else {
            response = await putLiquidacionViaje(formData)
            setButtonText('Agregar')
        }

        if (!response?.response && !response?.message) {
            setSuccess(`Entrada ${formData.id === '' ? 'añadida' : 'editada'} correctamente`);
            setError('');

            const result = await getLiquidacionViajes(chofer, fecha)

            const newViajes = result?.map(viaje => ({ ...viaje, checked: false }))
            setLiquidacionViajes(newViajes ?? [])

            // resetear el form
            const resetFormData = {}
            for (const field in formData) {
                resetFormData[field] = ''
            }
            setFormData({ ...resetFormData, chofer: chofer, fechaCreacion: null, fechaLiquidacion: fecha })

        } else {
            setSuccess('')
            setError('A ocurrido un error');
        }
        setDisableButton(false)
        document.body.style.cursor = 'default'
    }


    const handleCerrar = () => {
        const resetFormData = {}
        for (const field in formData) {
            resetFormData[field] = ''
        }
        setFormData({ ...resetFormData, chofer: chofer, fechaCreacion: null, fechaLiquidacion: fecha })

        resetFormStyle(inputStyles, setInputStyles)

        setError('');
        setSuccess('')
        setDisableButton(false)
        document.body.style.cursor = 'default'
    }


    const handleEditar = () => {

        setButtonText('Editar')
        const [toEdit] = liquidacionViajes.filter(entry => entry.checked)

        const newFormData = {
            id: toEdit.id, fechaCreacion: null, tiquet: String(toEdit.tiquet),
            fechaViaje: new Date(toEdit.fechaViaje).toISOString().slice(0, 10),
            chofer: chofer, chapa: toEdit.chapa, producto: toEdit.producto,
            origen: toEdit.origen, destino: toEdit.destino,
            precio: Number(toEdit.precio).toFixed(2),
            precioLiquidacion: Number(toEdit.precioLiquidacion).toFixed(2),
            kgOrigen: String(toEdit.kgOrigen), kgDestino: String(toEdit.kgDestino),
            fechaLiquidacion: new Date(fecha).toISOString().slice(0, 10)
        }
        setFormData(newFormData)
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
                    disabled={liquidacionViajes.filter(entry => entry.checked).length != 1}
                    onClick={handleEditar}
                >
                    <FileIcon width="20" height="20" />Editar
                </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 600 }}>
                <Form onSubmit={(e) => handleSubmit(e)}>

                    <Dialog.Title>{`${buttonText} Entrada`}</Dialog.Title>
                    {error ? (
                        <CalloutMessage color="red" size="1">{error}</CalloutMessage>
                    ) : (success ? (
                        <CalloutMessage color="green" size="1">{success}</CalloutMessage>
                    ) : (
                        <Dialog.Description size="2" mb="4">
                            Ingresa los datos del viaje.
                        </Dialog.Description>
                    ))}


                    <Flex direction="column" gap="3">
                        <Flex direction={!isMobile ? "row" : "column"} gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Tiquet
                                </Text>
                                <TextField.Input
                                    name="tiquet"
                                    placeholder="Tiquet"
                                    ref={inputRefs[0]}
                                    onKeyDown={(e) => handleKeyDown(e, 0)}
                                    onChange={onChange}
                                    value={formData.tiquet}
                                    color={inputStyles.tiquet.color}
                                    variant={inputStyles.tiquet.variant}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Fecha
                                </Text>
                                <TextField.Input
                                    name="fechaViaje"
                                    type="date"
                                    ref={inputRefs[1]}
                                    onKeyDown={(e) => handleKeyDown(e, 1)}
                                    onChange={onChange}
                                    value={formData.fechaViaje}
                                    color={inputStyles.fechaViaje.color}
                                    variant={inputStyles.fechaViaje.variant}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Chapa
                                </Text>
                                <TextField.Input
                                    name="chapa"
                                    placeholder="Chapa"
                                    ref={inputRefs[2]}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
                                    onChange={onChange}
                                    value={formData.chapa.toLocaleUpperCase()}
                                    color={inputStyles.chapa.color}
                                    variant={inputStyles.chapa.variant}
                                />
                            </label>
                        </Flex>
                        <Flex direction={!isMobile ? "row" : "column"} gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Producto
                                </Text>

                                <TextField.Input
                                    name="producto"
                                    placeholder="Producto"
                                    ref={inputRefs[3]}
                                    onKeyDown={(e) => handleKeyDown(e, 3)}
                                    onChange={onChange}
                                    value={formData.producto}
                                    color={inputStyles.producto.color}
                                    variant={inputStyles.producto.variant}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Origen
                                </Text>

                                <TextField.Input
                                    name="origen"
                                    placeholder="Origen"
                                    ref={inputRefs[4]}
                                    onKeyDown={(e) => handleKeyDown(e, 4)}
                                    onChange={onChange}
                                    value={formData.origen}
                                    color={inputStyles.origen.color}
                                    variant={inputStyles.origen.variant}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Destino
                                </Text>

                                <TextField.Input
                                    name="destino"
                                    placeholder="Destino"
                                    ref={inputRefs[5]}
                                    onKeyDown={(e) => handleKeyDown(e, 5)}
                                    onChange={onChange}
                                    value={formData.destino}
                                    color={inputStyles.destino.color}
                                    variant={inputStyles.destino.variant}
                                />
                            </label>
                        </Flex>

                        <Flex direction={!isMobile ? "row" : "column"} gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Precio
                                </Text>
                                <TextField.Input
                                    name="precio"
                                    type="number"
                                    placeholder="Precio"
                                    ref={inputRefs[6]}
                                    onKeyDown={(e) => handleKeyDown(e, 6)}
                                    onChange={onChange}
                                    value={formData.precio}
                                    color={inputStyles.precio.color}
                                    variant={inputStyles.precio.variant}
                                />
                            </label>

                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Precio Liquidación
                                </Text>
                                <TextField.Input
                                    name="precioLiquidacion"
                                    type="number"
                                    placeholder="Precio"
                                    ref={inputRefs[7]}
                                    onKeyDown={(e) => handleKeyDown(e, 7)}
                                    onChange={onChange}
                                    value={formData.precioLiquidacion}
                                    color={inputStyles.precioLiquidacion.color}
                                    variant={inputStyles.precioLiquidacion.variant}
                                />
                            </label>
                        </Flex>

                        <Flex direction={!isMobile ? "row" : "column"} gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Kg. Origen
                                </Text>
                                <TextField.Input
                                    name="kgOrigen"
                                    placeholder="Kg. Origen"
                                    ref={inputRefs[8]}
                                    onKeyDown={(e) => handleKeyDown(e, 8)}
                                    onChange={onChange}
                                    value={formData.kgOrigen}
                                    color={inputStyles.kgOrigen.color}
                                    variant={inputStyles.kgOrigen.variant}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Kg. Destino
                                </Text>
                                <TextField.Input
                                    name="kgDestino"
                                    placeholder="Kg. Destino"
                                    ref={inputRefs[9]}
                                    onChange={onChange}
                                    value={formData.kgDestino}
                                    color={inputStyles.kgDestino.color}
                                    variant={inputStyles.kgDestino.variant}
                                />
                            </label>

                            {formData.id ? 
                                (<label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Fecha de Liquidación
                                    </Text>
                                    <Select.Root 
                                        value={formData.fechaLiquidacion}
                                        onValueChange={(v) => setFormData({...formData, fechaLiquidacion: v})}
                                    >
                                        <Select.Trigger />
                                        <Select.Content position="popper">
                                            {liquidacionesChofer.map(liquidacion => (
                                                <Select.Item 
                                                    value={liquidacion.toISOString().slice(0, 10)} 
                                                    key={liquidacion.toISOString().slice(0, 10)}
                                                >
                                                    {liquidacion.toLocaleDateString("es-ES",
                                                        { year: "numeric", month: "numeric", day: "numeric", timeZone: "GMT" }
                                                    )}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root>
                                </label>) : ''
                            }
                        </Flex>
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

export default FormLiquidacionViajes