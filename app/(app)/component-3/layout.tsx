interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function C3IpoValidationLayout({
  children,
}: AppLayoutProps) {
  return <div>{children}</div>;
}
