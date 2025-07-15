import { GetServerSideProps } from 'next';
import Head from 'next/head';
import PublicationsList from '@/components/PublicationsList';
import { PageProps } from '@/types';
import { config } from '@/lib/config';

interface HomeProps extends PageProps {
  // Add any additional props here
}

export default function Home({ apiEndpoint }: HomeProps) {
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
        <PublicationsList apiEndpoint={apiEndpoint} />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  // Get API endpoint from configuration
  const apiEndpoint = config.apiEndpoint;

  return {
    props: {
      apiEndpoint,
    },
  };
}; 