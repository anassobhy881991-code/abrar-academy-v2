import './globals.css';

export const metadata = {
  title: 'أكاديمية أبرار القرآن - تسجيل معلمين',
  description: 'نموذج تسجيل معلمي أكاديمية أبرار القرآن',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
