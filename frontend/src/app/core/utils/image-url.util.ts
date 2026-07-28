export interface ImageOptimizeOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp';
  crop?: 'limit' | 'fill' | 'scale';
}

/** Common display widths — use the smallest size that fits the UI slot. */
export const IMAGE_WIDTHS = {
  thumb: 120,
  avatar: 120,
  card: 400,
  gallery: 500,
  category: 600,
  productMain: 900,
  hero: 1400,
  lightbox: 1600
} as const;

export function optimizeImageUrl(
  url: string | null | undefined,
  options: ImageOptimizeOptions = {}
): string {
  if (!url?.trim()) {
    return '';
  }

  const width = options.width ?? 800;
  const quality = options.quality ?? 'auto';
  const format = options.format ?? 'auto';
  const crop = options.crop ?? 'limit';

  if (url.includes('res.cloudinary.com')) {
    return optimizeCloudinaryUrl(url, { width, height: options.height, quality, format, crop });
  }

  if (url.includes('images.unsplash.com')) {
    return optimizeUnsplashUrl(url, width, quality);
  }

  return url;
}

export function buildImageSrcSet(url: string | null | undefined, widths: number[]): string {
  if (!url?.trim()) {
    return '';
  }

  return widths
    .map((width) => `${optimizeImageUrl(url, { width })} ${width}w`)
    .join(', ');
}

function optimizeCloudinaryUrl(url: string, options: Required<Pick<ImageOptimizeOptions, 'width' | 'quality' | 'format' | 'crop'>> & Pick<ImageOptimizeOptions, 'height'>): string {
  const uploadMarker = '/upload/';
  const index = url.indexOf(uploadMarker);
  if (index === -1) {
    return url;
  }

  const base = url.slice(0, index + uploadMarker.length);
  let remainder = url.slice(index + uploadMarker.length);

  while (remainder.length > 0) {
    const slash = remainder.indexOf('/');
    const firstSegment = slash === -1 ? remainder : remainder.slice(0, slash);
    if (isCloudinaryTransformSegment(firstSegment)) {
      remainder = slash === -1 ? '' : remainder.slice(slash + 1);
      continue;
    }
    break;
  }

  const quality = options.quality === 'auto' ? 'q_auto' : `q_${options.quality}`;
  const parts = [`f_${options.format}`, quality, `c_${options.crop}`, `w_${options.width}`];
  if (options.height) {
    parts.push(`h_${options.height}`);
  }

  return `${base}${parts.join(',')}/${remainder}`;
}

function isCloudinaryTransformSegment(segment: string): boolean {
  if (!segment || /^v\d+$/.test(segment)) {
    return false;
  }

  if (segment.includes(',')) {
    return true;
  }

  return /^(f_|q_|w_|h_|c_|g_|e_|dpr_|ar_)/.test(segment);
}

function optimizeUnsplashUrl(url: string, width: number, quality: number | 'auto'): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('w', String(width));
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    if (quality !== 'auto') {
      parsed.searchParams.set('q', String(quality));
    } else if (!parsed.searchParams.has('q')) {
      parsed.searchParams.set('q', '80');
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
