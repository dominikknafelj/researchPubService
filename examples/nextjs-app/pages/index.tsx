import Head from 'next/head';
import PublicationsList from '@/components/PublicationsList';
import { config } from '@/lib/config';

export default function Home() {
  return (
    <>
      <Head>
        <title>Research Publications - Digital Promise</title>
        <meta name="description" content="Categorized research publications from Digital Promise's content management system" />
        <meta name="keywords" content="research, publications, education, K-12, higher education, adult learning" />
        <meta property="og:title" content="Research Publications - Digital Promise" />
        <meta property="og:description" content="Categorized research publications from Digital Promise's content management system" />
        <meta property="og:type" content="website" />
      </Head>
      
      <main>
        <PublicationsList apiEndpoint={config.apiEndpoint} />
      </main>
    </>
  );
}

 