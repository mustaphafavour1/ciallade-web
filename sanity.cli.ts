import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineCliConfig } from 'sanity/cli';

/**
 * Config for the Sanity command line (`npx sanity deploy`, `npx sanity build`).
 * This is separate from sanity.config.ts, which describes the Studio itself.
 *
 * We read .env.local ourselves so the CLI works the same way the Next.js app
 * and the seed script do — one file holds the project ID, no matter which
 * command you run.
 */
function readEnvLocal(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  for (const file of ['.env.local', '.env']) {
    try {
      const raw = readFileSync(join(process.cwd(), file), 'utf8');
      for (const line of raw.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1) continue;
        const name = trimmed.slice(0, eq).trim().replace(/^export\s+/, '');
        if (name !== key) continue;
        return trimmed
          .slice(eq + 1)
          .trim()
          .replace(/^["']|["']$/g, '');
      }
    } catch {
      // File missing or unreadable — try the next one.
    }
  }
  return undefined;
}

const projectId =
  readEnvLocal('SANITY_STUDIO_PROJECT_ID') ?? readEnvLocal('NEXT_PUBLIC_SANITY_PROJECT_ID');
const dataset =
  readEnvLocal('SANITY_STUDIO_DATASET') ?? readEnvLocal('NEXT_PUBLIC_SANITY_DATASET') ?? 'production';

if (!projectId || projectId.startsWith('replace-')) {
  console.error(
    '\n  Missing your Sanity project ID.\n' +
      '  Create a file named .env.local in this folder containing:\n\n' +
      '    NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id\n' +
      '    NEXT_PUBLIC_SANITY_DATASET=production\n\n' +
      '  You can copy your project ID from https://sanity.io/manage\n'
  );
}

export default defineCliConfig({
  api: { projectId, dataset },

  /**
   * The hostname for the free Sanity-hosted Studio:
   *   https://ciallade.sanity.studio
   * These names are global, so if deploy says this one is taken, change the
   * line below to something else (e.g. 'ciallade-studio') and deploy again.
   */
  studioHost: 'ciallade',
});
