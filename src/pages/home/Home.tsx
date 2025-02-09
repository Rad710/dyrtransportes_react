import { getHelloWorld, getProtectedHelloWorld } from "@/utils/utils";
import { useEffect } from "react";

export const Home = () => {
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
    });

    return <>aaaaaa</>;
};
