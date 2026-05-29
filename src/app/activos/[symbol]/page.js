import { AssetDetailContent } from "@/src/components/asset-detail/asset-detail-content";
import { getServerAuth, shouldRedirectToSignIn } from "@/src/lib/auth-mode";

export default async function AssetDetailPage({ params }) {
  const { symbol } = await params;
  const { isAuthenticated, redirectToSignIn } = await getServerAuth();

  if (shouldRedirectToSignIn(isAuthenticated)) return redirectToSignIn();

  return <AssetDetailContent symbol={symbol} />;
}
