import { AssetDetailContent } from "@/src/components/asset-detail/asset-detail-content";
import { getServerAuth } from "@/src/lib/auth-mode";
import { shouldRedirectToSignIn } from "@/src/lib/auth-mode-client";

export default async function AssetDetailPage({ params }) {
  const { asset_id } = await params;
  const { isAuthenticated, redirectToSignIn } = await getServerAuth();

  if (shouldRedirectToSignIn(isAuthenticated)) return redirectToSignIn();

  return <AssetDetailContent asset_id={asset_id} />;
}
