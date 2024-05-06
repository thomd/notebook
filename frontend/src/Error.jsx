import { useRouteError } from "react-router-dom";

export default function Error() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error">
            <h1>Error</h1>
            <p>An unexpected error has occurred.</p>
            <p>{error.statusText || error.message}</p>
        </div>
    );
}

