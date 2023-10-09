import { AlertDialog, Switch, Flex, Button } from "@radix-ui/themes"

function AlertSwitch({ checked, onCheckedChange }) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Switch
                    color={checked ? "grass" : "tomato"}
                    checked={checked}
                    onCheckedChange={() => { }}
                />
            </AlertDialog.Trigger>

            <AlertDialog.Content style={{ maxWidth: 450 }}>
                <AlertDialog.Title>Confirmación</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    {!checked ?
                        'Se agregará una nueva entrada de Liquidación (en caso de no haber ninguna No Pagada) y todos los nuevos datos se agregarán allí.'
                        : 'La liquidación será marcada como No Pagada pero las nuevas cobranzas se ingresarán en la última fecha disponible.'
                    }
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                            Cancelar
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="solid" color="grass" onClick={onCheckedChange}>
                            Aceptar
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default AlertSwitch