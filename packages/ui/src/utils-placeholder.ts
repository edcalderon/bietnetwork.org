/**
 * Placeholder utils for when clsx and tailwind-merge are not available
 */

// Simple utility function for combining class names
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
