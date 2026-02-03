
export async function verifyLineToken(token: string): Promise<string | null> {
    try {
        const params = new URLSearchParams();
        params.append('id_token', token);
        params.append('client_id', '2007987577'); // Provided LIFF Client/Channel ID

        const res = await fetch('https://api.line.me/oauth2/v2.1/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Token verification failed:", error);
            return null;
        }

        const data = await res.json();
        return data.sub; // 'sub' is the User ID
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}
