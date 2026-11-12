import type { Metadata } from "next";
import Image from "next/image";
import {
  Award,
  HeartHandshake,
  ShieldCheck,
  Star,
  Truck,
  Mail,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ==========================================
// IMAGE URL HELPER
// ==========================================

function getImageUrl(imagePath?: string | null) {
  if (!imagePath) return "";

  const path = imagePath.trim();

  if (!path) return "";

  // Already a full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Path starts with /uploads/
  if (path.startsWith("/uploads/")) {
    return `${API_URL}${path}`;
  }

  // Path starts with uploads/
  if (path.startsWith("uploads/")) {
    return `${API_URL}/${path}`;
  }

  // Only filename is stored in database
  return `${API_URL}/uploads/team/${path}`;
}

// ==========================================
// TYPES
// ==========================================

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  roleType: string;
  imageUrl: string;
  bio: string;
  email?: string | null;
  facebookUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
};

type Feature = {
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

  teamMembers: TeamMember[];
  features: Feature[];
};

// ==========================================
// SEO
// ==========================================

export const metadata: Metadata = {
  title: "About Us | ROYS",
  description: "Learn more about ROYS, our story, mission, vision and team.",
};

// ==========================================
// FETCH ABOUT DATA
// ==========================================

async function getAboutData(): Promise<AboutData | null> {
  try {
    const response = await fetch(`${API_URL}/api/about/public`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data as AboutData;
  } catch (error) {
    console.error("About page fetch error:", error);
    return null;
  }
}

// ==========================================
// FEATURE ICON
// ==========================================

function FeatureIcon({ name }: { name: string }) {
  const key = name.toLowerCase();

  if (key.includes("truck") || key.includes("delivery")) {
    return <Truck size={24} />;
  }

  if (key.includes("shield") || key.includes("secure")) {
    return <ShieldCheck size={24} />;
  }

  if (key.includes("heart") || key.includes("service")) {
    return <HeartHandshake size={24} />;
  }

  if (key.includes("award") || key.includes("quality")) {
    return <Award size={24} />;
  }

  return <Star size={24} />;
}

// ==========================================
// MAIN PAGE
// ==========================================

export default async function AboutPage() {
  const about = await getAboutData();

  if (!about) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-5">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">About ROYS</h1>

          <p className="mt-3 text-gray-500">
            Our About page is being updated. Please check back soon.
          </p>
        </div>
      </main>
    );
  }

  const leadership = about.teamMembers.filter(
    (member) => member.roleType === "LEADERSHIP",
  );

  const generalTeam = about.teamMembers.filter(
    (member) => member.roleType !== "LEADERSHIP",
  );

  return (
    <main className="bg-white text-gray-800">
      {/* ==================================
          HERO SECTION
      ================================== */}

      <section className="relative isolate flex min-h-[360px] items-center overflow-hidden bg-[#241116]">
        {about.heroImage && (
          <Image
            src={getImageUrl(about.heroImage)}
            alt="ROYS About Us"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
        )}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />

        <div className="mx-auto w-full max-w-7xl px-5 py-20 md:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-rose-200">
            Get to know us
          </p>

          <h1 className="max-w-3xl text-4xl font-bold text-white md:text-6xl">
            {about.companyTitle}
          </h1>

          {about.companySubtitle && (
            <p className="mt-5 max-w-2xl text-lg text-white/80">
              {about.companySubtitle}
            </p>
          )}
        </div>
      </section>

      {/* ==================================
          COMPANY DESCRIPTION
      ================================== */}

      {about.companyDescription && (
        <section className="mx-auto max-w-5xl px-5 py-16 text-center md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7f1d2d]">
            Who We Are
          </p>

          <p className="mt-5 whitespace-pre-line text-lg leading-8 text-gray-600">
            {about.companyDescription}
          </p>
        </section>
      )}

      {/* ==================================
          OUR STORY
      ================================== */}

      {about.storyDescription && (
        <section className="bg-gray-50 px-5 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7f1d2d]">
                Our Journey
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                {about.storyTitle}
              </h2>

              <p className="mt-6 whitespace-pre-line leading-8 text-gray-600">
                {about.storyDescription}
              </p>
            </div>

            {about.heroImage ? (
              <Image
                src={getImageUrl(about.heroImage)}
                alt="ROYS story"
                width={800}
                height={500}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-80 w-full rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-2xl bg-[#7f1d2d]/5">
                <HeartHandshake size={64} className="text-[#7f1d2d]" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================================
          MISSION AND VISION
      ================================== */}

      {(about.missionDescription || about.visionDescription) && (
        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-2 md:py-20">
          {/* MISSION */}

          {about.missionDescription && (
            <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {about.missionImage && (
                <Image
                  src={getImageUrl(about.missionImage)}
                  alt={about.missionTitle}
                  width={800}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-52 w-full object-cover"
                />
              )}

              <div className="p-7">
                <div className="mb-4 inline-flex rounded-xl bg-[#7f1d2d]/10 p-3 text-[#7f1d2d]">
                  <HeartHandshake size={25} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {about.missionTitle}
                </h2>

                <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                  {about.missionDescription}
                </p>
              </div>
            </article>
          )}

          {/* VISION */}

          {about.visionDescription && (
            <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {about.visionImage && (
                <Image
                  src={getImageUrl(about.visionImage)}
                  alt={about.visionTitle}
                  width={800}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-52 w-full object-cover"
                />
              )}

              <div className="p-7">
                <div className="mb-4 inline-flex rounded-xl bg-[#7f1d2d]/10 p-3 text-[#7f1d2d]">
                  <Award size={25} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {about.visionTitle}
                </h2>

                <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                  {about.visionDescription}
                </p>
              </div>
            </article>
          )}
        </section>
      )}

      {/* ==================================
          WHY CHOOSE ROYS
      ================================== */}

      {about.features.length > 0 && (
        <section className="bg-gray-50 px-5 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7f1d2d]">
                The ROYS Difference
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                Why Choose ROYS
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {about.features.map((feature) => (
                <article
                  key={feature.id}
                  className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
                >
                  <div className="mb-5 inline-flex rounded-xl bg-[#7f1d2d]/10 p-3 text-[#7f1d2d]">
                    <FeatureIcon name={feature.icon} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================================
          LEADERSHIP TEAM
      ================================== */}

      {leadership.length > 0 && (
        <TeamSection
          title="Leadership Team"
          subtitle="The people guiding our journey."
          members={leadership}
        />
      )}

      {/* ==================================
          GENERAL TEAM
      ================================== */}

      {generalTeam.length > 0 && (
        <TeamSection
          title="Meet Our Team"
          subtitle="The people who make ROYS possible every day."
          members={generalTeam}
        />
      )}
    </main>
  );
}

// ==========================================
// TEAM SECTION
// ==========================================

function TeamSection({
  title,
  subtitle,
  members,
}: {
  title: string;
  subtitle: string;
  members: TeamMember[];
}) {
  if (!members.length) return null;

  return (
    <section className="overflow-hidden bg-white py-20 md:py-24">
      {/* HEADER */}

      <div className="mx-auto mb-14 max-w-7xl px-5 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#7f1d2d]/5 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-[#7f1d2d]" />

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7f1d2d]">
            Our People
          </span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
          {title}
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
          {subtitle}
        </p>

        <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#7f1d2d]" />
      </div>

      {/* TEAM MEMBERS */}

      <div className="mx-auto grid max-w-7xl grid-cols-1 justify-items-center gap-12 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => {
          const imageUrl = getImageUrl(member.imageUrl);

          return (
            <article
              key={member.id}
              className="group flex w-full max-w-[280px] flex-col items-center rounded-2xl px-5 py-7 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-gray-50 hover:shadow-xl hover:shadow-[#7f1d2d]/10"
            >
              {/* CIRCLE IMAGE */}

              <div className="relative mb-6 h-44 w-44 rounded-full p-1.5 ring-2 ring-[#7f1d2d]/20 transition-all duration-500 group-hover:scale-105 group-hover:ring-4 group-hover:ring-[#7f1d2d]">
                <div className="h-full w-full overflow-hidden rounded-full bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={member.name}
                      width={400}
                      height={400}
                      unoptimized
                      sizes="176px"
                      className="h-full w-full rounded-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-6xl font-bold text-[#7f1d2d]/40">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* DECORATIVE DOT */}

                <span className="absolute bottom-3 right-3 h-5 w-5 rounded-full border-4 border-white bg-[#7f1d2d] transition-transform duration-300 group-hover:scale-125" />
              </div>

              {/* MEMBER INFO */}

              <h3 className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#7f1d2d]">
                {member.name}
              </h3>

              <p className="mt-2 text-sm font-semibold text-[#7f1d2d]">
                {member.designation}
              </p>

              <div className="mt-3 h-0.5 w-10 rounded-full bg-[#7f1d2d]/30 transition-all duration-500 group-hover:w-16 group-hover:bg-[#7f1d2d]" />

              {member.bio && (
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-500">
                  {member.bio}
                </p>
              )}

              {/* SOCIAL LINKS & EMAIL */}

              {(member.email ||
                member.facebookUrl ||
                member.linkedinUrl ||
                member.instagramUrl) && (
                <div className="mt-5 flex items-center justify-center gap-3">
                  {/* EMAIL */}

                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      title={member.email}
                      aria-label="Email"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7f1d2d]/5 text-[#7f1d2d] transition-all duration-300 hover:-translate-y-1 hover:bg-[#7f1d2d] hover:text-white"
                    >
                      <Mail size={18} />
                    </a>
                  )}

                  {/* FACEBOOK */}

                  {member.facebookUrl && (
                    <a
                      href={member.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7f1d2d]/5 text-[#7f1d2d] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1877F2] hover:text-white"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-[18px] w-[18px]"
                      >
                        <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v2H6.8v3.2h2.8V21h3.9z" />
                      </svg>
                    </a>
                  )}

                  {/* INSTAGRAM */}

                  {member.instagramUrl && (
                    <a
                      href={member.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7f1d2d]/5 text-[#7f1d2d] transition-all duration-300 hover:-translate-y-1 hover:bg-pink-600 hover:text-white"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-[18px] w-[18px]"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="5" />

                        <circle cx="12" cy="12" r="4" />

                        <circle
                          cx="17.5"
                          cy="6.5"
                          r="0.8"
                          fill="currentColor"
                          stroke="none"
                        />
                      </svg>
                    </a>
                  )}

                  {/* LINKEDIN */}

                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7f1d2d]/5 text-[#7f1d2d] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0A66C2] hover:text-white"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-[18px] w-[18px]"
                      >
                        <path d="M5.2 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3.5 9h3.4v11.5H3.5zM9 9h3.3v1.6h.1A3.7 3.7 0 0 1 15.8 8.8c3.5 0 4.2 2.3 4.2 5.2v6.5h-3.4v-5.8c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.9H9z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* FOOTER */}

      <div className="mt-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
          Together We Make ROYS Better
        </p>
      </div>
    </section>
  );
}
