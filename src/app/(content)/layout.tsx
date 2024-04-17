export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="prose dark:prose-invert mx-auto mb-8 max-w-2xl pt-4">
      {children}
    </main>
  );
}
