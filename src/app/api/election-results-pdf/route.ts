import 'server-only';
import { NextRequest } from 'next/server';
import { pdf } from '@react-pdf/renderer';
export const runtime = 'nodejs';
import ElectionResultsPDF from '@/app/(admin)/admin/elections/_components/pdf-results';
import type { Election, DetailedVoteResult } from '@/app/(admin)/admin/elections/actions';

export async function POST(req: NextRequest) {
  try {
    const { election, detailedResults } = (await req.json()) as {
      election: Election;
      detailedResults: DetailedVoteResult[];
    };

    if (!election || !Array.isArray(detailedResults)) {
      return new Response('Invalid payload', { status: 400 });
    }

    const doc = (
      <ElectionResultsPDF election={election} detailedResults={detailedResults} />
    );

    const buffer = await pdf(doc).toBuffer();
    const fileName = `${election.name}_results.pdf`.replace(/\s+/g, '_');

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PDF generation failed:', err);
    return new Response('Failed to generate PDF', { status: 500 });
  }
}
