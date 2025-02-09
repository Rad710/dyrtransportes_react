import { useRouteError } from "react-router";

export default function ErrorPage() {
    const error = useRouteError();
    console.log(error);
    return (
        <div className="space-y-8">
            <h1 className="text-center text-6xl font-extrabold mt-20 text-gray-500">
                D y R Transportes
            </h1>
            <p className="text-center">Hubo un error</p>
            <p className="text-center">{`${error.statusText || error.message} ${error.status}`}</p>
        </div>
    );
}
