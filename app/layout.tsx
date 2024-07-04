import Footer from './_components/Footer';
import Header from './_components/Header';

import './globals.css';

export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
