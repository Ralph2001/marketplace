export function getRelativeTime(date: string | Date) {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diff < 60) return `Listed ${diff} seconds ago`;
    if (diff < 3600) return `Listed ${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `Listed ${Math.floor(diff / 3600)} hours ago`;
    return `Listed ${Math.floor(diff / 86400)} days ago`;
}
