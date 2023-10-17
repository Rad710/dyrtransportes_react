import { useState } from "react";

import { PlusIcon } from "@radix-ui/react-icons"
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes"
import { Form } from "react-router-dom";
import CalloutMessage from "../../../components/CalloutMessage";
import { postLiquidacion } from "../../../utils/liquidaciones";

function FormListaLiquidaciones({ liquidaciones, setLiquidaciones }) {

    const [chofer, setChofer] = useState('')

    const [inputStyle, setInputStyle] = useState({ color: 'indigo', variant: 'surface' })

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [disableButton, setDisableButton] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisableButton(true)
        document.body.style.cursor = 'wait'

        if (chofer === '') {
            setError('Complete todos los campos');
            setInputStyle({ color: 'red', variant: 'soft' })
            setSuccess('')
            setDisableButton(false)
            document.body.style.cursor = 'default'
            return
        }
        setInputStyle({ color: 'indigo', variant: 'surface' })

        const response = await postLiquidacion(chofer)

        if (!response?.response && !response?.message) {
            setSuccess(`Entrada añadida correctamente`);
            setError('');

            setLiquidaciones([...liquidaciones, { chofer: chofer, checked: false }])
            setChofer('')
        } else {
            setSuccess('')
            setError('A ocurrido un error: ');
        }
        setDisableButton(false)
        document.body.style.cursor = 'default'
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button color="indigo" variant="solid" size="4">
                    <PlusIcon width="20" height="20" />Agregar
                </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }}>
                <Form onSubmit={(e) => handleSubmit(e)}>

                    <Dialog.Title>Agregar Nueva Liquidación</Dialog.Title>
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
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Chofer
                            </Text>
                            <TextField.Input
                                name="chofer"
                                placeholder="Chofer"
                                onChange={(e) => setChofer(e.target.value)}
                                value={chofer}
                                color={inputStyle.color}
                                variant={inputStyle.variant}
                            />
                        </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray"
                                onClick={() => setChofer('')}
                            >
                                Cancelar
                            </Button>
                        </Dialog.Close>

                        <Button
                            type="submit"
                            color="indigo"
                            disabled={disableButton}
                        >
                            Agregar
                        </Button>
                    </Flex>
                </Form>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default FormListaLiquidaciones