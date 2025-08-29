# Spec (v1)
## Entities
User, Consent, City(7 seed rows), Journey(21d), QuestTemplate, QuestInstance,
AtlasState, Relic, JournalEntry, SensorSample, ActionEvent, Place(optional).

## API (v1)
GET /v1/quests/today → QuestInstance
POST /v1/quests/{id}/submit {text?, steps?, locationTag?, stillMinutes?} → {effects}
GET /v1/atlas → AtlasState
POST /v1/consent → update consent flags
POST /v1/sensors/ingest → SensorSample (aggregated, day-based)

## Rules engine (mythic mapping)
- Willpower + steps>=2000 → +torch
- Emotion + weather:rain + text → +ripple, +lantern
- Silence + stillMinutes>=10 → +stone

## Privacy
- Journal text encrypted at rest.
- Location stored as semantic tags (“river/park/mountain”) unless user opts into precise.
