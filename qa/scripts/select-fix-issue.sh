#!/usr/bin/env bash
# Select one eligible agent-hunt issue number for the fix workflow.
# Prints the issue number to stdout, or empty if none.
set -euo pipefail

json="$(gh issue list \
  --state open \
  --label agent-hunt \
  --label bug \
  --limit 50 \
  --json number,title,labels,assignees)"

if [[ -z "$json" || "$json" == "[]" ]]; then
  exit 0
fi

# Drop needs-human and human-assigned issues (Copilot assignees OK).
# Prefer blocker > major > minor > other; oldest number within band.
number="$(echo "$json" | jq -r '
  [.[]
    | select(([.labels[].name] | index("needs-human")) | not)
    | select(all(.assignees[]; .login | test("(?i)copilot")))
  ]
  | if length == 0 then empty else
      sort_by(
        (if any(.labels[].name; . == "severity:blocker") then 0
         elif any(.labels[].name; . == "severity:major") then 1
         elif any(.labels[].name; . == "severity:minor") then 2
         else 3 end),
        .number
      )[0].number
    end
')"

if [[ -z "${number}" || "${number}" == "null" ]]; then
  exit 0
fi

closes_count="$(gh pr list --state open --search "Closes #${number} in:body" --json number --jq 'length')"
fixes_count="$(gh pr list --state open --search "Fixes #${number} in:body" --json number --jq 'length')"
if [[ "${closes_count}" != "0" || "${fixes_count}" != "0" ]]; then
  exit 0
fi

echo "$number"
