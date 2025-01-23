import { writable, type Writable } from 'svelte/store';

const cookieStore = writable<{ apiKey: string, databaseId: string } | null>(null);

export { cookieStore };