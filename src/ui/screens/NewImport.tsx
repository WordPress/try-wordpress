import { useNavigate } from "react-router-dom";

export function NewImport() {
    const navigate = useNavigate();
    const createImport = () => {
        // TODO.
        navigate(`/view-import`);
    };

    return (
        <>
            <p>Start by navigating to the main page of your site, then click Continue.</p>
            <button onClick={() => createImport()}>Continue</button>
        </>
    );
}
