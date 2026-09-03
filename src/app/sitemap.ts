import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { MOCK_PRODUTOS, MOCK_VENDEDORES } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/login`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cadastro`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const produtoRoutes: MetadataRoute.Sitemap = MOCK_PRODUTOS.map((produto) => ({
    url: `${SITE_URL}/produtos/${produto.id}`,
    lastModified: produto.criado_em ? new Date(produto.criado_em) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const lojaRoutes: MetadataRoute.Sitemap = MOCK_VENDEDORES.map((vendedor) => ({
    url: `${SITE_URL}/loja/${vendedor.id}`,
    lastModified: vendedor.criado_em ? new Date(vendedor.criado_em) : undefined,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...produtoRoutes, ...lojaRoutes];
}
