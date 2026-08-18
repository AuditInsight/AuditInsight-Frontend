// src/components/seo/SEO.tsx

"use client";

import Head from "next/head";

type SEOProps = {
  title?: string;
  description?: string;
  ogImage?: string;
};

export default function SEO({ title = "AuditInsight", description = "An intelligent audit readiness platform that organizes financial evidence, links every transaction to its supporting documents, and helps organizations prepare for audits with confidence.
  ", ogImage }: SEOProps) {
  const defaultImage = ogImage ?? "/og-default.png"; // ensure a fallback image exists in public folder
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultImage} />
    </Head>
  );
}
