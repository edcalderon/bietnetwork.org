import { Metadata } from 'next';

export default function DocsPage() {
  return (
    <div>
      <h1>Redirecting to Documentation...</h1>
      <p>Please wait while we redirect you to the documentation.</p>
      <script dangerouslySetInnerHTML={{
        __html: 'window.location.href = "/docs/";'
      }} />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Documentation Redirect',
};