import ReactMarkdown from "react-markdown";

interface ComparisonFrameProps {
  content: string;
  title: string;
  caption: string;
}

export function ComparisonFrame({
  content,
  title,
  caption,
}: ComparisonFrameProps) {
  return (
    <div className="flex flex-col gap-2 max-2xl:w-full">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">
        {title}
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        {caption}
      </p>
      <article className="prose dark:prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
