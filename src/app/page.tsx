import { redirect } from 'next/navigation';

export default function RootPage() {
  // For static export, always redirect to Arabic (default language)
  // Client-side language detection will be handled by the layout
  redirect('/ar');
}
