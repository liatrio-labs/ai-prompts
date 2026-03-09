# Skill Audit Checklist

Use this checklist when auditing an existing skill.

## Scope and Intent

- [ ] Audit scope is documented
- [ ] Skill purpose is clear and bounded
- [ ] Trigger conditions are explicit
- [ ] Non-goals are documented

## Workflow Quality

- [ ] Workflow is deterministic and ordered
- [ ] Ambiguity handling includes clarification step
- [ ] Inputs and outputs are explicitly defined
- [ ] Output contract is complete

## Safety and Controls

- [ ] Unsafe/destructive actions are restricted
- [ ] Approval gates exist for high-impact operations
- [ ] Security-sensitive operations are clearly labeled

## Reference and Structure Hygiene

- [ ] `SKILL.md` is concise and focused
- [ ] Support files are referenced directly from `SKILL.md`
- [ ] No deep nested reference chains
- [ ] Templates/checklists are present where needed

## Portability and Standards

- [ ] Vendor-neutral baseline is preserved
- [ ] Vendor-specific guidance is optional and isolated
- [ ] Terminology is consistent and non-conflicting

## Validation

- [ ] Markdown lint passes
- [ ] Findings include severity + evidence
- [ ] Remediation plan is ordered and actionable
- [ ] Residual risks are captured
