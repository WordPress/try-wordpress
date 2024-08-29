export interface Session {
    id: string;
    url: URL;
    title: string;
}

export class Sessions {
    static create(data: { url: URL, title: string }): Session {
        const { url, title } = data;

        const session: Session = {
            id: Date.now().toString(16),
            url,
            title,
        };

        return session;
    }
}
