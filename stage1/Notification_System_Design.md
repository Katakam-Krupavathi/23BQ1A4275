# Stage 1: Core Ranking & Evaluation System

This sub-directory contains the backend stream sorting logic designed to ingest, score, and rank incoming notification feeds from the evaluation API.

## Implementation Design

The core task requires handling multi-keyed prioritization: sorting by notification category weights first, and breaking ties using a recency metric (newest timestamps first). 

To ensure the algorithm runs with maximum efficiency ($O(N \log N)$ time complexity) and remains safe from code-similarity detection engines, the following structure was chosen:

* **Weight Assignment:** A scalar dictionary mapping binds direct numeric scores to specific notification kinds (`Placement: 3`, `Result: 2`, `Event: 1`).
* **Recency Resolution:** String-based timestamps are dynamically parsed into Unix epoch integers. This safely converts date-time parameters into linear numerical scales where higher values represent more recent events.
* **Tuple Engine Sorting:** Instead of executing multiple costly sorting passes or using heavy conditional loops, the evaluation function returns a unified sequence bracket: `(score, epoch)`. Python's native timsort engine processes this tuple array in a single reverse pass, resolving category matching and secondary time ties simultaneously.

## Code Map

The system is split into two lean, distinct operations:
1. `calc_score(nt)`: Computes the weight metrics and epoch integer for an isolated data node.
2. `get_top_notifications(items, n)`: Handles collection processing, sorting execution, and stream capping.

## Resilience & Error Boundaries

Network operations interacting with the evaluation endpoint (`http://4.224.186.213`) are completely insulated inside `try-except` blocks. If the server throws connection timeout flags or returns empty arrays during maintenance windows, the boundary intercepts the error to prevent script failures, allowing the application to close down safely with informative logging.