"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, MessageCircle, Share2, Radio, Plus, ThumbsUp } from "lucide-react";
import { useCommunityPosts } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function PostComposer() {
  const t = useTranslations("community");
  const [open, setOpen] = useState(false);
  const [posted, setPosted] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setPosted(false); }}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> {t("post")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{t("askQuestion")}</DialogTitle></DialogHeader>
        {posted ? (
          <div className="grid place-items-center py-6"><Badge variant="soft">✓ {t("post")}</Badge></div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setPosted(true); }}>
            <div className="space-y-1.5">
              <Label htmlFor="q">{t("writeQuestion")}</Label>
              <Textarea id="q" rows={4} placeholder="e.g. My batch is 3 weeks old and feed intake dropped…" />
            </div>
            <Button type="submit" className="w-full">{t("post")}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function CommunityView() {
  const t = useTranslations("community");
  const { data, isLoading, isError, refetch } = useCommunityPosts();
  const [tab, setTab] = useState("nearby");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const posts = (data ?? []).filter((p) => tab === "nearby" || (tab === "trending" && p.likes >= 10));

  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
      <PageHeader title={t("title")} description={t("subtitle")} actions={<PostComposer />} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="nearby">{t("nearby")}</TabsTrigger>
          <TabsTrigger value="trending">{t("trending")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        <div className="mt-4 space-y-4">
          {posts.map((p) => {
            const isLiked = liked.has(p.id);
            const isFollowing = following.has(p.id) ?? p.following;
            return (
              <Card key={p.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/15 text-primary">{initials(p.author)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{p.author}</p>
                      <Badge variant="outline" className="text-[10px]">{p.tag}</Badge>
                      {p.live ? <Badge variant="soft" className="gap-1 text-[10px] text-destructive"><Radio className="h-3 w-3 animate-pulse" /> {t("liveNow")}</Badge> : null}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.timeAgo}</p>
                    <p className="mt-2 text-sm leading-relaxed">{p.content}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button variant="ghost" size="sm" className={cn("gap-1.5", isLiked && "text-destructive")} onClick={() => setLiked(toggle(liked, p.id))}>
                    {isLiked ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
                    {p.likes + (isLiked ? 1 : 0)}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1.5"><MessageCircle className="h-4 w-4" /> {p.replies}</Button>
                  <Button variant="ghost" size="sm" className="gap-1.5"><Share2 className="h-4 w-4" /> {t("share")}</Button>
                  <Button variant="outline" size="sm" className={cn("ml-auto gap-1", isFollowing && "text-primary")} onClick={() => setFollowing(toggle(following, p.id))}>
                    <ThumbsUp className="h-3.5 w-3.5" /> {isFollowing ? t("following") : t("follow")}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </DataState>
    </div>
  );
}