# Graph Report - cover-letter-writer  (2026-05-08)

## Corpus Check
- 54 files · ~72,466 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 115 nodes · 72 edges · 47 communities (44 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8984ceb1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 5|Community 5]]

## God Nodes (most connected - your core abstractions)
1. `Navbar()` - 8 edges
2. `BlogPost()` - 3 edges
3. `formatDate()` - 2 edges
4. `getReadingTime()` - 2 edges
5. `cleanJobDescription()` - 2 edges
6. `SavedLetterCard()` - 2 edges
7. `PricingCard()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (47 total, 3 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.47
Nodes (3): BlogPost(), formatDate(), getReadingTime()

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Navbar()` connect `Community 0` to `Community 5`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._