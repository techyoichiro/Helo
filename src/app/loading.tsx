import Spinner from '@/app/components/common/Spinner';

export default function Loading() {
  return (
    <div className="flex justify-center items-center py-10">
      <Spinner className="mx-2" />
      <p className="text-lg">Loading</p>
    </div>
  );
}