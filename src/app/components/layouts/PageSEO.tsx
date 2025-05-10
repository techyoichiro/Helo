import { Metadata } from "next";
import { config } from "@/app/site.config";
import { Props } from '@/app/types/common';

export function generateMetadata(props: Props): Metadata {
  const {
    path,
    title,
    description,
    ogImageUrl,
    noindex,
    removeSiteNameFromTitle,
  } = props;

  const pageUrl = `${config.siteRoot}${path || ""}`;
  const fullTitle = removeSiteNameFromTitle
    ? title
    : `${title} | ${config.siteMeta.title}`;

  return {
    title: fullTitle,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: pageUrl,
      siteName: config.siteMeta.title,
      images: [
        {
          url: ogImageUrl || `${config.siteRoot}/og.png`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
    ...(path && { alternates: { canonical: pageUrl } }),
    ...(noindex && { robots: "noindex" }),
  };
}

// このコンポーネントは不要になりましたが、後方互換性のために残しておきます
export const PageSEO: React.FC<Props> = () => null;