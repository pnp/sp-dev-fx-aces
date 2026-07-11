namespace WorkIQTodaySummaryFunction.Models;

/// <summary>
/// Wire contract returned to the SPFx ACE. Keep in sync with
/// src/models/IWorkIQTodaySummary.ts on the ACE side.
/// </summary>
public sealed record TodaySummaryResponse(
    string Headline,
    DateTimeOffset GeneratedAt,
    IReadOnlyList<ReferencedItem> Items,
    bool FromCache);

/// <summary>Type is a plain string ("file" | "meeting" | "message" | "other") rather than an enum so the JSON shape matches the TS union type exactly.</summary>
public sealed record ReferencedItem(
    string Id,
    string Type,
    string Title,
    string? Subtitle,
    string? WebUrl);
