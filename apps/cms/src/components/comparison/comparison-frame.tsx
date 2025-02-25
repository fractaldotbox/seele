interface ComparisonFrameProps {
  src: string;
  title: string;
  caption: string;
}

export function ComparisonFrame({ src, title, caption }: ComparisonFrameProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        {caption}
      </p>
      <iframe
        src={src}
        className="w-full h-[600px] border border-gray-200 rounded-lg"
        title={title}
      />
    </div>
  );
}
