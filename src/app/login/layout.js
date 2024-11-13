import localFont from "next/font/local";
import "../globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "TODO LOGIN",
  description: "Login to view your TODOS",
};

export default function Layout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </div>
  );
}
