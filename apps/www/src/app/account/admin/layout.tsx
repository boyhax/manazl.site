import { MainContent } from '@/components/Page';
import Sidepanel from './sidePanel';

export const metadata = {
  title: 'Next.js App',
  description: 'Created with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=' h-full flex flex-col md:flex-row gap-6 '>
      <Sidepanel />
      <MainContent >
        {children}
      </MainContent>
    </div>

  );
}