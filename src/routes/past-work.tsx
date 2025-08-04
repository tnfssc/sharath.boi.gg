import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { ScreenCenter } from "~/components/ui/screen-center";
import { ScrollArea } from "~/components/ui/scroll-area";

function Bullet({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}

function Item({
  children,
  href,
  period,
  subtitle,
  tech,
  title,
}: {
  children?: React.ReactNode;
  href?: string;
  period?: string;
  subtitle?: string;
  tech?: Array<string>;
  title: string;
}) {
  return (
    <Card className="group border-border/70 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="bg-primary/10 absolute -top-24 -left-24 h-48 w-48 rounded-full blur-3xl" />
        <div className="bg-secondary/10 absolute -right-24 -bottom-24 h-48 w-48 rounded-full blur-3xl" />
      </div>

      <CardContent className="relative px-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="flex items-center gap-2">
            {href ? (
              <a
                className="inline-flex items-center gap-1 text-base font-semibold underline-offset-4 hover:underline"
                href={href}
                rel="noreferrer"
                target="_blank"
              >
                <span>{title}</span>
                <ArrowUpRight aria-hidden className="text-muted-foreground h-3.5 w-3.5" />
              </a>
            ) : (
              <div className="text-base font-semibold">{title}</div>
            )}
            {subtitle ? <span className="text-muted-foreground">· {subtitle}</span> : null}
          </div>
          {period ? <div className="text-muted-foreground text-xs font-medium sm:text-sm">{period}</div> : null}
        </div>

        {children && <div className="mt-3 space-y-2">{children}</div>}

        {!!tech?.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tech.map((t) => (
              <Badge className="text-xs" key={t} variant="neutral">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="mx-auto mt-8 w-full max-w-3xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <div className="via-border mt-2 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export const Route = createFileRoute("/past-work")({ component: RouteComponent });

function RouteComponent() {
  return (
    <ScreenCenter>
      <ScrollArea className="flex w-full flex-col gap-12">
        <div className="p-4">
          <header className="relative mx-auto w-full max-w-3xl pb-4">
            <div
              aria-hidden
              className="bg-primary/10 pointer-events-none absolute -top-8 left-1/2 h-24 w-[40rem] -translate-x-1/2 rounded-full blur-3xl"
            />
            <h1 className="text-2xl font-bold tracking-tight">Past Work</h1>
            <div className="via-border mt-4 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
          </header>

          <Section title="Work Experience">
            <Item
              href="https://www.veritus.ai/"
              period="Aug 2024 — July 2024"
              subtitle="Senior Software Development Engineer"
              title="Veritus"
            >
              <ul className="list-disc pl-5">
                <Bullet>
                  Literature Review tool backed by custom ElasticSearch over 220M records; achieved ~3x more relevant
                  results vs Google Scholar using similarity search.
                </Bullet>
                <Bullet>
                  Hosted custom AI models on AWS (Lambda/ECR) via Docker & Python; up to 100x cheaper than external
                  model APIs.
                </Bullet>
                <Bullet>
                  Payments: one-time & recurring with Stripe; credit usage and subscriptions with webhooks.
                </Bullet>
                <Bullet>
                  Manuscript Review with AI suggestions and feedback; streamlines ~90% of review workflow.
                </Bullet>
                <Bullet>PDF Q&A with embeddings and SSE.</Bullet>
                <Bullet>
                  Team productivity: 2x by integrating TS, ESLint, Sentry, CI and observability across workflow.
                </Bullet>
                <Bullet>
                  Rearchitected from multi-repo MERN JS to monorepo TypeScript with tRPC & Next.js; end-to-end
                  type-safety.
                </Bullet>
              </ul>
              <div className="sr-only">
                Technologies: ElasticSearch, Bun, Python, Docker, AWS Lambda, ECR, GitHub Actions, Stripe, NextJS,
                LangChain, Pinecone, Cohere, SSE, TypeScript, ESLint, Sentry, Vercel, LangFuse, NodeJS, EC2, tRPC,
                Mongoose, Tailwind, Redis.
              </div>
            </Item>

            <Item
              href="https://www.saaslabs.co/"
              period="Jun 2022 — Aug 2024"
              subtitle="Software Development Engineer (SDE II)"
              title="SaaS Labs"
            >
              <ul className="list-disc pl-5">
                <Bullet>
                  Apex: spearheaded rewrite from PHP single-server to modern stack (NestJS, Remix, TS, Docker, K8s).
                </Bullet>
                <Bullet>Search: full-text engine across product family; −30% support load, notably improved UX.</Bullet>
                <Bullet>JustCall iQ migration: extracted from monolith, PHP 5 → 8, moved to Kubernetes.</Bullet>
                <Bullet>AI Notetaker bot: joins meetings, records, generates highlights and summaries.</Bullet>
              </ul>
              <div className="sr-only">
                Technologies: React, Remix, NestJS, TypeScript, TailwindCSS, Vite, Vitest, Docker, Jenkins, SonarQube,
                MySQL, Microfrontends, Algolia, Cheerio, Puppeteer, OpenAI, PHP, Kubernetes, Whisper, FFmpeg, Redis,
                Bun, Distributed systems.
              </div>
            </Item>

            <Item
              href="https://storyxpress.co/"
              period="Jul 2020 — Sep 2020"
              subtitle="Full-Stack Developer Intern"
              title="StoryXpress"
            >
              <ul className="list-disc pl-5">
                <Bullet>
                  Built internal dashboard and Google-Drive-like feature in a team setting; learned conflict resolution.
                </Bullet>
              </ul>
              <div className="sr-only">Technologies: React, Webpack, NodeJS, ExpressJS.</div>
            </Item>
          </Section>

          <Section title="Open Source">
            <Item
              href="https://github.com/langchain-ai/langchainjs/pull/5637"
              subtitle="Contributor"
              title="LangChain.js"
            />
            <Item href="https://github.com/facebook/react/pull/30123" subtitle="Contributor" title="React" />
            <Item href="https://github.com/ReactiveX/rxjs/pull/7487" subtitle="Contributor" title="RxJS" />
            <Item href="https://github.com/microsoft/fluentui/pull/31854" subtitle="Contributor" title="FluentUI" />
          </Section>

          <Section title="Freelance">
            <Item
              href="https://htos-demo.sharath.uk/"
              period="Apr 2022 — Jul 2022"
              subtitle="Lead Developer"
              tech={["Blitz.js", "TypeScript", "PostgreSQL", "NextAuth", "Prisma"]}
              title="htOS"
            >
              <ul className="list-disc pl-5">
                <Bullet>
                  Hostel room management system for IIT Hyderabad; E2E type-safe, built for long-term maintenance.
                </Bullet>
              </ul>
            </Item>

            <Item
              href="https://c19-react.pages.dev/"
              period="Sep 2021 — Dec 2021"
              subtitle="DevOps Engineer"
              tech={["NodeJS", "CDN", "Cloudflare", "GitHub Actions", "Docker", "PostgreSQL"]}
              title="covid19tracker"
            >
              <ul className="list-disc pl-5">
                <Bullet>Scaled to peak 3 TB traffic/month. Led end-to-end.</Bullet>
              </ul>
            </Item>

            <Item
              href="https://ocs.iith.ac.in/"
              period="Feb 2020 — Apr 2021"
              subtitle="Web Developer"
              tech={["React", "JavaScript", "NodeJS", "Express", "MySQL"]}
              title="Office of Career Services, IIT Hyderabad"
            >
              <ul className="list-disc pl-5">
                <Bullet>
                  Built frontend of IITH's placement platform; reduced friction for companies, staff, and students.
                </Bullet>
              </ul>
            </Item>
          </Section>

          <Section title="Personal Projects">
            <div className="grid gap-4 sm:grid-cols-2">
              <Item
                href="https://github.com/tnfssc/gai"
                tech={["Go", "LangChain", "OpenAI", "GitHub Actions", "Docker", "bash", "pwsh"]}
                title="gai — The fastest AI command generator"
              />
              <Item href="https://www.sca.run" tech={["Astro", "Remark", "TypeScript"]} title="sca.run — Blog" />
              <Item
                href="https://www.sharath.uk/self-hosted"
                tech={["Docker Swarm", "Cloudflare Tunnel", "OCI", "GlusterFS", "SOPS", "Linux"]}
                title="Self-hosted — VPS cluster"
              />
              <Item
                href="https://github.com/tnfssc/maaybe"
                tech={["TypeScript", "GitHub Actions", "NPM", "Jest"]}
                title="maaybe — TypeScript maybe library"
              />
              <Item
                href="https://terminova.dev"
                tech={["Rust", "TypeScript", "Tauri", "Wails", "Go", "OpenAI"]}
                title="Terminova (defunct)"
              />
              <Item
                href="https://t3p.tnfssc.vercel.app/"
                tech={["React", "TypeScript", "TailwindCSS", "Vercel"]}
                title="Tic Tac Toe Pro"
              />
              <Item
                href="https://sharath.uk/"
                tech={["Vite", "TypeScript", "UnoCSS", "React", "Firebase", "Turso", "Drizzle"]}
                title="sharath.uk — Personal site"
              />
              <Item
                href="https://neko.sharath.uk/"
                tech={["LangChain", "Deno", "HTML"]}
                title="neko — Non-sense generator"
              />
              <Item
                href="https://blog.sharath.uk/blog/dxup-announcement/"
                tech={["Tauri", "Linux", "GitHub Actions", "React", "React Query"]}
                title="dxup (deprecated)"
              />
              <Item
                href="https://www.sharath.uk/shortener"
                tech={["Turso", "Cloudflare Workers", "Drizzle"]}
                title="URL shortener"
              />
              <Item href="#" tech={["Cloudflare Workers", "Cloudflare R2"]} title="Upload to CDN" />
              <Item
                href="https://github.com/tnfssc/code-server"
                tech={["Docker", "asdf", "GitHub Actions"]}
                title="Code server — Dev container"
              />
            </div>
          </Section>

          <Section title="Education">
            <Item
              href="https://www.iith.ac.in/"
              period="Aug 2018 — May 2022"
              subtitle="Bachelor of Technology in Engineering Science"
              title="Indian Institute of Technology, Hyderabad"
            >
              <p className="text-muted-foreground text-sm">
                Coursework: Software Engineering, Computer Networking, Operating Systems, Drones, Digital Logic Design,
                IoT and more.
              </p>
            </Item>
          </Section>
        </div>
        <div className="p-24" />
      </ScrollArea>
    </ScreenCenter>
  );
}
