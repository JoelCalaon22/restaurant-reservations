export function parseISODatetime(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d;
}

export function addMinutes(d, minutes) {
    return new Date(d.getTime() + minutes * 60 * 1000);
}

export function overlaps(startA, endA, startB, endB) {
    return startA < endB && endA > startB;
}
