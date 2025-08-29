# Sprint 1 — Thin Vertical Slice
Goal: See a quest → complete it → Atlas updates (Emotion lights).

## PM
- [ ] User stories + acceptance criteria for reflection quest
- [ ] Copy for Emotion quest

## Backend
- [ ] Tables: users, quest_templates, quest_instances, atlas_states
- [ ] Seed Emotion quest template
- [ ] GET /v1/quests/today
- [ ] POST /v1/quests/{id}/submit → updates AtlasState + ActionEvent

## Frontend
- [ ] River greeting screen
- [ ] Quest screen (reflection)
- [ ] Atlas v0 (Emotion off→on + ripple animation)
- [ ] Wire to API

## QA
- [ ] Integration test: new user → submit reflection → Emotion lit
- [ ] 21-day simulation harness (fake days, completes quests)
- [ ] Pause mode test

## Tech Lead
- [ ] Approve schema + API
- [ ] Set up CI to run sim harness
- [ ] Branch protection on main

> Tip: In GitHub, use “Convert to issue” on these checkboxes to auto-create Issues.
