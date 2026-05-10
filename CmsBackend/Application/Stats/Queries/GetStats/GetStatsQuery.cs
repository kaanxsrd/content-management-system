using CmsProduct.Application.Abstractions;
using CmsProduct.Contracts.Stats;

namespace CmsProduct.Application.Stats.Queries.GetStats;

public record GetStatsQuery : IQuery<BackendStatsResponse>;
