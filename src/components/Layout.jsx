import { Outlet } from "react-router-dom"

import { Theme } from '@radix-ui/themes';

import Navigation from "./Navigation";


function Layout() {
    return (
        <Theme
            accentColor="indigo"
            grayColor="gray"
            radius="medium"
        >
            <header className="bg-indigo-800 px-5 py-8 mb-4">
                <Navigation />
            </header>

            <Outlet />
        </Theme>
    )
}

export default Layout