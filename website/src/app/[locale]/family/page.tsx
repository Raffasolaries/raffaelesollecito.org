import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/Section";

const childhoodPhotos = [
  { src: "/images/family/parents-young.jpg", captionKey: "photos.parents_young" },
  { src: "/images/family/baptism.jpg", captionKey: "photos.baptism" },
  { src: "/images/family/with-mom.jpg", captionKey: "photos.with_mom" },
  { src: "/images/family/age-1.jpg", captionKey: "photos.age_1" },
  { src: "/images/family/age-5.jpg", captionKey: "photos.age_5" },
  { src: "/images/family/age-4.jpg", captionKey: "photos.age_4" },
  { src: "/images/family/age-6.jpg", captionKey: "photos.age_6" },
  { src: "/images/family/school-class.jpg", captionKey: "photos.school_class" },
  { src: "/images/family/birthday-8.jpg", captionKey: "photos.birthday_8" },
] as const;

const friends = [
  {
    key: "antonella",
    src: "/images/family/friend-antonella.jpg",
  },
  {
    key: "francesco",
    src: "/images/family/friend-francesco.jpg",
  },
  {
    key: "erica",
    src: "/images/family/friend-erica.jpg",
  },
  {
    key: "milko",
    src: "/images/family/friend-milko.jpg",
  },
] as const;

export default async function FamilyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("family");

  return (
    <>
      {/* Intro */}
      <Section className="pt-32">
        <SectionHeader
          title={t("title")}
          headline={t("headline")}
          subtitle={t("subtitle")}
        />

        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed">{t("intro")}</p>
        </div>
      </Section>

      {/* Childhood Photo Gallery */}
      <Section className="bg-surface/30">
        <h3 className="text-2xl font-bold mb-10">{t("photos_title")}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {childhoodPhotos.map((photo) => (
            <div key={photo.captionKey} className="group">
              <div className="overflow-hidden rounded-lg border border-border/50">
                <img
                  src={photo.src}
                  alt={t(photo.captionKey)}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="mt-3 text-sm text-muted text-center">
                {t(photo.captionKey)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Friends Testimonials */}
      <Section>
        <h3 className="text-2xl font-bold mb-10">{t("friends_title")}</h3>

        <div className="grid md:grid-cols-2 gap-8">
          {friends.map((friend) => (
            <div
              key={friend.key}
              className="bg-surface border border-border/50 rounded-lg p-8 hover:border-accent/30 transition-all"
            >
              <div className="flex items-center gap-5 mb-6">
                <div className="shrink-0">
                  <img
                    src={friend.src}
                    alt={t(`friends.${friend.key}.name`)}
                    className="w-16 h-16 rounded-full object-cover border-2 border-accent/30"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">
                    {t(`friends.${friend.key}.name`)}
                  </h4>
                </div>
              </div>
              <blockquote className="text-muted leading-relaxed italic border-l-2 border-accent/30 pl-4">
                &ldquo;{t(`friends.${friend.key}.quote`)}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
