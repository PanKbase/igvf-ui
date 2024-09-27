// components
import Link from "./link-reloadable";

export function Logo() {
  return (
    <div className="logo-container">
      {/* Add your logo content here */}
      <img src="/collections/pkb-4.svg" alt="Site Logo" className="logo-image" />
    </div>
  );
}

export default function SiteLogo() {
  return (
    <Link href="/" className="block w-32 py-2 md:h-24 md:w-auto md:px-8">
      <Logo />
      <span className="sr-only">Home</span>
    </Link>
  );
}
