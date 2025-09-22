import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTranslate } from "@tolgee/react";
import { Link, Plus } from "lucide-react";


export default function BecomeHostCard() {
    const { t } = useTranslate();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("Become a Host")}</CardTitle>
                <CardDescription>
                    {t("Start your journey as a host and earn extra income")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    {t(
                        "Hosting on our platform is easy and rewarding. You can share your space, meet new people, and earn money."
                    )}
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>{t("List your space for free")}</li>
                    <li>{t("Set your own schedule and prices")}</li>
                    <li>{t("Welcome guests from around the world")}</li>
                </ul>
                <Link href="/account/myhost/create">
                    <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        {t("Make Your Listing")}
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
