import {
  trigger,
  transition,
  style,
  query,
  animate,
  keyframes,
  group
} from '@angular/animations';

/**
 * Route transition: entering view slides+fades up while leaving view fades out.
 */
export const routeSlideFade = trigger('routeSlideFade', [
  transition('* => *', [
    query(':leave, :enter', [
      style({ position: 'absolute', left: 0, width: '100%' })
    ], { optional: true }),

    query(':enter', [
      style({ opacity: 0, transform: 'translateY(24px) scale(0.98)' })
    ], { optional: true }),

    group([
      query(':leave', [
        animate('250ms ease-out', style({ opacity: 0, transform: 'translateY(-12px) scale(0.98)' }))
      ], { optional: true }),
      query(':enter', [
        animate('400ms 200ms ease-out', keyframes([
          style({ offset: 0, opacity: 0, transform: 'translateY(24px) scale(0.98)' }),
          style({ offset: 1, opacity: 1, transform: 'translateY(0) scale(1)' })
        ]))
      ], { optional: true })
    ])
  ])
]);

/**
 * Simple fade-only route transition.
 */
export const routeFade = trigger('routeFade', [
  transition('* => *', [
    query(':leave, :enter', [
      style({ position: 'absolute', left: 0, width: '100%', opacity: 0 })
    ], { optional: true }),
    query(':leave', [
      animate('200ms ease-out', style({ opacity: 0 }))
    ], { optional: true }),
    query(':enter', [
      animate('350ms ease-out', style({ opacity: 1 }))
    ], { optional: true })
  ])
]);