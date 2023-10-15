import { FileIcon, PlusIcon } from "@radix-ui/react-icons"
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes"
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";

import { isMobile } from "react-device-detect";

import { getCobranza, getKeywords, postCobranza, putCobranza } from "../../../utils/cobranza";
import CalloutMessage from "../../../components/CalloutMessage";
import { resetFormStyle } from "../../../utils/utils";
import { getNomina } from "../../../utils/nomina";
import { getPrecio } from "../../../utils/precio";


function FormCobranzas({
    fechaCreacion, cobranzas, setCobranzas,
    formData, setFormData,
    tracker, setTracker,
}) {

    const inputRefs = [
        useRef(null), useRef(null), useRef(null), useRef(null),
        useRef(null), useRef(null), useRef(null),
        useRef(null), useRef(null), useRef(null)
    ];

    const [inputStyles, setInputStyles] = useState({
        fechaViaje: { color: 'indigo', variant: 'surface' },
        chofer: { color: 'indigo', variant: 'surface' },
        chapa: { color: 'indigo', variant: 'surface' },
        producto: { color: 'indigo', variant: 'surface' },
        origen: { color: 'indigo', variant: 'surface' },
        destino: { color: 'indigo', variant: 'surface' },
        tiquet: { color: 'indigo', variant: 'surface' },
        precio: { color: 'indigo', variant: 'surface' },
        kgOrigen: { color: 'indigo', variant: 'surface' },
        kgDestino: { color: 'indigo', variant: 'surface' }
    })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [buttonText, setButtonText] = useState('')
    const [disableButton, setDisableButton] = useState(false)

    const [toSuggest, setToSuggest] = useState({
        chofer: [], producto: [], origen: [], destino: []
    })

    const [selectedSuggestion, setSelectedSuggestion] = useState(0)

    const [suggestions, setSuggestions] = useState({ chofer: [], destino: [], origen: [], producto: [] })

    useEffect(() => {
        const queryKeywords = async () => {
            const response = await getKeywords()

            if (!response?.response && !response?.message) {
                setSuggestions(response)
            }
        }
        queryKeywords()
    }, [cobranzas])


    const autocompleteField = async (fieldName) => {
        if (!['chofer', 'producto', 'origen', 'destino'].includes(fieldName)) {
            return
        }

        if (!toSuggest[fieldName].at(selectedSuggestion)) {
            return
        }

        if (fieldName === 'chofer') {
            const result = await getNomina()

            const nomina = result?.filter(nomina => (
                nomina.chofer === formData.chofer ||
                nomina.chofer === toSuggest?.chofer?.at(selectedSuggestion)
            ))
            const [chapaNomina] = nomina

            if (chapaNomina !== undefined) {
                setFormData({
                    ...formData,
                    chofer: toSuggest.chofer.at(selectedSuggestion),
                    chapa: chapaNomina.chapa
                })
            }
        } else if ('destino' === fieldName) {
            const result = await getPrecio(formData.origen, toSuggest.destino.at(selectedSuggestion))

            setFormData({
                ...formData,
                destino: toSuggest.destino.at(selectedSuggestion),
                precio: String(result?.precio ?? '')
            })
        } else {
            setFormData({ ...formData, [fieldName]: toSuggest[fieldName].at(selectedSuggestion) })
        }
    }


    const handleKeyDown = async (e, index) => {
        const fieldName = e.target.name
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            if (index < inputRefs.length - 1) {
                inputRefs[index + 1].current.focus();
            }
            autocompleteField(fieldName)
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedSuggestion(selectedSuggestion + 1)
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedSuggestion(selectedSuggestion - 1)
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

        if (['chofer', 'producto', 'origen', 'destino'].includes(fieldName)) {
            const newToSuggest = suggestions[fieldName].filter(suggested =>
                (string !== '' && new RegExp('^' + string).test(suggested))
            )
            setToSuggest({ ...toSuggest, [fieldName]: newToSuggest })
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
            return
        }
        resetFormStyle(inputStyles, setInputStyles)

        let response = null
        if (formData.id === '') {
            response = await postCobranza(formData)
        } else {
            response = await putCobranza(formData)
            setButtonText('Agregar')
        }

        if (!response?.response) {
            setSuccess(`Entrada ${formData.id === '' ? 'añadida' : 'editada'} correctamente`);
            setError('');

            //actualizar state
            const responseUpdate = await getCobranza(fechaCreacion.toISOString().slice(0, 10))

            if (responseUpdate?.response) {
                setDisableButton(false)
                return
            }

            const result = {}
            for (const grupo in responseUpdate) {
                result[grupo] = {
                    ...responseUpdate[grupo], viajes: responseUpdate[grupo].viajes
                        .map((viaje) => ({ viaje: viaje, checked: false }))
                }
            }
            setCobranzas(result)

            //reset form data and suggestions
            const resetFormData = {}
            for (const field in formData) {
                resetFormData[field] = ''
            }
            setFormData({
                ...resetFormData, fechaCreacion: fechaCreacion.toISOString().slice(0, 10),
                fechaViaje: new Date().toISOString().slice(0, 10)
            })

            const resetToSuggest = {}

            for (const key in toSuggest) {
                resetToSuggest[key] = []
            }

            setToSuggest(resetToSuggest)

        } else {
            setSuccess('')
            setError('A ocurrido un error');
        }
        setDisableButton(false)
    }


    const handleCerrar = () => {
        // resetear el form
        const resetFormData = {}
        for (const field in formData) {
            resetFormData[field] = ''
        }
        setFormData({
            ...resetFormData, fechaCreacion: fechaCreacion.toISOString().slice(0, 10),
            fechaViaje: new Date().toISOString().slice(0, 10)
        })

        resetFormStyle(inputStyles, setInputStyles)

        setError('');
        setSuccess('')
        setDisableButton(false)
    }


    const handleEditar = () => {
        setButtonText('Editar')

        const { grupo, index } = tracker.at(0)

        const viaje = {}
        for (const attribute in cobranzas[grupo].viajes[index].viaje) {
            viaje[attribute] = String(cobranzas[grupo].viajes[index].viaje[attribute] ?? '')
        }
        setFormData({
            ...viaje,
            fechaCreacion: fechaCreacion,
            fechaViaje: new Date(viaje.fechaViaje).toISOString().slice(0, 10),
            precio: Number(viaje.precio).toFixed(2)
        })

        setTracker([])
    }


    const handleBlur = (e) => {
        const fieldName = e.target.name
        autocompleteField(fieldName)
        if (['chofer', 'producto', 'origen', 'destino'].includes(fieldName)) {
            setToSuggest({ ...toSuggest, [fieldName]: [] })
            setSelectedSuggestion(0)
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
                    disabled={(tracker.length <= 0) || tracker.length > 1}
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
                            Ingresa los datos del viaje.
                        </Dialog.Description>
                    ))}


                    <Flex direction="column" gap="3">
                        <Flex direction={!isMobile ? "row" : "column"} gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Chofer
                                </Text>

                                <div className="relative">
                                    <TextField.Input
                                        name="chofer"
                                        placeholder="Chofer"
                                        ref={inputRefs[0]}
                                        onKeyDown={(e) => handleKeyDown(e, 0)}
                                        onBlur={e => handleBlur(e)}
                                        onChange={onChange}
                                        value={formData.chofer}
                                        color={inputStyles.chofer.color}
                                        variant={inputStyles.chofer.variant}
                                        list="suggestedChofer"
                                    />
                                    <datalist id="suggestedChofer">
                                        {[... new Set(suggestions.chofer)].sort().map(entry => (
                                            <option value={entry} key={entry}></option>
                                        ))}
                                    </datalist>

                                    <div className="absolute top-1.5">
                                        <Text
                                            className="rt-TextFieldInput rt-variant-surface"
                                            color="gray"
                                            size="2"
                                        >
                                            {toSuggest.chofer.at(selectedSuggestion)}
                                        </Text>
                                    </div>
                                </div>
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
                                    onBlur={e => handleBlur(e)}
                                    onChange={onChange}
                                    value={formData.fechaViaje}
                                    color={inputStyles.fechaViaje.color}
                                    variant={inputStyles.fechaViaje.variant}
                                />
                            </label>
                        </Flex>
                        <Flex direction={!isMobile ? "row" : "column"} gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Chapa
                                </Text>
                                <TextField.Input
                                    name="chapa"
                                    placeholder="Chapa"
                                    ref={inputRefs[2]}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
                                    onBlur={e => handleBlur(e)}
                                    onChange={onChange}
                                    value={formData.chapa.toLocaleUpperCase()}
                                    color={inputStyles.chapa.color}
                                    variant={inputStyles.chapa.variant}
                                />
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Producto
                                </Text>

                                <div className="relative">
                                    <TextField.Input
                                        name="producto"
                                        placeholder="Producto"
                                        ref={inputRefs[3]}
                                        onKeyDown={(e) => handleKeyDown(e, 3)}
                                        onBlur={e => handleBlur(e)}
                                        onChange={onChange}
                                        value={formData.producto}
                                        color={inputStyles.producto.color}
                                        variant={inputStyles.producto.variant}
                                        list="suggestedProducto"
                                    />

                                    <datalist id="suggestedProducto">
                                        {[... new Set(suggestions.producto)].sort().map(entry => (
                                            <option value={entry} key={entry}></option>
                                        ))}
                                    </datalist>

                                    <div className="absolute top-1.5">
                                        <Text
                                            className="rt-TextFieldInput rt-variant-surface"
                                            color="gray"
                                            size="2"
                                        >
                                            {toSuggest.producto.at(selectedSuggestion)}
                                        </Text>
                                    </div>
                                </div>
                            </label>
                        </Flex>

                        <Flex direction={!isMobile ? "row" : "column"} gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Origen
                                </Text>

                                <div className="relative">
                                    <TextField.Input
                                        name="origen"
                                        placeholder="Origen"
                                        ref={inputRefs[4]}
                                        onKeyDown={(e) => handleKeyDown(e, 4)}
                                        onBlur={e => handleBlur(e)}
                                        onChange={onChange}
                                        value={formData.origen}
                                        color={inputStyles.origen.color}
                                        variant={inputStyles.origen.variant}
                                        list="suggestedOrigen"
                                    />

                                    <datalist id="suggestedOrigen">
                                        {[... new Set(suggestions.origen)].sort().map(entry => (
                                            <option value={entry} key={entry}></option>
                                        ))}
                                    </datalist>

                                    <div className="absolute top-1.5">
                                        <Text
                                            className="rt-TextFieldInput rt-variant-surface"
                                            color="gray"
                                            size="2"
                                        >
                                            {toSuggest.origen.at(selectedSuggestion)}
                                        </Text>
                                    </div>
                                </div>
                            </label>
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Destino
                                </Text>

                                <div className="relative">
                                    <TextField.Input
                                        name="destino"
                                        placeholder="Destino"
                                        ref={inputRefs[5]}
                                        onKeyDown={(e) => handleKeyDown(e, 5)}
                                        onBlur={e => handleBlur(e)}
                                        onChange={onChange}
                                        value={formData.destino}
                                        color={inputStyles.destino.color}
                                        variant={inputStyles.destino.variant}
                                        list="suggestedDestino"
                                    />

                                    <datalist id="suggestedDestino">
                                        {[... new Set(suggestions.destino)].sort().map(entry => (
                                            <option value={entry} key={entry}></option>
                                        ))}
                                    </datalist>

                                    <div className="absolute top-1.5">
                                        <Text
                                            className="rt-TextFieldInput rt-variant-surface"
                                            color="gray"
                                            size="2"
                                        >
                                            {toSuggest.destino.at(selectedSuggestion)}
                                        </Text>
                                    </div>
                                </div>
                            </label>
                        </Flex>

                        <Flex direction={!isMobile ? "row" : "column"} gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Tiquet
                                </Text>
                                <TextField.Input
                                    name="tiquet"
                                    placeholder="Tiquet"
                                    ref={inputRefs[6]}
                                    onKeyDown={(e) => handleKeyDown(e, 6)}
                                    onBlur={e => handleBlur(e)}
                                    onChange={onChange}
                                    value={formData.tiquet}
                                    color={inputStyles.tiquet.color}
                                    variant={inputStyles.tiquet.variant}
                                />
                            </label>

                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Precio
                                </Text>
                                <TextField.Input
                                    name="precio"
                                    type="number"
                                    placeholder="Precio"
                                    ref={inputRefs[7]}
                                    onKeyDown={(e) => handleKeyDown(e, 7)}
                                    onBlur={e => handleBlur(e)}
                                    onChange={onChange}
                                    value={formData.precio}
                                    color={inputStyles.precio.color}
                                    variant={inputStyles.precio.variant}
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
                                    onBlur={e => handleBlur(e)}
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
                                    onBlur={e => handleBlur(e)}
                                    onChange={onChange}
                                    value={formData.kgDestino}
                                    color={inputStyles.kgDestino.color}
                                    variant={inputStyles.kgDestino.variant}
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

export default FormCobranzas