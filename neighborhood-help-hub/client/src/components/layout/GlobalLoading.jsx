import { useSelector } from 'react-redux';
export default function GlobalLoading() {
  const loading = useSelector(s=>s.globalLoading.loading);
  if (!loading) return null;
  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center pointer-events-none'>
      <div className='animate-spin h-24 w-24 border-8 border-primary-600 border-t-transparent rounded-full' />
    </div>
  );
}
