# Inventory Console

## 1. Overview

This project is an internal stock management console for clinic supplies teams.

The application allows users to:

* View the current stock catalogue
* Search for products
* Filter products by category
* Sort products
* Navigate through paginated results
* Open an individual product to view its details
* Correct a stock count when a physical count differs from the system count
* Share a direct link to a specific product

The product catalogue is provided by DummyJSON and is treated as the clinic's stock catalogue for this assessment.

The application is built with **Next.js**, with a focus on responsive design, accessibility, maintainability, and resilience under patchy network conditions.

---

# 2. Application Structure

The application is divided into three main user-facing areas:

```text
/login
    ↓
/products
    ↓
/products/[id]
```

### Login

It contains:

* Username input
* Password input
* Sign-in button
* Form validation
* Loading state during authentication
* Error feedback for invalid credentials

### Product Listing

The layout contains:

```text
------------------------------------------------
Header / Navigation
------------------------------------------------

Product Inventory

[ Search products... ] [ Filter ] [ Sort ]

------------------------------------------------
| ID | Name | Category | Stock Count |         |
------------------------------------------------
|    |      |          |             | View →  |
------------------------------------------------

              < 1 2 3 4 5 >

------------------------------------------------
```

The table displays:

* Product ID
* Product name
* Category
* Stock count
* Action to view the product

The page also provides:

* Loading states
* Empty states
* Error states

### Product Detail

Each product has its own route:

```text
/products/[id]
```

The detail page displays:

* Product name
* Product ID
* Category
* Description
* Current stock count

It also provides a **Correct Stock** action.

The correction flow will:

1. Display the current system stock count.
2. Allow the user to enter the physically counted quantity.
3. Validate that the value is a valid non-negative number.
4. Require the user to confirm the correction.
5. Submit the update.
6. Update the displayed stock count.
7. Refetch relevant cached data so the listing and detail views remain consistent.

---

# 3. Component Architecture

I will keep components focused on a single responsibility rather than putting the entire application into large page components.

```text
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── layout.tsx
│
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── products/
│   │   ├── ProductTable.tsx
│   │   ├── ProductRow.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductSearch.tsx
│   │   ├── ProductSort.tsx
│   │   ├── ProductPagination.tsx
│   │   ├── ProductDetailCard.tsx
│   │   └── StockCorrectionForm.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Modal.tsx
│       └── EmptyState.tsx
│
├── lib/
│   ├── api/
│   │   └── products.ts
│   └── utils/
│
└── types/
    └── product.ts
```

The goal is to separate:

* **Pages** — composition and routing
* **Components** — UI and interaction
* **API functions** — communication with DummyJSON
* **Types** — shared TypeScript models
* **Utilities** — reusable application logic

---

# 4. State Management

## Server State

Product data is server state because it originates from the API and may become stale.

This includes:

* Product list
* Individual product details
* Categories
* Stock values

I plan to manage this state using **TanStack Query**.

This provides:

* Request caching
* Loading and error states
* Query invalidation
* Mutation handling

## URL State

Search, filtering, sorting and pagination affect what products the user is viewing, so these values should live in the URL rather than only in component state.

This means that:
* The product list url is a shareable representation of the current product-list view.
* Refreshing the page does not lose the current filters.
* Browser back/forward navigation works naturally.
* A filtered view can be shared with another team member.

## Local UI State

Local state is reserved for temporary interface concerns such as:

* Whether the stock correction dialog is open
* The current value being typed into the correction form
* Form validation errors
* Button interaction states
* Temporary UI feedback

---

# 5. Data Fetching, Caching and Invalidation

The application will use a dedicated API layer rather than making API requests directly throughout components.

For example:

```text
components
    ↓
query/mutation hooks
    ↓
API functions
    ↓
DummyJSON
```

### Product List

The product list query will use the current URL parameters to determine the requested data.

Search, category, sorting and pagination will therefore produce predictable query keys.

For example:

```text
['products', {
  search,
  category,
  sortBy,
  sortOrder,
  page
}]
```

TanStack Query can then cache different views independently.

### Product Details

Individual products will have their own query:

```text
['product', productId]
```

This prevents the application from unnecessarily loading the entire catalogue when a user opens one product.

### Stock Correction

Stock correction is a mutation.

After a successful correction, the application will update or invalidate:

```text
['product', productId]
['products', ...]
```

This ensures that the corrected stock value is reflected both on the product detail page and in the product listing.

### Patchy Wi-Fi

The application is designed to minimise unnecessary network activity because users may be working on ward tablets with unreliable connectivity.

I will use:

* Cached server responses
* Request deduplication
* Retry handling for transient failures
* Loading skeletons instead of blank screens
* Pagination rather than loading the entire catalogue at once
* Debounced search requests where appropriate

---

# 6. Layout, Spacing, Colour and Typography

I will use a library called shadcn ui defaults to build the application's layout, spacing, colour and typography. 



A clean sans-serif typeface will be used with a clear hierarchy between:

* Page titles
* Section headings
* Body text
* Table data
* Supporting text
* Form labels

The main goal is high readability on tablet screens rather than using typography as a decorative element.

If a UI component library is used, I will retain its accessible defaults where appropriate and customise only where the product requirements require it.

---

# 7. Accessibility

I will leverage shadcn ui accessibility defaults for all interactive elements.

I will ensure the following accessibility standards are met:

* Keyboard accessibility
* Semantic HTML
* Form labels
* Table headers
* Focus states
* Colour contrast
* Loading and error states


# 8. Decision Log

## Decision 1 — Keep search, filters, sorting and pagination in URL state

**Decision:** Represent list controls through URL query parameters.

**Alternative rejected:** Keep all search/filter/sort/pagination values only in React component state.

**Why:** The brief specifically requires users to share links and work with specific inventory views. URL state makes views reproducible, supports browser navigation and preserves the user's context after refresh. It also prevents the URL from representing one state while the UI represents another.

---

## Decision 2 — Use TanStack Query for server state

**Decision:** Use TanStack Query for product fetching, caching and mutations.

**Alternative rejected:** Fetch products with `useEffect` and store the response in `useState`.

**Why:** Products are server-owned data rather than purely local UI state. TanStack Query provides caching, request deduplication, stale-data handling, retries and query invalidation, which are particularly useful when users are working over unreliable Wi-Fi.

---

## Decision 3 — Paginate rather than load the entire catalogue

**Decision:** Display products in paginated results.

**Alternative rejected:** Fetch the entire catalogue and render every product on the page.

**Why:**  Pagination reduces the amount of data transferred and rendered, which is useful on ward tablets and slower networks.

---

## Decision 4 — Use a dedicated stock correction interaction

**Decision:** Require an explicit correction form and confirmation rather than making the stock cell directly editable.

**Alternative rejected:** Allow users to click the stock number and immediately edit it inline.

**Why:** A dedicated interaction makes the action intentional, provides room for validation and reduces accidental changes.

---

## Decision 5 — Keep product detail on a separate route

**Decision:** Use `/products/[id]` for product details.

**Alternative rejected:** Open product details only inside a modal on the listing page.

**Why:** A dedicated route gives every product a stable URL that can be copied into chat, bookmarked and opened directly.

---

# 9. Technology Choices

### Framework

**Next.js + TypeScript**

Next.js provides:

* File-based routing
* Dynamic routes
* Server/client rendering options
* Good application structure
* TypeScript support

### Data Fetching

**TanStack Query**

Used for server state, caching, mutations and invalidation.

### Styling

The application will use a consistent styling system/design token approach rather than styling each component independently.

Tokens will define recurring values such as:

```text
Spacing
Border radius
Typography sizes
Font weights
Colours
Breakpoints
Shadows
```

This makes future visual changes easier and keeps the interface consistent.

### API

**DummyJSON**

DummyJSON is used as the product catalogue for the assessment. Its product fields are mapped directly to the inventory domain without inventing additional clinical information.

---

# 13. Future Production Considerations

If this prototype were being taken into production, I would introduce a backend responsible for:

* Authentication and role-based access
* Persistent stock corrections
* Audit history for stock changes
* User identity for each correction
* Multi-clinic/organisation isolation
* Server-side validation
* Concurrency handling
* Database persistence
* Monitoring and error logging

The frontend architecture is intentionally structured so that DummyJSON can later be replaced by a real inventory API without requiring the UI components to know how the backend works.

---

# 14. Key UX Principles

The design follows five principles:

1. **Fast to scan** — stock information is presented in a clear, structured table.
2. **Easy to find** — search, filtering, sorting and pagination are always accessible.
3. **Safe to change** — stock corrections require validation and explicit confirmation.
4. **Easy to share** — products have stable, unique URLs.
5. **Resilient to poor connectivity** — cached data, pagination and clear network states reduce the impact of unreliable Wi-Fi.


# Stock Console

## Deployment

- **Public URL:** https://stock-console-omega.vercel.app
- **Branch that triggers a deployment:** `main`
- **Pipeline:** On every push/PR, CI runs lint, type-check, and build against the code. A merge into `main` is blocked if any of these checks fail. Once merged, `main` triggers the production deployment on Vercel.

---

## 1. What did you use AI for across the four sections?

**Section 1** — I used AI to polish the README's design, and give me better wording, and overall clarity.

**Section 2** — I used AI to increase productivity while building: to improve user interface by providing meaningful words displayed to the user, generating the various data-fetching hooks, and refactoring those hooks to avoid repetition of query keys.

**Section 3** — I used AI to modify a GitHub Actions workflow I'd already built for a previous project to cater for the stock-console project.

## 2. Which tools did you use?
I did not use any of the tools mentioned above
I first understood the problem, then I worked through it in this order: designed the folder structure, designed the UI layout and components, built the pages, fetched data from the API, confirmed everything worked as expected, then pushed.

## 3. One example where an AI suggestion improved your work

**Nuqs:** I was working on URL state synchronization and had defined query parameters with default values. I was initially using the query state directly, which caused an issue when the URL value was `null` or `undefined`. I prompted the AI to help me handle the fallback correctly. It suggested using the **nullish coalescing operator (`??`)** to fall back to a local state value when the query state was not available. This fixed the state handling issue and made the filtering and pagination behavior more reliable.


## 4. One example where AI output was wrong, incomplete, or subtly bad

I wanted AI to only handle the authentication logic so the login form would work. Instead, it also modified the login form's UI and added components that weren't part of my design. I caught this and rejected that part of the suggestion.

## 5. Two decisions made without AI

- **Package choices** (shadcn/ui, TanStack Query, React, Next.js, nuqs) — I've worked with these before, they haven't let me down, and they're open-source.
- **Folder structure** — planned this myself based on how I understood the project needed to be organized.

## 6. One part of the codebase you'd struggle to defend

Identifying query keys and doing query invalidation — it's confusing and remains the weakest part of the codebase for me.
