import { useEffect } from "react";

import { PropsTitle } from "@/types";
import { getHelloWorld, getProtectedHelloWorld } from "@/utils/utils";

export const Home = ({ title }: PropsTitle) => {
    useEffect(() => {
        const testProtected = async () => {
            const helloWorld = await getHelloWorld();
            console.log("API Test: ", { helloWorld });

            const protectedHelloWorld = await getProtectedHelloWorld();
            console.log("Protected API Test: ", { protectedHelloWorld });
        };

        if (import.meta.env.VITE_DEBUG) {
            testProtected();
        }

        document.title = title;
    });

    return <>aaaaaa</>;
};
