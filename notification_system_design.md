# Stage 1: Notification Prioritization Design

## Goal

The aim of this stage is to process a collection of notifications and identify the most relevant ones for the user. The system focuses on highlighting important updates while maintaining a balance between urgency and recency.

---

## Design Overview

### 1. Data Fetching

Notifications are obtained from the given API endpoint using an authenticated request. Logging is integrated to capture request lifecycle events such as initiation, success, and failure.

---

### 2. Importance Mapping

Each notification category is assigned a relative importance level:

* **Placement** → Critical
* **Result** → Moderate
* **Event** → Informational

This mapping ensures that high-impact updates are always given precedence.

---

### 3. Processing Logic

The notification list is processed in two steps:

* **Step 1:** Sort by importance level (higher importance first)
* **Step 2:** Within the same category, sort by timestamp (most recent first)

This ensures that users receive the most valuable and timely information.

---

### 4. Selection Strategy

To keep the output concise, only the top 10 notifications are selected after sorting. This prevents information overload and improves readability.

---

### 5. Logging Mechanism

A centralized logging function is used throughout the workflow to:

* Record API interactions
* Track internal processing steps
* Capture errors and unexpected scenarios

This provides better traceability and simplifies debugging.

---

## Efficiency Analysis

* Sorting complexity: **O(n log n)**
* Selection of top elements: **O(1)**

The design ensures efficient handling of notification data even as the dataset grows.

---

## Final Outcome

The system delivers a refined list of notifications that prioritizes critical updates while maintaining recency. This approach improves user experience by presenting only the most meaningful information in a structured manner.
