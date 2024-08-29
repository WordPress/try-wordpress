import { useNavigate } from "react-router-dom";
import { Import } from "@/import/Import";

export function NewImport() {
    const navigate = useNavigate();
    const handleClick = async () => {
        try {
            const import_ = await createImport();
            navigate(`/view-import:${import_.id}`);
        } catch (error) {
            // TODO: Handle error.
            console.error('Failed to create import', error);
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

async function createImport(): Promise<Import> {
    const info = await getSiteInfo();
    if (!info) {
        throw new Error('Failed to retrieve site info');
    }

    const import_: Import = {
        id: Date.now().toString(16),
        url: info.url,
        title: info.title,
    };

    // TODO: Save in storage.

    return import_;
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
