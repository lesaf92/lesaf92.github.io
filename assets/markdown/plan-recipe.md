# Recipe: build a project plan of main quests, side quests and candidates

You are an agent working in a git repository. Build (or bring up to date) one plan file. It must show where the project is going, what each finished step was, where to verify it, which documentation it produced, and which ideas are still waiting for the owner's approval. Follow the steps in order. Gather facts before writing anything.

## What the plan must give the owner

1. **One line per objective:** what it aims at, in plain words.
2. **A verifiable reference** for each objective: a pull request link with its merge commit, or a commit hash the owner can check with `git show --stat <commit>`.
3. **Main quests apart from side quests.** Main quests lead to the project's big picture; side quests were tangents.
4. **Documentation links:** for each objective, the documentation created or updated to explain it.
5. **Candidates:** every idea that has not been approved is listed as **Not confirmed**. It stays that way until the owner approves it or asks for it to be worked on.

## Step 1: look for an existing plan

- Search the tracked files for plan, roadmap, todo, goals or milestones in file names (`git ls-files | grep -iE 'plan|roadmap|todo|goal|milestone'`).
- Search the docs for sections such as "Roadmap", "Next steps", "Future work" or "TODO".
- If a plan file exists, update it in place. If only scattered roadmap sections exist, the new plan absorbs them (step 8).
- Tell the owner what you found, even if it is "nothing".

## Step 2: gather the history

- **Bring the main branch up to date first:** `git fetch`. Read `origin/main` (or whatever the default branch is called) rather than a stale local branch.
- **Pull requests:** with the GitHub CLI, `gh pr list --state all --limit 100 --json number,title,headRefName,state,mergedAt,mergeCommit`. Note each one's number, title, state, merge date and the first 7 characters of its merge commit.
- **Commits on the main line:** `git log --first-parent --format='%h %ad %s' --date=short origin/main` shows the merges. `git log --format='%h %ad %s' --date=short origin/main` shows the commits inside them.
- **Unmerged work:** open PRs and pushed branches are objectives in progress.
- **An initial import:** work done before the repository existed has no commits of its own. Reference the import commit and say the work predates the repository.
- **Without `gh`:** merge commits named "Merge pull request #N" still give the PR numbers.

## Step 3: gather the intent

- The big picture comes from the owner's own words. Look in the conversation, in any agent memory files, and in the README's opening.
- Write it as one sentence: who or what, doing what, toward what end.
- In your reply, say that the big-picture line is your reading and ask the owner to correct it. Never invent a goal the owner did not state or clearly imply.

## Step 4: tie documentation to work

- For each documentation file, list the commits that created or changed it: `for f in $(git ls-files docs | grep -E '\.(md|tex)$'); do echo "$f: $(git log --format=%h --reverse -- "$f" | tr '\n' ' ')"; done`
- For each objective's commits, `git show --stat --format= <commit> | grep docs/` gives the docs it touched.
- Link each objective to the docs that explain it, down to the section where possible (`file.md#heading-anchor`). A report, a guide or a section counts. A one-line mention in an unrelated file does not.

## Step 5: gather the open ideas (the candidates)

Collect every unresolved idea, from:

- sections titled "Open issues", "Limitations", "Limits", "Next steps", "Future work", "Alternatives not tried" or "What the data allows next", in reports and guides;
- the old roadmap lists;
- the plans' and reports' own "to do" items that have not been done (check against the history: an item a later PR resolved is not a candidate);
- unanswered questions put to the owner ("which bearing is the real one?");
- follow-ups an agent offered in a past session, and problems found and worked around rather than fixed. Agent memory files and PR test plans are good sources;
- any proposal blocked by a project rule (for example a rename the rules say must be proposed, not made).

Merge duplicates that come from several reports into one candidate, and link every source. If an item is partly addressed by later work, say which part is left.

## Step 6: classify

- **Main quest:** an objective whose result the big picture needs. Removing it would leave a gap on the way to the goal.
- **Side quest:** a tangent, such as tooling, infrastructure, viewers, CI, teaching material, or a study on unrelated data. It may still feed a main quest; if so, say which in one line under the side-quest table.
- **Sub-objectives:** when an objective was done in clearly separate steps (several commits in one PR, or several studies under one aim), give each step its own row: M2.1, M2.2...
- **Borderline calls:** list each one in your reply so the owner can move it. Examples are a write-up, which is requested but doesn't build the system, and real-data side studies.
- **Status words:** Done, Partly done (say what is left, and name the candidate that covers it), In progress (an open PR), Open.

## Step 7: write the file

Default path: `docs/plan.md`, or the docs folder the repository already uses. Use this structure:

```markdown
# Plan

<Two short paragraphs: what this file tracks; how to check a commit (git show --stat <commit>); that candidates stay
"Not confirmed" until approved or picked up, and then move up as objectives noting their old number.>

**Big picture:** <one sentence>

**Now:** the last objective finished is <M#> (<name>, [PR #N](<url>), <date>). The next one is <M#/C#, or "not chosen
yet; C# and C# continue it directly">.

## Main quests

Objectives that lead to the big picture, in the order they were done.

| # | Objective | Status | Git | Documentation |
|---|---|---|---|---|
| M1 | <one line> | Done | [PR #1](<url>) → abc1234, 2026-01-31 | [guide](guide.md), [report](reports/x.md) |
| M1.1 | <one step of M1> | Done | abc1234 | [guide: section](guide.md#section) |

## Side quests

<One line on what counts as a tangent here, and which side quests fed a main quest.>

| # | Objective | Status | Git | Documentation |
|---|---|---|---|---|

## Candidates (not confirmed)

Grouped by the objective each one would serve. "Came from" points to where the idea was written down.

| # | Candidate | Serves | Came from | Status |
|---|---|---|---|---|
| | **<group name>** | | | |
| C1 | <one line> | M3, M5 | [report: open 3](reports/x.md#open-issues) | Not confirmed |
```

Writing rules:

- **One line per objective or candidate.** Numbers belong in it only when they make it concrete (for example "2.7 cm ATE"). Details stay in the linked docs.
- **IDs:** M# for main quests, S# for side quests, C# for candidates. Sub-objectives are M#.#. Never renumber an ID that has been published; new items take the next free number.
- **Git column:** link PRs in full (`https://github.com/<owner>/<repo>/pull/N`), then `→ <merge commit>` and the date. Within a PR, steps take bare commit hashes.
- **Links:** documentation links are relative to the plan file. Use section anchors when the doc is long.
- **Order:** main quests in the order they were done. Candidates grouped by the quest they serve; inside a group, the ones that continue the latest work come first.
- **No new ideas of your own** go in as objectives. Anything that was not approved, done or asked for is a candidate.
- **Write for the owner.** No narrative, history or justification; the docs hold those.

## Step 8: fold in the old roadmaps and index the plan

- **Old roadmaps:** replace each roadmap section's list with one line that points to the plan and names the candidates its items became. Keep the heading, so existing links to it still land somewhere.
- **The index:** add the plan to the README's documentation table, at the top, and to any layout listing of the docs folder.
- **Moves and renames:** don't rename or move existing files to do this, unless the owner asked.

## Step 9: check it

Every relative link and anchor must resolve. Run this from the repository root and fix anything it prints, until `bad 0`:

```python
import re
from pathlib import Path
PLAN = Path('docs/plan.md')
def slug(heading):  # GitHub's anchor rule, close enough: lower case, drop punctuation, spaces to hyphens
    return re.sub(r'[^\w\- ]', '', heading.replace('`', '').strip().lower()).replace(' ', '-')
bad = 0
for target in re.findall(r'\]\(([^)]+)\)', PLAN.read_text()):
    if target.startswith('http'):
        continue
    path, _, anchor = target.partition('#')
    f = (PLAN.parent / path).resolve() if path else PLAN.resolve()
    if not f.exists():
        print('missing', target); bad += 1; continue
    if anchor and f.suffix == '.md' and anchor not in {slug(h) for h in re.findall(r'^#+ (.*)$', f.read_text(), re.M)}:
        print('anchor', target); bad += 1
print('bad', bad)
```

Then check every commit hash with `git cat-file -t <hash>`, and every PR number against the list from step 2.

## Step 10: report

Tell the owner, briefly:

- whether a plan existed before, and where;
- the big-picture line, and that it is your reading;
- the current position: the "Now" line;
- how many main quests, side quests and candidates there are, and which candidates continue the latest work;
- each borderline classification and each candidate that waits on the owner's knowledge;
- which files changed.

Do not commit unless the owner asks. Offer it in one line.

## Keeping it up to date (every later session)

- **When an objective finishes:** set its status, add the PR, merge commit, date and the docs it changed, and update the "Now" line.
- **When a new idea comes up:** an open issue found, a limit written in a report, a follow-up you offered. Add it as a candidate with its source, rather than only mentioning it in chat.
- **When the owner approves a candidate or asks for it:** move it to the main or side quests with the next free M/S number, and note "(was C7)". Remove it from the candidates table.
- **When the owner rejects a candidate:** set its status to "Dropped, <date>" instead of deleting it, so the same idea isn't proposed again.
- **When later work resolves a candidate in passing:** mark it "Done in PR #N" and tell the owner.
- **When something changes the big picture:** change the line only when the owner says so.
