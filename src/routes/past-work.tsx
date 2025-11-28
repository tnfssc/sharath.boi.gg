import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { MarkdownPreview } from "~/components/blog/preview";
import { ScreenCenter } from "~/components/ui/screen-center";
import { mdToHtml } from "~/lib/services/md-to-html";

const fallbackHtml = `<h1><a href="https://sharath.boi.gg" rel="nofollow">Sharath</a></h1>
<blockquote>
<p>Building next-gen software to make AI more accessible</p>
<p>Python, TypeScript, Agents, MCP, Docker, React</p>
<p>Writer | Kortix | Veritus | SaaS Labs | IIT Hyderabad</p>
</blockquote>
<p><a href="https://sharath.boi.gg/" rel="nofollow"><img src="https://img.shields.io/badge/website-boi.gg-red?style=for-the-badge" alt="boi.gg" referrerpolicy="no-referrer" class="w-full rounded-xl"></a>
<a href="https://sharath.boi.gg/blog/" rel="nofollow"><img src="https://img.shields.io/badge/blog-boi.gg%2Fblog-green?style=for-the-badge" alt="boi.gg/blog" referrerpolicy="no-referrer" class="w-full rounded-xl"></a>
<a href="https://sharath.uk/" rel="nofollow"><img src="https://img.shields.io/badge/void-sharath.uk-blue?style=for-the-badge" alt="sharath.uk" referrerpolicy="no-referrer" class="w-full rounded-xl"></a></p>
<p><a href="https://www.linkedin.com/in/tnfssc/" rel="nofollow"><img src="https://img.shields.io/badge/LinkedIn-black?style=flat&#x26;color=black&#x26;logo=data:image/svg%2bxml;base64,PHN2ZyByb2xlPSJpbWciIGZpbGw9IiNmZmZmZmYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+TGlua2VkSW48L3RpdGxlPjxwYXRoIGQ9Ik0yMC40NDcgMjAuNDUyaC0zLjU1NHYtNS41NjljMC0xLjMyOC0uMDI3LTMuMDM3LTEuODUyLTMuMDM3LTEuODUzIDAtMi4xMzYgMS40NDUtMi4xMzYgMi45Mzl2NS42NjdIOS4zNTFWOWgzLjQxNHYxLjU2MWguMDQ2Yy40NzctLjkgMS42MzctMS44NSAzLjM3LTEuODUgMy42MDEgMCA0LjI2NyAyLjM3IDQuMjY3IDUuNDU1djYuMjg2ek01LjMzNyA3LjQzM2MtMS4xNDQgMC0yLjA2My0uOTI2LTIuMDYzLTIuMDY1IDAtMS4xMzguOTItMi4wNjMgMi4wNjMtMi4wNjMgMS4xNCAwIDIuMDY0LjkyNSAyLjA2NCAyLjA2MyAwIDEuMTM5LS45MjUgMi4wNjUtMi4wNjQgMi4wNjV6bTEuNzgyIDEzLjAxOUgzLjU1NVY5aDMuNTY0djExLjQ1MnpNMjIuMjI1IDBIMS43NzFDLjc5MiAwIDAgLjc3NCAwIDEuNzI5djIwLjU0MkMwIDIzLjIyNy43OTIgMjQgMS43NzEgMjRoMjAuNDUxQzIzLjIgMjQgMjQgMjMuMjI3IDI0IDIyLjI3MVYxLjcyOUMyNCAuNzc0IDIzLjIgMCAyMi4yMjIgMGguMDAzeiIvPjwvc3ZnPgo=" alt="LinkedIn" referrerpolicy="no-referrer" class="w-full rounded-xl"></a>
<a href="https://github.com/tnfssc" rel="nofollow"><img src="https://img.shields.io/badge/GitHub-black?style=flat&#x26;logo=github&#x26;color=black" alt="GitHub" referrerpolicy="no-referrer" class="w-full rounded-xl"></a>
<a href="https://twitter.com/tnfssc" rel="nofollow"><img src="https://img.shields.io/badge/Twitter-black?style=flat&#x26;logo=x&#x26;color=black" alt="Twitter" referrerpolicy="no-referrer" class="w-full rounded-xl"></a>
<a href="https://www.youtube.com/@tnfssc" rel="nofollow"><img src="https://img.shields.io/badge/YouTube-black?style=flat&#x26;logo=youtube&#x26;color=black" alt="YouTube" referrerpolicy="no-referrer" class="w-full rounded-xl"></a></p>
<hr>
<p>Open source contributions</p>
<p><a href="https://github.com/kortix-ai/suna/pulls?q=is%3Apr+author%3Atnfssc+is%3Aclosed" rel="nofollow"><img src="https://img.shields.io/github/stars/kortix-ai/suna?style=for-the-badge&#x26;logo=kortix&#x26;label=%D0%96%20%20Suna&#x26;color=black" alt="Kortix Suna" referrerpolicy="no-referrer" class="w-full rounded-xl"></a>
<a href="https://github.com/langchain-ai/langchainjs/pull/5637" rel="nofollow"><img src="https://img.shields.io/github/stars/langchain-ai/langchainjs?style=for-the-badge&#x26;logo=langchain&#x26;label=LangChain&#x26;color=f5f5f5" alt="LangChain" referrerpolicy="no-referrer" class="w-full rounded-xl"></a>
<a href="https://github.com/facebook/react/pull/30123" rel="nofollow"><img src="https://img.shields.io/github/stars/facebook/react?style=for-the-badge&#x26;logo=react&#x26;label=React&#x26;color=5dabc0" alt="React" referrerpolicy="no-referrer" class="w-full rounded-xl"></a>
<a href="https://github.com/kortix-ai/resumable-stream-python" rel="nofollow"><img src="https://img.shields.io/github/stars/kortix-ai/resumable-stream-python?style=for-the-badge&#x26;logo=kortix&#x26;label=Resumable%20Stream%20Python&#x26;color=pink" alt="Resumable Stream" referrerpolicy="no-referrer" class="w-full rounded-xl"></a></p>
<hr>
<h2>Employment</h2>
<h3><a href="https://www.veritus.ai/" rel="nofollow">Veritus</a> (Aug 2024 - Jul 2025)</h3>
<p><strong>Senior Software Development Engineer</strong> | Spearheaded all software development at Veritus</p>
<ul>
<li><strong>Literature Review</strong> | Backed by Elasticsearch with 220M+ records, 3TB+ data. 3x more relevant results than Google Scholar | <em>Elasticsearch, Bun, Python</em></li>
<li><strong>Custom AI models</strong> | Hosted on AWS using Docker and Python. Up to 100x cheaper than Cohere | <em>Docker, Python, AWS Lambda, ECR, GitHub Actions</em></li>
<li><strong>Payment system</strong> | Architected and developed one-time and recurring payment systems. Counting credit usage, recharges, subscriptions | <em>Stripe, Webhooks, NextJS</em></li>
<li><strong>Manuscript Review</strong> | AI-powered paper review tool. Simplifies 90% of a research paper's review process | <em>LangChain, Elasticsearch, Scraping, Markdown, Doc parsing</em></li>
<li><strong>PDF Chat</strong> | Chatbot that can answer questions about an uploaded PDF | <em>Pinecone, Cohere, LangChain, Web streams</em></li>
<li><strong>DX upgrades</strong> | Got 2x productivity gains by integrating various tools into dev cycle | <em>TypeScript, ESLint, Sentry, CI/CD, Vercel, Docker, Langfuse, NodeJS, EC2</em></li>
<li><strong>Rearchitecture</strong> | Full migration from multi-repo MERN stack with JS to a monorepo with tRPC, NextJS and TypeScript with end-to-end type safety | <em>NextJS, tRPC, Mongoose, Tailwind, Redis</em></li>
</ul>
<h3><a href="https://www.saaslabs.co/" rel="nofollow">SaaS Labs</a> (Jun 2022 - Aug 2024)</h3>
<p><strong>Software Development Engineer (SDEII)</strong> | Played key roles for various frontend, backend and full-stack projects and features.</p>
<ul>
<li><strong>Apex</strong> | Initiated rewrite of the JustCall codebase, setting up the base, tools and practices, moving away from PHP stack | <em>React, Remix, NestJS, TypeScript, Tailwind, Vitest, Docker</em></li>
<li><strong>Search</strong> | Built full-text search for JustCall product family with custom scrape, build and deploy pipelines | <em>Microfrontend, React, Vite, Shadow DOM, Algolia, Cheerio, Docker, Jenkins</em></li>
<li><strong>AI Notetaker</strong> | Built a bot that joins meetings, records and generates highlights | <em>Puppeteer, NodeJS, Docker, Kubernetes, FFmpeg, Redis, Bun</em></li>
</ul>
<hr>
<h2>Freelance</h2>
<h3><a href="https://writer.com/" rel="nofollow">Writer</a> (Aug 2025 - now)</h3>
<p><strong>Contract Software Engineer, Fullstack</strong> | Integrated in-house Connectors MCP to agent. Migrated to AlloyDB. Integrated browser tools. Developed Presentation skill. Many other fixes and minor features.</p>
<ul>
<li>TypeScript, Python, Docker, Postgres, MCP</li>
</ul>
<h3><a href="https://kortix.ai/" rel="nofollow">Kortix AI</a> (May 2025 - Aug 2025)</h3>
<p><strong>Software Engineer</strong> | Made the application stable and scalable. Built the Kortix AI SDK for Python. Set up full CI/CD on Hetzner. Migrated everything to AWS. Added a lot more <a href="https://github.com/kortix-ai/suna/pulls?q=is%3Apr+author%3Atnfssc+sort%3Aupdated-desc" rel="nofollow">features and fixes</a>.</p>
<ul>
<li>Python, TypeScript, Docker, Daytona, Supabase, Swarm, AWS, Pulumi, GitHub Actions, Redis, Stripe, AI Agents</li>
</ul>
<h3><a href="https://htos-demo.sharath.uk/" rel="nofollow">htOS</a> (Apr 2022 - Jul 2022)</h3>
<p><strong>Lead Developer</strong> | Built Hostel room management system for IIT Hyderabad | E2E type-safe codebase, designed for long term maintenance.</p>
<ul>
<li>Blitz.js, TypeScript, PostgreSQL, NextAuth, Prisma</li>
</ul>
<h3><a href="https://c19-react.pages.dev/" rel="nofollow">covid19tracker</a> (Sep 2021 - Dec 2021)</h3>
<p><strong>Deployment Engineer</strong> | Scaled to a peak of 3 TB traffic per month. Spearheaded the project development from initiation to deployment.</p>
<ul>
<li>NodeJS, CDN, Cloudflare, GitHub Actions, Docker, PostgreSQL</li>
</ul>
<h3><a href="https://storyxpress.co/" rel="nofollow">StoryXpress</a> (Jul 2020 - Sep 2020)</h3>
<p><strong>Full-Stack Developer Intern</strong> | Learnt to resolve merge conflicts and working with a team. Built internal dashboard and a Google Drive like feature.</p>
<ul>
<li>React, Webpack, NodeJS, ExpressJS</li>
</ul>
<h3><a href="https://ocs.iith.ac.in/" rel="nofollow">Office of Career Services</a> (Feb 2020 - Apr 2021)</h3>
<p><strong>Web Developer</strong> | Built Frontend of IITH's placement platform. Moving from paper-based to digital, this platform reduced friction for companies, placement staff and the students by a large margin.</p>
<ul>
<li>React, JavaScript, NodeJS, Express, MySQL</li>
</ul>
<hr>
<h2>Projects</h2>
<ul>
<li>
<p><strong><a href="https://zevium.dev" rel="nofollow">zevium</a></strong> | Open marketplace for random APIs | Cloudflare Workers, TanStack Start, tRPC, MCP, SQLite, mise</p>
</li>
<li>
<p><strong><a href="https://github.com/kortix-ai/resumable-stream-python" rel="nofollow">resumable-stream-python</a></strong> | Stream resumption for web streams in Python | Python, Redis, PyTest, uv, GitHub Actions, Web streams</p>
</li>
<li>
<p><strong><a href="https://boi.gg" rel="nofollow">sharath.boi.gg</a></strong> | my website, definitive edition | Tanstack Start, TypeScript, Tailwind, Cloudflare Workers, mise</p>
</li>
</ul>
<details>
  <summary>Desktop apps, games, clusters, libraries, AI and more [click to expand]</summary>
<ul>
<li>
<p><strong><a href="https://github.com/tnfssc/gai" rel="nofollow">gai</a></strong> | The fastest ⚡ AI command generator</p>
<ul>
<li>Go, LangChain, OpenAI, GitHub Actions, Docker, bash, pwsh</li>
</ul>
</li>
<li>
<p><strong><a href="https://github.com/boi-gg/exception" rel="nofollow">@boi.gg/exception</a></strong> | A tiny, typed and modular exception-handling library for TypeScript.</p>
<ul>
<li>tsdown, GitHub Actions, NPM, Vitest</li>
</ul>
</li>
<li>
<p><strong><a href="https://github.com/boi-gg/eslint-plugin-prefer-array-at" rel="nofollow">@boi.gg/eslint-plugin-prefer-array-at</a></strong> | ESLint plugin to prefer <code>Array.prototype.at()</code> over traditional bracket indexing.</p>
<ul>
<li>tsdown, GitHub Actions, NPM, Vitest</li>
</ul>
</li>
<li>
<p><strong><a href="https://github.com/tnfssc/maaybe" rel="nofollow">maaybe</a></strong> | A library that introduces the concept of "maybe" to TypeScript</p>
<ul>
<li>TypeScript, GitHub Actions, NPM, Jest</li>
</ul>
</li>
<li>
<p><strong><a href="https://www.sharath.uk/self-hosted" rel="nofollow">Self-hosted</a></strong> | Self-hosted services running on a VPS cluster</p>
<ul>
<li>Docker Swarm, Cloudflare Tunnel, Oracle Cloud Infrastructure, GlusterFS, SOPS, Linux</li>
</ul>
</li>
<li>
<p><strong><a href="https://terminova.dev" rel="nofollow">Terminova (defunct)</a></strong> | Predictive autocomplete in a terminal app. Discontinued due to advanced competition.</p>
<ul>
<li>Rust, TypeScript, Tauri, Wails, Go, OpenAI</li>
</ul>
</li>
<li>
<p><strong><a href="https://t3p.tnfssc.vercel.app/" rel="nofollow">Tic Tac Toe Pro</a></strong> | Reimagined Tic Tac Toe with overrides, 8 players, and a massive board.</p>
<ul>
<li>React, TypeScript, Tailwind, Vercel</li>
</ul>
</li>
<li>
<p><strong><a href="https://sharath.uk/" rel="nofollow">sharath.uk</a></strong> | More than a personal website</p>
<ul>
<li>Vite, TypeScript, UnoCSS, React, Firebase, Turso, Drizzle</li>
</ul>
</li>
<li>
<p><strong><a href="https://neko.sharath.uk/" rel="nofollow">neko</a></strong> | Non-sense generator. HTML streaming and slow page layout rendering.</p>
<ul>
<li>LangChain, Deno, HTML</li>
</ul>
</li>
<li>
<p><strong><a href="https://blog.sharath.uk/blog/dxup-announcement/" rel="nofollow">dxup (deprecated)</a></strong> | A tools management desktop app</p>
<ul>
<li>Tauri, Linux, GitHub Actions, React, React Query</li>
</ul>
</li>
<li>
<p><strong><a href="https://www.sharath.uk/shortener" rel="nofollow">URL shortener</a></strong> | Shorten long URLs</p>
<ul>
<li>Turso, Cloudflare Workers, Drizzle</li>
</ul>
</li>
<li>
<p><strong>Upload to CDN</strong> | Upload files to a CDN and get a link</p>
<ul>
<li>Cloudflare Workers, Cloudflare R2</li>
</ul>
</li>
<li>
<p><strong><a href="https://github.com/tnfssc/code-server" rel="nofollow">Code server</a></strong> | Docker image for VS Code and development tools</p>
<ul>
<li>Docker, asdf, GitHub Actions</li>
</ul>
</li>
</ul>
</details>
<hr>
<h2>Education</h2>
<h3><a href="https://www.iith.ac.in/" rel="nofollow">Indian Institute of Technology, Hyderabad</a> (Aug 2018 - May 2022)</h3>
<p><strong>Bachelor of Technology in Engineering Science</strong> | Software Engineering, Computer Networking, Operating Systems, Drones, Digital Logic Design, IoT and more</p>
`;

const getData = createServerFn().handler(async () => {
  return await fetch("https://raw.githubusercontent.com/tnfssc/tnfssc/refs/heads/main/RESUME.md")
    .then((res) => res.text())
    .then(mdToHtml)
    .catch(() => ({ frontmatter: {}, html: fallbackHtml }));
});

export const Route = createFileRoute("/past-work")({
  component: RouteComponent,
  loader: () => getData(),
});

function RouteComponent() {
  const content = Route.useLoaderData();
  return (
    <ScreenCenter>
      <MarkdownPreview html={content.html} />
    </ScreenCenter>
  );
}
