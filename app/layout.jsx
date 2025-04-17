export const metadata = {
  title: "Admin Leave Tracker",
  description: "Track administrative leave balances easily.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
