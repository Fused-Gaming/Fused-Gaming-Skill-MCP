export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          background: '#0a0a0a',
          color: '#e5e5e5',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
