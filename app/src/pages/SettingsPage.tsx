import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Share } from "@capacitor/share";
import { useTolgee, useTranslate } from "@tolgee/react";

// Shadcn UI components
import Page from "src/components/Page";
import Header from "src/components/Header";
import Toolbar from "src/components/Toolbar";
import BackButton from "src/components/BackButton";
import { ScrollArea } from "src/components/ui/scroll-area";
import { Button } from "src/components/ui/button";
import { Label } from "src/components/ui/label";
import { Separator } from "src/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Switch } from "src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import {
  Dialog,
  DialogContent,
} from "src/components/ui/dialog";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "src/components/ui/tabs";

// Hooks and utilities
import { SignOut } from "src/lib/db/auth";
import { updateUser } from "src/lib/db/profile";
import getPathTo from "src/lib/utils/getPathTo";
import { subscribeToTopic, unSubscribeToTopic } from "src/state/Notifications";
import { auth } from "src/state/auth";
import FeedBackView from "src/views/feedbackView";
import useDisclosore from "src/hooks/useDisclosore";
import { useCurrency } from "src/hooks/useCurrency";

const defaultNotifications = {
  messages: true,
  bookings: true,
  ads: true,
};

export default function Settings() {
  const session = auth((s) => s.session);
  const isHost = auth((s) => s.isHost);
  const notifications = session
    ? session.user.user_metadata?.notifications! || defaultNotifications
    : defaultNotifications;
  const user = session ? session.user : null;
  
  const tolgee = useTolgee(["language"]);
  const navigate = useNavigate();
  const [feedbackOpen, onFeedbackOpen, onFeedbackClose] = useDisclosore();
  const lang = tolgee.getLanguage();
  const { t } = useTranslate();
  const { currency, setCurrency } = useCurrency();

  const onLanguageChange = (value: string) => {
    tolgee.changeLanguage(value);
  };

  function shareApp() {
    Share.share({
      text: "Visit Manazl App ",
      url: getPathTo(""),
      dialogTitle: "Manazl App",
    });
  }

  const updateNotification = (update: Partial<typeof defaultNotifications>) => {
    const newNot = { ...notifications, ...update };
    updateUser({ notifications: newNot });
  };

  return (
    <Page>
      <Header>
        <Toolbar>
          <div className="flex items-center">
            <BackButton />
          </div>
          <div className="flex-1 text-center font-semibold">
            {t("settings")}
          </div>
          <div className="w-10"></div>
        </Toolbar>
      </Header>

      <Dialog open={feedbackOpen} onOpenChange={onFeedbackClose}>
        <DialogContent className="sm:max-w-md">
          <FeedBackView onsend={onFeedbackClose} />
        </DialogContent>
      </Dialog>

      <ScrollArea className="w-full mx-auto max-w-md px-4">
        <div className="py-6 space-y-6">
          {/* Account Section */}
          <div>
            <h2 className="text-lg font-semibold mb-3">{t("Account")}</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {/* <Button 
                    variant="ghost" 
                    className="w-full justify-start py-5 px-4 rounded-none"
                    disabled={!session}
                    onClick={() => navigate("/changepassword")}
                  >
                    {t("Change Password")}
                  </Button> */}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start py-5 px-4 rounded-none"
                    onClick={session ? SignOut : () => navigate("/login")}
                  >
                    {session ? t("LogOut") : t("LogIn")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* General Section */}
          <div>
            <h2 className="text-lg font-semibold mb-3">{t("General")}</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="p-4">
                    <Label className="mb-2 block">{t("Language")}</Label>
                    <Tabs 
                      defaultValue={lang} 
                      onValueChange={onLanguageChange}
                      className="w-full"
                    >
                      <TabsList className="w-full">
                        <TabsTrigger value="ar" className="w-1/2">العربية</TabsTrigger>
                        <TabsTrigger value="en" className="w-1/2">English</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="p-4">
                    <Label className="mb-2 block">{t("currency")}</Label>
                    <Select
                      value={currency}
                      onValueChange={(value) => setCurrency(value as any)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("Select currency")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OMR">{t("Omani Rial")}</SelectItem>
                        <SelectItem value="$">{t("US Dollar")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start py-5 px-4 rounded-none"
                    asChild
                  >
                    <Link to="/policy">{t("Terms of Service")}</Link>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start py-5 px-4 rounded-none"
                    onClick={onFeedbackOpen}
                  >
                    {t("Talk With Us")}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start py-5 px-4 rounded-none"
                    onClick={shareApp}
                  >
                    {t("Share The App")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications Section */}
          <div>
            <h2 className="text-lg font-semibold mb-3">{t("Notifications")}</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="flex items-center justify-between py-4 px-4">
                    <Label htmlFor="ads-toggle" className="cursor-pointer">
                      {t("Ads & News")}
                    </Label>
                    <Switch 
                      id="ads-toggle"
                      checked={notifications?.ads!}
                      onCheckedChange={(checked) => {
                        checked
                          ? subscribeToTopic("ads,news")
                          : unSubscribeToTopic("ads,news");
                        updateNotification({ ads: checked });
                      }}
                    />
                  </div>
                  
                  {session?.user && (
                    <div className="flex items-center justify-between py-4 px-4">
                      <Label htmlFor="messages-toggle" className="cursor-pointer">
                        {t("Messages")}
                      </Label>
                      <Switch 
                        id="messages-toggle"
                        checked={notifications?.messages!}
                        onCheckedChange={(checked) => {
                          if (user) {
                            updateNotification({
                              messages: checked,
                            });
                            checked
                              ? subscribeToTopic("message:id." + user.id)
                              : unSubscribeToTopic("message:id." + user.id);
                          }
                        }}
                      />
                    </div>
                  )}
                  
                  {isHost && (
                    <div className="flex items-center justify-between py-4 px-4">
                      <Label htmlFor="bookings-toggle" className="cursor-pointer">
                        {t("bookings")}
                      </Label>
                      <Switch 
                        id="bookings-toggle"
                        checked={notifications?.bookings!}
                        onCheckedChange={(checked) => {
                          if (user) {
                            updateNotification({
                              bookings: checked,
                            });
                            if (checked) {
                              subscribeToTopic("bookings:id." + user.id);
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="w-full flex items-center justify-center flex-col text-center py-6">
            <p className="text-sm text-muted-foreground">
              <Link to="https://manazl.site" className="text-primary hover:underline">
                Manazl
              </Link>
              {" "}
              v1.0
            </p>
          </div>
        </div>
      </ScrollArea>
    </Page>
  );
}
