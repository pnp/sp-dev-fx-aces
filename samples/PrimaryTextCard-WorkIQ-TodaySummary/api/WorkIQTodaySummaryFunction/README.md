# WorkIQ-TodaySummary-Proxy

The Azure Function proxy for the `PrimaryTextCard-WorkIQ-TodaySummary` ACE. See the [sample's main README](../../README.md) for the full setup walkthrough (Entra app registrations, admin consent, API access approval) — this file only covers the Function project itself.

## What it does

`GET /api/todaySummary` — validates the caller's bearer token, exchanges it for a Work IQ-scoped token via OBO, asks the Work IQ REST Chat API for a "what's relevant today" summary, and returns a normalized `{ headline, generatedAt, items, fromCache }` payload. Responses are cached per user for `WorkIQ:CacheTtlMinutes` (default 15) to control Copilot Credits spend.

## Run locally

```bash
cd api/WorkIQTodaySummaryFunction
cp local.settings.sample.json local.settings.json   # then fill in the WorkIQ__* values
dotnet build
func start
```

## Configuration

All settings live under the `WorkIQ` section (`WorkIQ__ClientId`, `WorkIQ__ClientSecret`, etc. as app settings / `local.settings.json` keys) — see `Options/WorkIQOptions.cs` for the full list and `local.settings.sample.json` for the shape.
