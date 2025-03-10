import { useEffect } from "react";

import { PageProps } from "@/types";
import { api } from "@/utils/axios";

export const Home = ({ title }: PageProps) => {
    useEffect(() => {
        const testProtected = async () => {
            const helloWorld = await api.get(`/hello-world`);
            console.log("API Test: ", { helloWorld });

            const protectedHelloWorld = await api.get(`/protected/hello-world`);
            console.log("Protected API Test: ", { protectedHelloWorld });
        };

        if (import.meta.env.VITE_DEBUG) {
            testProtected();
        }

        document.title = title;
    });

    return <>aaaaaa</>;
};
