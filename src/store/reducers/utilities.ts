

export function getTags(text: string) {
    return [...text.matchAll(/(#\s*)\w+/g)].map(e => e[0])
}
