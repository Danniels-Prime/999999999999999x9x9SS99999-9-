import { NextRequest, NextResponse } from 'next/server';
import { generateMnemonicContent } from '@/lib/claudeApi';

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.get('x-admin-password');

  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { word?: string; translation?: string; romanization?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { word, translation, romanization } = body;
  if (!word || !translation || !romanization) {
    return NextResponse.json(
      { error: 'word, translation, and romanization are required' },
      { status: 400 }
    );
  }

  try {
    const content = await generateMnemonicContent(word, translation, romanization);
    return NextResponse.json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
