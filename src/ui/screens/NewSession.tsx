import { useNavigate } from "react-router-dom";
import { Session } from "@/session/Session";

export function NewSession() {
    const navigate = useNavigate();
    const handleClick = async () => {
        try {
            const session = await createSession();
            navigate(`/view-session:${session.id}`);
        } catch (error) {
            // TODO: Handle error.
            console.error('Failed to create session', error);
            return;
        }
    };

    return (
        <>
            <p>Start by navigating to the main page of your site, then click Continue.</p>
            <button onClick={handleClick}>Continue</button>
        </>
    );
}

async function createSession(): Promise<Session> {
    const info = await getSiteInfo();
    if (!info) {
        throw new Error('Failed to retrieve site info');
    }

    const session: Session = {
        id: Date.now().toString(16),
        url: info.url,
        title: info.title,
    };

    // TODO: Save in storage.

    return session;
}

async function getSiteInfo(): Promise<null|{
    url: string;
    title?: string;
}> {
    const tabs = await browser.tabs.query({currentWindow: true, active: true});
    if (tabs.length !== 1) {
        return null;
    }
    const tab = tabs[0];

    if (!tab.url) {
        return null;
    }

    return {
        url: tab.url,
        title: tab.title,
    };
}
