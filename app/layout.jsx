import "./globals.css";

export const metadata = {
  title: "Pixel Portal | Digital Marketing Services",
  description:
    "Pixel Portal helps businesses grow with algorithmic growth, cognitive SEO, omnichannel architecture, and decision-ready data engineering.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
