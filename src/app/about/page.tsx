
import { Building2, Target, Eye, Mail, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "").replace(/\/api$/, "") + "/api";

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  imageUrl: string;
  bio: string;
  email: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
};

type Goal = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type AboutData = {
  companyTitle: string;
  companySubtitle: string;
  heroImage: string;
  companyDescription: string;
  storyTitle: string;
  storyDescription: string;
  missionTitle: string;
  missionDescription: string;
  missionImage: string;
  visionTitle: string;
  visionDescription: string;
  visionImage: string;
  isActive: boolean;
  teamMembers: TeamMember[];
  features: Goal[];
};

async function getAboutData(): Promise<AboutData | null> {
  try {
    const response = await fetch(`${API_BASE}/about/public`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const result = await response.json();

    if (!result.success || !result.data) return null;

    return result.data as AboutData;
  } catch (error) {
    console.error("PUBLIC ABOUT API ERROR:", error);
    return null;
  }
}

export default async function AboutPage() {
  const about = await getAboutData();

  if (!about || !about.isActive) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-5">
        <div className="text-center">
          <Building2 className="mx-auto mb-4 text-primary" size={45} />
          <h1 className="text-2xl font-bold">About ROYS</h1>
          <p className="mt-2 text-base-content/60">
            Our About page is currently unavailable.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100 text-base-content">

      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#27151a] text-white">
        {about.heroImage && (
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{
              backgroundImage: `url("${about.heroImage}")`,
            }}
          />
        )}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />

        <div className="mx-auto flex min-h-[420px] max-w-7xl items-center px-5 py-20 md:min-h-[550px] md:px-10">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm">
              <Building2 size={16} />
              Discover Our Story
            </span>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              {about.companyTitle}
            </h1>

            {about.companySubtitle && (
              <h2 className="text-xl font-semibold text-white/85 md:text-2xl">
                {about.companySubtitle}
              </h2>
            )}

            <p className="max-w-2xl whitespace-pre-wrap text-base leading-8 text-white/80 md:text-lg">
              {about.companyDescription}
            </p>
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      {(about.storyTitle || about.storyDescription) && (
        <section className="mx-auto max-w-5xl px-5 py-20 text-center md:py-28">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
            Who We Are
          </span>

          <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
            {about.storyTitle}
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-primary" />

          <p className="mx-auto mt-8 max-w-4xl whitespace-pre-wrap text-base leading-8 text-base-content/70 md:text-lg">
            {about.storyDescription}
          </p>
        </section>
      )}

      {/* MISSION SECTION */}
      {(about.missionTitle || about.missionDescription) && (
        <section className="bg-base-200/70 py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-10">
            <div className="order-2 space-y-5 md:order-1">
              <div className="inline-flex rounded-xl bg-primary/10 p-4 text-primary">
                <Target size={30} />
              </div>

              <h2 className="text-3xl font-extrabold md:text-4xl">
                {about.missionTitle}
              </h2>

              <div className="h-1 w-16 rounded-full bg-primary" />

              <p className="whitespace-pre-wrap text-base leading-8 text-base-content/70">
                {about.missionDescription}
              </p>
            </div>

            <div className="order-1 md:order-2">
              {about.missionImage ? (
                <img
                  src={about.missionImage}
                  alt={about.missionTitle}
                  className="h-[300px] w-full rounded-2xl object-cover shadow-xl md:h-[420px]"
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-2xl bg-base-300 md:h-[420px]">
                  <Target size={65} className="text-base-content/30" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* VISION SECTION */}
      {(about.visionTitle || about.visionDescription) && (
        <section className="py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-10">
            <div>
              {about.visionImage ? (
                <img
                  src={about.visionImage}
                  alt={about.visionTitle}
                  className="h-[300px] w-full rounded-2xl object-cover shadow-xl md:h-[420px]"
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-2xl bg-base-200 md:h-[420px]">
                  <Eye size={65} className="text-base-content/30" />
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="inline-flex rounded-xl bg-primary/10 p-4 text-primary">
                <Eye size={30} />
              </div>

              <h2 className="text-3xl font-extrabold md:text-4xl">
                {about.visionTitle}
              </h2>

              <div className="h-1 w-16 rounded-full bg-primary" />

              <p className="whitespace-pre-wrap text-base leading-8 text-base-content/70">
                {about.visionDescription}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TEAM SECTION */}
      {about.teamMembers?.length > 0 && (
        <section className="bg-base-200/70 px-5 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
                The People Behind ROYS
              </span>

              <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
                Meet Our Team
              </h2>

              <p className="mt-4 leading-7 text-base-content/60">
                Meet the people who work together to make ROYS better every day.
              </p>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {about.teamMembers.map((member) => (
                <article
                  key={member.id}
                  className="group overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="overflow-hidden bg-base-200">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-72 items-center justify-center">
                        <Building2 size={55} className="text-base-content/30" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-5">
                    <div>
                      <h3 className="text-lg font-bold">
                        {member.name}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-primary">
                        {member.designation}
                      </p>
                    </div>

                    {member.bio && (
                      <p className="text-sm leading-6 text-base-content/60">
                        {member.bio}
                      </p>
                    )}

                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 break-all text-sm text-base-content/70 transition-colors hover:text-primary"
                      >
                        <Mail size={15} />
                        {member.email}
                      </a>
                    )}

                    <div className="flex flex-wrap gap-3 border-t border-base-300 pt-3">
                      {member.facebookUrl && (
                        <a
                          href={member.facebookUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${member.name} Facebook`}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          Facebook
                        </a>
                      )}

                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${member.name} LinkedIn`}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          LinkedIn
                        </a>
                      )}

                      {member.instagramUrl && (
                        <a
                          href={member.instagramUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${member.name} Instagram`}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GOALS SECTION */}
      {about.features?.length > 0 && (
        <section className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <span className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
                What Drives Us
              </span>

              <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
                Our Goals
              </h2>

              <p className="mx-auto mt-4 max-w-xl leading-7 text-base-content/60">
                Our goals guide every decision and inspire us to keep improving.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {about.features.map((goal, index) => (
                <article
                  key={goal.id}
                  className="group rounded-2xl border border-base-300 bg-base-100 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target size={27} />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Goal {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-3 text-xl font-bold">
                    {goal.title}
                  </h3>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-base-content/60">
                    {goal.description}
                  </p>

                  <div className="mt-5 flex justify-end text-primary transition-transform group-hover:translate-x-1">
                    <ArrowUpRight size={20} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
