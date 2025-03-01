import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export function ReviewTabs({
    reviewers,
    reviews
}: {
    reviewers: string[],
    reviews: any[]
}) {

    return (
        <Tabs defaultValue="vitalik-eth" className="w-[600px]">
            <TabsList className="grid w-full grid-cols-2">
                {
                    reviewers.map((reviewer, index) => (
                        <TabsTrigger key={reviewer} value={reviewer}>
                            {reviewer}
                        </TabsTrigger>
                    ))
                }
                {/* <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger> */}
            </TabsList>
            {
                reviews.map((review, index) => {
                    const reviewer = reviewers[index];
                    return (
                        <TabsContent key={`review-${reviewer}`} value={reviewer}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account</CardTitle>

                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {review}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )

                })
            }

        </Tabs>
    )
}