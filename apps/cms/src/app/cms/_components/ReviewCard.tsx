import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const ReviewCard = () => {
    const reviewer = 'vitalik.eth';

    const comment = `This is a great article!`;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Review by {reviewer}</CardTitle>
                {/* <CardDescription>{comment}</CardDescription> */}
            </CardHeader>
            <CardContent>
                <p>{comment}</p>
            </CardContent>
            {/* <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
        </Card>
    )
}