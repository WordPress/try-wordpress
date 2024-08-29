import { useNavigate } from "react-router-dom";

export function Home() {
    const navigate = useNavigate();

    return (
        <>
            <h1>Welcome to <br/>Try WordPress</h1>
            <button onClick={() => navigate('/new-import')}>Start Import</button>
        </>
    );
}
