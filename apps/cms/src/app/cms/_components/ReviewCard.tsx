import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const ReviewCard = ({
	reviewer,
	comment,
}: {
	reviewer?: string;
	comment: string;
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Review</CardTitle>
				{/* <CardDescription>{comment}</CardDescription> */}
			</CardHeader>
			<CardContent>
				<p>{comment}</p>
			</CardContent>
			{/* <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
		</Card>
	);
};
