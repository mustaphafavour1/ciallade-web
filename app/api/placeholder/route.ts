import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const w = Math.min(parseInt(searchParams.get('w') ?? '600'), 2000);
  const h = Math.min(parseInt(searchParams.get('h') ?? '800'), 2000);
  const bg = (searchParams.get('bg') ?? 'CE8400').replace('#', '');
  const fg = (searchParams.get('fg') ?? '1C1004').replace('#', '');
  const text = decodeURIComponent((searchParams.get('text') ?? '').replace(/\+/g, ' '));

  const fontSize = Math.max(14, Math.min(w, h) * 0.065);
  const lineH = fontSize * 1.4;

  // Wrap text at ~20 chars per line
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > 20 && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current);

  const totalH = lines.length * lineH;
  const startY = h / 2 - totalH / 2 + lineH / 2;

  const textNodes = lines
    .map((line, i) => `<text x="${w / 2}" y="${startY + i * lineH}" font-family="sans-serif" font-size="${fontSize}" fill="#${fg}" text-anchor="middle" dominant-baseline="middle">${line}</text>`)
    .join('\n  ');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#${bg}"/>
  ${textNodes}
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
