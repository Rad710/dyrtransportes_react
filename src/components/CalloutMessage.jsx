import { Callout } from "@radix-ui/themes"

import { InfoCircledIcon } from "@radix-ui/react-icons"

function CalloutMessage({ children, color, size }) {
    return (
        <Callout.Root color={color} size={size}>
            <Callout.Icon>
                <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
                {children}
            </Callout.Text>
        </Callout.Root>
    )
}

export default CalloutMessage