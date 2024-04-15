import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex h-16 w-full items-center justify-center bg-gray-800 text-sm text-gray-200">
      <div className="grid w-full max-w-[600px] grid-cols-2">
        <div className="flex flex-col items-center justify-evenly">
          <p>
            <Link href="/">Today&apos;s Haiku</Link>{" "}
          </p>
          <p>
            <Link href="/archive">Haiku Archive</Link>
          </p>
          <p>
            <Link href="/generate">Generate Haikus</Link>
          </p>
        </div>
        <div className="flex flex-col items-center justify-evenly">
          <p>
            <Link href="/about">About this site</Link>
          </p>
          <p>
            <Link href="/about">About me</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
