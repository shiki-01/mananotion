<script lang="ts">
    import { onMount } from 'svelte';
    import { cookieStore } from '$lib';

    let apiKey: string = '';
    let databaseId: string = '';
    let subjects: { id: string, name: string }[] = [];
    let subject = '';
    let title: string = '';
    let count: number = 1;

    const getCookies = (): { apiKey: string, databaseId: string } => {
        const cookies = document.cookie.split(';');
        const apiKey = cookies.find(cookie => cookie.includes('apiKey')) || '';
        const databaseId = cookies.find(cookie => cookie.includes('databaseId')) || '';
        return {
            apiKey,
            databaseId
        }
    }

    const onSaveClick = () => {
        if (apiKey !== '' && databaseId !== '') {
            cookieStore.set({ apiKey, databaseId });
            document.cookie = `apiKey=${apiKey}`;
            document.cookie = `databaseId=${databaseId}`;
        }
    }

    const onSubjectChange = (event: Event) => {
        const target = event.target as HTMLSelectElement;
        subject = target.value;
    }

    const fetchNotionData = async () => {
        try {
            const response = await fetch('/api/notion/options', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey,
                    databaseId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'データの取得に失敗しました');
            }

            subjects = data as { id: string, name: string }[];
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    onMount(async () => {
        const { apiKey: savedApiKey, databaseId: savedDatabaseId } = getCookies();
        if (savedApiKey && savedDatabaseId) {
            apiKey = savedApiKey.split('=')[1];
            databaseId = savedDatabaseId.split('=')[1];
            cookieStore.set({ apiKey, databaseId });
            await fetchNotionData();
        } else {
            cookieStore.set(null);
        }
    });
</script>

<main class="w-[100svw] h-[100svh] bg-sky-200 flex justify-center">
    {#if !$cookieStore}
        <div class="w-[100svw] h-[100svh] fixed top-0 left-0 bg-black/40 z-10">
            <div class="w-full h-full relative">
                <div class="w-[340px] h-[250px] p-5 flex flex-col justify-between bg-sky-100 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-sky-800/20">
                    <div class="flex flex-col gap-4 text-sky-800">
                        <h1>Connect your notion DB</h1>
                        <div class="grid grid-cols-[60px_1fr] gap-4">
                            <p class="flex justify-start items-center">API Key</p>
                            <input bind:value={apiKey} type="text" class="w-full h-[2rem] p-2 rounded-md border border-sky-800" />
                        </div>
                        <div class="grid grid-cols-[60px_1fr] gap-4">
                            <p class="flex justify-start items-center">DB ID</p>
                            <input bind:value={databaseId} type="text" class="w-full h-[2rem] p-2 rounded-md border border-sky-800" />
                        </div>
                    </div>
                    <div class="flex h-[2rem] justify-end">
                        <button on:click={onSaveClick} class="w-[6rem] h-full bg-sky-600 text-sky-50 rounded-md shadow-md shadow-sky-800/20">Save</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
    <div class="w-full max-w-[720px] h-full p-10 flex flex-col gap-4">
        <h1 class="text-xl">ManaNotion</h1>
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-[80px_1fr] gap-2">
                <p class="flex justify-start items-center">Subject</p>
                <select
                  bind:value={subject}
                  on:change={onSubjectChange}
                >
                    {#each subjects as subject}
                        <option value={subject.id}>{subject.name}</option>
                    {/each}
                </select>
            </div>
            <div class="grid grid-cols-[80px_1fr] gap-2">
                <p class="flex justify-start items-center">Title</p>
                <input type="text" bind:value={title} />
            </div>
            <div class="grid grid-cols-[80px_1fr] gap-2">
                <p class="flex justify-start items-center">Count</p>
                <input type="number" bind:value={count} />
            </div>
        </div>
        <div class="flex justify-end">
            <button class="w-[6rem] h-[2rem] bg-sky-600 text-sky-50 rounded-md shadow-md shadow-sky-800/20">Submit</button>
        </div>
    </div>
</main>