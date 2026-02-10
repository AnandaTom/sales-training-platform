# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- SOPs written in Markdown, live in `directives/`
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**
- This is you. Your job: intelligent routing.
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings

**Layer 3: Execution (Doing the work)**
- For this project: the Next.js app in `src/` IS the execution layer
- API routes handle AI calls, data operations, authentication
- Environment variables and API keys stored in `.env.local`
- Reliable, testable, typed with TypeScript

**Why this works:** if you do everything yourself, errors compound. 90% accuracy per step = 59% success over 5 steps. Push complexity into deterministic code.

## Project: Sales Training Platform

This is a **Next.js 15 web application** deployed on Vercel. It simulates sales conversations with AI-powered buyer personas and generates coaching debriefs.

### Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript)
- **AI**: Vercel AI SDK v6 + OpenAI GPT-4o
- **UI**: shadcn/ui + Tailwind CSS v4
- **Auth**: NextAuth v5 (Credentials provider)
- **Data**: JSON files (dev) / Vercel KV (prod)
- **Deploy**: Vercel

### Key Architecture Decisions
- `useChat` from `@ai-sdk/react` with `DefaultChatTransport` for streaming chat
- `sendMessage({ text })` API (not the old `handleSubmit`/`input` pattern)
- `convertToModelMessages()` is async in AI SDK v6 - must be awaited
- Middleware runs in Edge Runtime - cannot import Node.js modules (fs, path)
- System prompts assembled in 4 layers: base + persona + scenario + knowledge base

### Critical Files
1. `src/lib/prompts/prompt-builder.ts` - System prompt assembly (quality depends on this)
2. `src/app/api/chat/route.ts` - Streaming chat API (uses convertToModelMessages + streamText)
3. `src/components/chat/chat-interface.tsx` - Main chat UI (useChat + DefaultChatTransport)
4. `src/app/api/debrief/route.ts` - Coaching analysis generation
5. `src/lib/db.ts` - Data abstraction (JSON files, swap to Vercel KV for prod)

## Operating Principles

**1. Check existing code first**
Before creating new files, check if similar functionality exists. Reuse patterns from existing components.

**2. Self-anneal when things break**
- Read error message and stack trace
- Fix the code and test again (check with user before using paid API credits)
- Update directives with what you learned
- Example: AI SDK v6 changed `toDataStreamResponse()` to `toUIMessageStreamResponse()` - document this.

**3. Update directives as you learn**
Directives are living documents. When you discover API constraints, breaking changes, or better approaches - update the directive.

## File Organization

**Directory structure:**
- `src/app/` - Next.js pages and API routes
- `src/components/` - React components (ui/, chat/, scenarios/, debrief/, dashboard/, layout/)
- `src/lib/` - Utilities, types, data, prompts
- `src/lib/data/` - JSON seed data (personas, scenarios, KB, sessions)
- `src/lib/prompts/` - AI system prompt templates
- `directives/` - SOPs in Markdown
- `.env.local` - Environment variables (OPENAI_API_KEY, AUTH_SECRET)

**Demo accounts:**
- Admin: mathieu@demo.com / demo123
- User: demo@demo.com / demo123

## Self-annealing loop

Errors are learning opportunities. When something breaks:
1. Fix it
2. Update the tool/component
3. Test (`npm run build` must pass)
4. Update directive to include new flow
5. System is now stronger

## Summary

You sit between human intent (directives) and deterministic execution (Next.js app code). Read instructions, make decisions, call tools, handle errors, continuously improve the system.

Be pragmatic. Be reliable. Self-anneal.
