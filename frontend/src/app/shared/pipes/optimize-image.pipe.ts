import { Pipe, PipeTransform } from '@angular/core';
import { buildImageSrcSet, optimizeImageUrl } from '../../core/utils/image-url.util';

@Pipe({
  name: 'optimizeImage',
  standalone: true
})
export class OptimizeImagePipe implements PipeTransform {
  transform(url: string | null | undefined, width: number = 800): string {
    return optimizeImageUrl(url, { width });
  }
}

@Pipe({
  name: 'imageSrcSet',
  standalone: true
})
export class ImageSrcSetPipe implements PipeTransform {
  transform(url: string | null | undefined, widths: number[] | string = [400, 800, 1200]): string {
    const resolvedWidths = typeof widths === 'string'
      ? widths.split(',').map((value) => Number(value.trim())).filter((value) => value > 0)
      : widths;

    return buildImageSrcSet(url, resolvedWidths);
  }
}
