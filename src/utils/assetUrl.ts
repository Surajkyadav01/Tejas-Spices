/**
 * Resolves static asset paths safely across GitHub Pages (e.g. https://<user>.github.io/<repo>/),
 * local dev server, Google AI Studio preview, and custom domains.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Strip any leading slashes or dot-slashes
  let cleanPath = path;
  while (cleanPath.startsWith('/') || cleanPath.startsWith('./')) {
    if (cleanPath.startsWith('./')) {
      cleanPath = cleanPath.slice(2);
    } else if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.slice(1);
    }
  }

  // Check browser runtime environment
  if (typeof window !== 'undefined') {
    const { origin, pathname, hostname } = window.location;

    // Specially handle GitHub Pages deployments (e.g. https://username.github.io/repo-name/)
    if (hostname.endsWith('github.io')) {
      const parts = pathname.split('/').filter(Boolean);
      // If there is a repo-name prefix (e.g. /Tejas-Spices/ or /my-shop/)
      if (parts.length > 0 && !parts[0].includes('.')) {
        const repoName = parts[0];
        return `${origin}/${repoName}/${cleanPath}`;
      }
    }

    // If served from a subfolder on any host (e.g. /dist/ or /preview/ or /subfolder/)
    if (pathname && pathname !== '/') {
      const lastSlashIdx = pathname.lastIndexOf('/');
      const dir = lastSlashIdx >= 0 ? pathname.slice(0, lastSlashIdx + 1) : '/';
      if (dir && dir !== '/') {
        return `${dir}${cleanPath}`;
      }
    }
  }

  // Check Vite build base URL
  const base = import.meta.env.BASE_URL;
  if (base && base !== '/') {
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    return `${cleanBase}${cleanPath}`;
  }

  // Fallback to relative path
  return `./${cleanPath}`;
}

/**
 * Returns prioritized fallback candidates in case the primary URL is blocked or 404s
 */
export function getAssetUrlVariants(path: string): string[] {
  if (!path) return [];
  const primary = getAssetUrl(path);

  let cleanPath = path;
  while (cleanPath.startsWith('/') || cleanPath.startsWith('./')) {
    if (cleanPath.startsWith('./')) cleanPath = cleanPath.slice(2);
    else if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
  }

  const variants = [primary];
  const rel = `./${cleanPath}`;
  if (!variants.includes(rel)) variants.push(rel);
  const root = `/${cleanPath}`;
  if (!variants.includes(root)) variants.push(root);

  return variants;
}
