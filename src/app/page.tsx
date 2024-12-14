import { ContentWrapper } from "./components/layouts/ContentWrapper";
import { PageSEO } from "./components/layouts/PageSEO";
import { config } from "./site.config";
import ArticleTabs from "./components/layouts/ArticleTabs";

interface HomeProps {
  searchParams: Promise<{ page?: string; tab?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const activeTab = params.tab === 'latest' ? 'latest' : 'trending';

  return (
    <div>
      <PageSEO
        title={config.siteMeta.title}
        description={config.siteMeta.description}
        path="/"
        removeSiteNameFromTitle={true}
      />

      <section className="py-4">
        <ContentWrapper>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            {config.siteMeta.title}
          </h1>
          {config.siteMeta.description && (
            <p className="mt-1 text-lg text-gray-400">
              {config.siteMeta.description}
            </p>
          )}
        </ContentWrapper>
      </section>

      <section className="py-6">
        <ContentWrapper>
          <ArticleTabs activeTab={activeTab} page={page} />
        </ContentWrapper>
      </section>
    </div>
  );
}