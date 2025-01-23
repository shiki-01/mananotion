import { json } from '@sveltejs/kit';
import { Client } from '@notionhq/client';

export async function POST({ request }) {
	try {
		const { apiKey, databaseId } = await request.json();

		if (!apiKey || !apiKey.startsWith('ntn_')) {
			return json({ error: '有効なAPIキーではありません' }, { status: 400 });
		}

		const notion = new Client({
			auth: apiKey.trim()
		});

		const response = await notion.databases.query({
			database_id: databaseId.trim()
		});

		return json(response.results);
	} catch (err) {
		console.error('Notion API Error:', err);
		return json({ error: err instanceof Error ? err.message : 'Internal Server Error' }, { status: 500 });
	}
}