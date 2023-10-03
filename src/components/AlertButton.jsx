import { AlertDialog, Button, Flex } from "@radix-ui/themes"
import { TrashIcon } from "@radix-ui/react-icons"


function AlertButton({handleDelete, disabled}) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button color="red" variant="solid" size="4" disabled={disabled}>
                    <TrashIcon width="20" height="20" />Eliminar
                </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content style={{ maxWidth: 450 }}>
                <AlertDialog.Title>Confirmación</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    ¿Está seguro? Esta acción es irreversible y se eliminaran todos los datos relacionados
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                            Cancelar
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="solid" color="red" onClick={handleDelete}>
                            Eliminar
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default AlertButton