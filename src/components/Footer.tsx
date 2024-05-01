import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex min-h-16 w-full items-center justify-center bg-gray-800 p-4 text-sm text-gray-200">
      <div className="grid w-full max-w-[600px] grid-cols-3">
        <div className="flex flex-col items-center justify-evenly">
          <p>
            <Link href="/">Today&apos;s Haiku</Link>{" "}
          </p>
          <p>
            <Link href="/archive">Haiku Archive</Link>
          </p>
        </div>
        <div className="flex flex-col items-center justify-evenly">
          <p>
            <Link href="/generate">Generate Haikus</Link>{" "}
          </p>
          <p>
            <Link href="/myhaikus">My haikus</Link>
          </p>
        </div>
        <div className="flex flex-col items-center justify-evenly">
          <p>
            <Link href="/about">About this site</Link>
          </p>
          <p>
            <Link href="/aboutme">About me</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
