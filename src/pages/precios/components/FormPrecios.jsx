import { useRef, useState } from "react";

import { FileIcon, PlusIcon } from "@radix-ui/react-icons"
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes"
import { Form } from "react-router-dom";
import CalloutMessage from "../../../components/CalloutMessage";
import { resetFormStyle } from "../../../utils/utils";
import { getPrecios, postPrecio, putPrecio } from "../../../utils/precio";

function FormPrecios({ formData, setFormData, listaPrecios, setListaPrecios }) {
    const inputRefs = [
        useRef(null), useRef(null),
        useRef(null), useRef(null)
    ];

    const [inputStyles, setInputStyles] = useState({
        origen: { color: 'indigo', variant: 'surface' },
        destino: { color: 'indigo', variant: 'surface' },
        precio: { color: 'indigo', variant: 'surface' },
        precioLiquidacion: { color: 'indigo', variant: 'surface' }
    })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [buttonText, setButtonText] = useState('')


    const handleKeyDown = (e, index) => {
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

        if (['precio', 'precioLiquidacion'].includes(fieldName)) {
            if (isNaN(Number(string))) {
                return
            }
        }

        const newFormData = { ...formData, [fieldName]: string }
        setFormData(newFormData)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

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
            return
        }

        resetFormStyle(inputStyles, setInputStyles)

        let response = null
        if (formData.id === '') {
            response = await postPrecio(formData)
        } else {
            response = await putPrecio(formData.id, formData)
            setButtonText('Agregar')
        }

        if (!response?.response) {
            setSuccess(`Entrada ${formData.id === '' ? 'añadida' : 'editada'} correctamente`);
            setError('');

            // actualizar state
            const responseUpdate = await getPrecios()

            setListaPrecios(responseUpdate.map(entrada => ({ ...entrada, checked: false })))

            // resetear el form
            const resetFormData = {}
            for (const field in formData) {
                resetFormData[field] = ''
            }
            setFormData(resetFormData)

        } else {
            setSuccess('')
            setError('A ocurrido un error: ');
        }
    }


    const handleEditar = () => {
        setButtonText('Editar')

        const [toEdit] = listaPrecios.filter(entry => entry.checked)

        const newFormData = {}
        for (const attribute in toEdit) {
            newFormData[attribute] = String(toEdit[attribute])
        }
        setFormData({...newFormData, checked: Boolean(newFormData.checked)})
    }

    const handleCerrar = () => {
        // resetear el form
        const resetFormData = {}
        for (const field in formData) {
            resetFormData[field] = ''
        }
        setFormData(resetFormData)

        resetFormStyle(inputStyles, setInputStyles)

        setError('');
        setSuccess('')
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
                    disabled={listaPrecios.filter(entry => entry.checked).length !== 1}
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
                            Ingresa los datos requeridos.
                        </Dialog.Description>
                    ))}


                    <Flex direction="column" gap="3">
                        <Flex direction="row" gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Origen
                                </Text>
                                <TextField.Input
                                    name="origen"
                                    placeholder="Origen"
                                    ref={inputRefs[0]}
                                    onKeyDown={(e) => handleKeyDown(e, 0)}
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
                                    ref={inputRefs[1]}
                                    onKeyDown={(e) => handleKeyDown(e, 1)}
                                    onChange={onChange}
                                    value={formData.destino}
                                    color={inputStyles.destino.color}
                                    variant={inputStyles.destino.variant}
                                />
                            </label>
                        </Flex>

                        <Flex direction="row" gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Precio
                                </Text>
                                <TextField.Input
                                    name="precio"
                                    type="number"
                                    placeholder="Precio"
                                    ref={inputRefs[2]}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
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
                                    ref={inputRefs[3]}
                                    onKeyDown={(e) => handleKeyDown(e, 3)}
                                    onChange={onChange}
                                    value={formData.precioLiquidacion}
                                    color={inputStyles.precioLiquidacion.color}
                                    variant={inputStyles.precioLiquidacion.variant}
                                />
                            </label>
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

                        <Button type="submit" color={buttonText === "Editar" ? "teal" : "indigo"}>
                            {buttonText}
                        </Button>
                    </Flex>
                </Form>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default FormPrecios