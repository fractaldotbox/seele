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
		<div className="flex flex-col gap-4 max-2xl:w-full border rounded-lg p-6 bg-card/80">
			<div className="space-y-2">
				<h1 className="text-xl font-semibold text-foreground text-center">
					{title}
				</h1>
				<p className="text-sm text-muted-foreground text-center">{caption}</p>
			</div>
			<article className="prose dark:prose-invert">{content}</article>
		</div>
	);
}
