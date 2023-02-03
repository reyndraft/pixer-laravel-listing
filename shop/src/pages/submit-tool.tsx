import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from '@/types';
import Layout from '@/layouts/_layout';
import routes from '@/config/routes';
import Seo from '@/layouts/_seo';

const SubmitToolPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Seo
        title="Submit Tool"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url="/submit-tool"
      />
      <div className="flex h-full items-center justify-center p-4 md:p-6 xl:p-8">
        <div className="max-w-md text-center xl:max-w-lg">Submit tool here</div>
      </div>
    </>
  );
};

SubmitToolPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default SubmitToolPage;
