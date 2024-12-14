import { config } from "@/app/site.config";
import { ContentWrapper } from "@/app/components/layouts/ContentWrapper";

export const Footer: React.FC = () => (
  <footer className="mt-20 py-4 border-t text-center text-[0.9rem]">
    <ContentWrapper>
      <p>© {config.siteMeta.siteName}</p>
    </ContentWrapper>
  </footer>
);