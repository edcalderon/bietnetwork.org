import { redirect } from 'next/navigation';

export default function DocsCatchAllPage({ params }: { params: { slug: string[] } }) {
  const fullPath = '/docs/' + params.slug.join('/');
  redirect(fullPath);
}
