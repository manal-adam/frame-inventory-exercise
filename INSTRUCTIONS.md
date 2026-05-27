# Frame Inventory — Exercise Instructions

## 1. Scenario

In the **out-of-home (OOH) media** industry, advertisers buy time on physical
display surfaces such as roadside billboards, transport platforms, mall
screens, and bus shelters. Each surface is referred to as a **frame**, and an
operator's catalogue of frames — including their location, size, format,
status, and commercial attributes — is collectively known as the **frame
inventory**. Keeping that inventory accurate matters: every downstream process
(planning, pricing, booking, reporting) depends on it.

For this exercise the candidate will build a small but realistic service for
managing OOH frame inventory. Scoping is part of the exercise: the candidate
is not expected to deliver every feature one could imagine, but to pick a
meaningful subset and deliver it well.

## 2. What we provide

This repository is the starting point. It is intentionally minimal so the
candidate can make their own architectural choices, but it includes enough
infrastructure to skip the boilerplate and start delivering business value
straight away.

| Path                  | Contents                                                                          |
| --------------------- | --------------------------------------------------------------------------------- |
| `src/backend/`        | Bare Spring Boot 3.5 + Java 21 module (Gradle). Exposes only `/api/health`.       |
| `src/frontend/`       | Vite + React 19 + TypeScript module that calls the backend `/api/health` on boot. |
| `docker-compose.yml`  | One-command infra: backend, frontend, MongoDB, MariaDB, OpenSearch + Dashboards.  |
| `data/`               | Extract from the legacy system — `inventory_frame.csv` (~1.3k OOH frame rows).    |
| `design-system/`      | Design system the frontend must be built against — components, tokens, guidance.  |
| `README.md`           | How to run the stack locally, ports, and credentials for the bundled services.    |

> **A note on the suggested infrastructure.** The `docker-compose.yml` file
> is a starting point, not a requirement. The candidate is free to swap any
> of these services for tooling they prefer (a different database, search
> engine, message broker, hosting model, etc.) as long as the final stack
> still runs end-to-end with a single command. If the candidate does choose
> to use the services provided here, they should pick **one** of the two
> datastores for their domain data — either `mongodb` *or* `mariadb-primary`,
> not both — and remove the service they don't need (along with its volume)
> so the stack reflects the design actually built.

In addition, the candidate receives:

- A **provisioned OpenAI Codex API key**. Use of an AI coding assistant is
  explicitly expected — we want to see how the candidate collaborates with a
  model, not whether they can hand-write every line.

## 3. Features

The candidate should deliver the following features:

1. **Add a frame.** A user can create a new frame through the application and
   see it persisted in the inventory.
2. **Edit a frame.** A user can amend an existing frame's attributes and have
   the changes saved.
3. **Bulk upload frames from a CSV.** A user can upload a CSV through the
   application and have the rows ingested into the inventory. The supplied
   `data/inventory_frame.csv` is the file to validate this feature
   against. This is a user-driven feature of the running app, not a one-off
   bootstrap step.
4. **View a frame's history.** A user can see the audit trail of changes to
   any given frame.

How these features are surfaced, structured, and tested is left to the
candidate's judgement.

## 4. Domain data

The shape of a frame is anchored by the legacy export shipped at
`data/inventory_frame.csv` (~1,300 rows) and by the prototype in
`design-system/`. The candidate is expected to inspect both and design a
domain model they are comfortable defending.

At a high level, each frame in the export carries:

- **Identity** — a frame identifier, plus references to downstream systems
  (Broadsign, pricing, linked frames).
- **Location** — country, region, town, postcode, latitude/longitude,
  address, and distance to the nearest school.
- **Site & position** — the kind of place the frame lives in (station,
  underground, roadside, airport, etc.) and where on that site it sits.
- **Format** — classic vs digital, format code, dimensions / pixels /
  aspect ratio, illumination, number of slots, size grouping.
- **Lifecycle** — created/modified timestamps, status, and a status reason.
- **Commercials** — impact weight, pricing grade, production rate card,
  premium flag.

The legacy column names and groupings are not prescriptive — the candidate
should design the domain model that best fits the features in §3, and
document the assumptions they made along the way.

## 5. Additional Requirements

Install and use the **[Entire CLI](https://entire.io)**. Entire hooks into the
candidate's git workflow and, on every push, captures the Codex agent
sessions that produced the changes and links them to the corresponding
commits as *checkpoints*. The result is a searchable record of how the
solution was actually built: the prompts used, the iterations the candidate
went through, the suggestions they accepted, and — just as important — the
ones they rejected or refined.

This is not about surveillance; it is about giving us a fair signal of
**how** the candidate works with AI tooling. We are far less interested in
whether code came from a human keystroke or a model completion than in
whether the candidate exercised judgement, scoped well, and reviewed the
output critically.

> **Note:** Codex support in Entire is currently in preview. The candidate
> should follow Entire's setup documentation for the latest supported
> workflow.

## 6. Submission

When the candidate is ready, they should share a **public GitHub repository**
containing their solution. The repository must include:

- All source code and anything else required to run the solution.
- A README explaining how to run it, the design decisions taken, and the
  trade-offs made.
- The Entire **checkpoints branch** with the captured Codex sessions linked
  to commits, so we can review the AI collaboration alongside the code.

There is no fixed deadline; we recommend timeboxing the exercise to a few
focused sessions rather than open-ended work. If something blocks progress,
note it in the README rather than over-investing time on it.
