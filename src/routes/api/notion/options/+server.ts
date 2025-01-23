import { json } from '@sveltejs/kit';
import { Client } from '@notionhq/client';

export async function POST({ request }) {
	try {
		const { apiKey, databaseId } = await request.json();

		const notion = new Client({
			auth: apiKey.trim()
		});

		const response = await notion.databases.retrieve({
			database_id: databaseId.trim()
		});

		const selectOptions = response.properties['科目']?.select?.options || [];

		return json(selectOptions);
	} catch (err) {
		console.error('Notion API Error:', err);
		return json(
			{ error: err instanceof Error ? err.message : 'エラーが発生しました' },
			{ status: 500 }
		);
	}
}