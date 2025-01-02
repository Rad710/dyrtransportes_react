import { DropdownMenu, Flex, Box } from "@radix-ui/themes";
import { HomeIcon } from "@radix-ui/react-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
    const [_, pathPrimary] = useLocation()?.pathname?.split("/");
    const path = "/" + pathPrimary;

    return (
        <nav>
            <Flex gap="5" justify="between" wrap="wrap">
                <Box>
                    <div className="flex items-center text-left">
                        <Flex
                            gap="1"
                            className={`${
                                path === "/"
                                    ? "text-indigo-300"
                                    : "text-white hover:text-indigo-300"
                            }`}
                        >
                            <Link to="/" className="mt-1">
                                <HomeIcon width="32" height="32" />
                            </Link>
                            <Link to="/" className="text-4xl ml-2 font-black hidden md:block">
                                D y R Transportes
                            </Link>
                        </Flex>
                    </div>
                </Box>

                <Box>
                    <Flex gap="5" align="center" wrap="wrap">
                        <Link to="/shipment-payroll">
                            <p
                                className={`font-bold text-2xl mt-2 hover:cursor-pointer ${
                                    path.includes("/shipment-payroll")
                                        ? "text-indigo-300"
                                        : "text-white hover:text-indigo-300"
                                }`}
                            >
                                Cobranzas
                            </p>
                        </Link>

                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <p
                                    className={`font-bold text-2xl mt-2 hover:cursor-pointer
                        ${
                            path === "/liquidaciones"
                                ? "text-indigo-300"
                                : "text-white hover:text-indigo-300"
                        }`}
                                >
                                    Liquidaciones
                                </p>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content variant="soft">
                                <DropdownMenu.Item>
                                    <Link to="/liquidaciones">Ver Liquidaciones</Link>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>

                        <Link to="/routes">
                            <p
                                className={`font-bold text-2xl mt-2 hover:cursor-pointer ${
                                    path === "/routes"
                                        ? "text-indigo-300"
                                        : "text-white hover:text-indigo-300"
                                }`}
                            >
                                Precios
                            </p>
                        </Link>

                        <DropdownMenu.Root>
                            <Link to="/drivers">
                                <p
                                    className={`font-bold text-2xl mt-2 hover:cursor-pointer ${
                                        path === "/drivers"
                                            ? "text-indigo-300"
                                            : "text-white hover:text-indigo-300"
                                    }`}
                                >
                                    Nómina
                                </p>
                            </Link>
                        </DropdownMenu.Root>

                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <p
                                    className={`font-bold text-2xl mt-2 hover:cursor-pointer
                        ${
                            path === "/dinatran"
                                ? "text-indigo-300"
                                : "text-white hover:text-indigo-300"
                        }`}
                                >
                                    DINATRAN
                                </p>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content variant="soft">
                                <DropdownMenu.Item>
                                    <Link to="/dinatran">Ver Informes</Link>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Flex>
                </Box>
            </Flex>
        </nav>
    );
};

export default Navigation;
