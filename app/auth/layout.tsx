export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <main className="relative isolate flex flex-1 items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_9%,transparent),transparent)]"
      />
      {children}
    </main>
  );
}
