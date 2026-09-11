---
name: create-skill
description: "Create a reusable skill (SKILL.md) from a repeatable workflow or process. Use when: packaging a debugging method, review checklist, implementation pattern, or project-specific operating procedure into a discoverable skill for future agent runs."
---

# Create Skill

## Purpose

Turn a real workflow into a reusable skill that an agent can invoke later. The skill should capture the process, decision points, success checks, and when to use it so others can follow the same method without re-deriving it.

## Outcome

This skill produces a single file at:

- .github/skills/<skill-name>/SKILL.md

or, for user-scoped customizations:

- {{VSCODE_USER_PROMPTS_FOLDER}}/skills/<skill-name>/SKILL.md

## Workflow

### 1. Identify the workflow to package

Look for a repeatable method already being used in the conversation or project, such as:

- debugging workflow
- code review checklist
- implementation pattern
- migration or modernization approach
- validation or verification flow

If the workflow is not obvious, ask clarifying questions before drafting.

### 2. Extract the process

Write down the step-by-step sequence being followed, in order:

1. Objective or trigger
2. Initial investigation or setup
3. Key decisions and branch conditions
4. Verification or completion checks
5. Output or artifact produced

Prefer concrete, observable actions over vague guidance.

### 3. Capture decision points

Document where the flow branches, such as:

- when to stop and ask for clarification
- when to choose one path over another
- when to escalate, verify, or validate
- when a task is considered complete versus incomplete

A strong skill includes the logic that tells an agent what to do next.

### 4. Define quality criteria

Every skill should include completion checks, for example:

- the task outcome is explicit
- the method is scoped and actionable
- the steps are ordered and complete
- the criteria for success are measurable
- the skill is narrow enough to be useful repeatedly

If a step cannot be verified, it should be rewritten more concretely.

### 5. Draft the SKILL.md

Use the standard skill structure:

- YAML frontmatter with `name` and `description`
- a short purpose statement
- a clear workflow section
- explicit decision logic and branching
- quality bar or completion checklist
- relevant examples or prompts

Keep the skill practical and compact. It should help an agent perform the workflow, not describe the entire project history.

### 6. Review and refine

Before finalizing, check:

- Is the skill discoverable by its description?
- Is the workflow specific enough to repeat?
- Are the branching decisions explicit?
- Are the completion checks realistic?
- Does the skill solve a recurring problem rather than a one-off task?

### 7. Save and summarize

Once the draft is ready:

1. Save it to the correct skill folder
2. Summarize what the skill produces
3. Suggest example prompts to try it
4. Propose related customizations or next skills to create

## Decision guide

Use a skill when the workflow is:

- multi-step
- reusable across tasks
- tied to a clear trigger or objective
- meant for a future agent or team member

Use a prompt instead when the task is a single focused action with minimal workflow depth.

Use an instruction file when the guidance is always-on and broadly applies to all work in a project.

## Quality bar

A good skill is:

- actionable
- specific
- repeatable
- scoped to one purpose
- easy to discover from its `description`
- complete enough to be executed without extra assumptions

## Example prompt patterns

- "Turn this debugging workflow into a reusable skill"
- "Package our review checklist as a SKILL.md for future agent runs"
- "Create a skill for our implementation workflow and include completion checks"
- "Generalize this migration process into a reusable skill with branching logic"

## Related customizations to consider next

- `.github/instructions/*.instructions.md` for broad project-wide guidance
- `.github/prompts/*.prompt.md` for single focused tasks
- `.github/agents/*.agent.md` for specialized multi-stage workflows
- `.github/hooks/*.json` for deterministic lifecycle enforcement
