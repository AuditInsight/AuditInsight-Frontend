"use client";

import Head from "next/head";

interface SEOProps {
  /** Page title – will be combined with the brand name */
  title: string;
  /** Short description for meta description & search snippets */
  description: string;
  /** Optional URL for the canonical link (defaults to window.location) */
  canonicalUrl?: string;
  /** Optional image for Open Graph / Twitter cards */
  image?: string;
}
/**
 * Centralised SEO tags for all pages.
 * Usage: <SEO title="Settings • AuditInsight" description="Manage org profile, users…" />
 */
export default function SEO({ title, description, canonicalUrl, image }: SEOProps) {
  const fullTitle = `${title} – AuditInsight`;
  const ogImage = image ?? "/logo.svg";

  return (
    <Head>
      {/* Basic tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl ?? ""} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="AuditInsight" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
