export async function loadPartial(url) {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
        throw new Error(`Partial konnte nicht geladen werden: ${url}`);
    }

    return response.text();
}

export async function loadView(url) {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
        throw new Error(`View konnte nicht geladen werden: ${url}`);
    }

    return response.text();
}
