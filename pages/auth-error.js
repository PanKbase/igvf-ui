import { useRouter } from "next/router";
// components
import Error from "../components/error";

/**
 * Display an authentication error page.
 */
export default function AuthError() {
  const router = useRouter();
  const reason =
    typeof router.query.reason === "string" ? router.query.reason : "";

  return (
    <Error
      statusCode="AUTHENTICATION"
      title={
        reason ||
        "Unable to sign in. You can still explore the site without viewing unreleased data."
      }
    />
  );
}
