import { Metadata } from 'next';

export default function DocsCatchAllPage({ params }: { params: { slug: string[] } }) {
  const fullPath = '/docs/' + params.slug.join('/');
  
  return (
    <div>
      <h1>Redirecting to Documentation...</h1>
      <p>Please wait while we redirect you to the documentation.</p>
      <script dangerouslySetInnerHTML={{
        __html: `window.location.href = "${fullPath}";`
      }} />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Documentation Redirect',
};
