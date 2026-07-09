# DeskPro — Support Ticket Management SPA

A production-grade customer support ticket system built with React 18, Redux Toolkit, and React Router v6.

## Getting started

```bash
npm install
npm start      # http://localhost:3000
npm test       # run Jest tests
npm run build  # production build
```

## Stack

| Layer | Tech |
|-------|------|
| UI | React 18 + JSX |
| State | Redux Toolkit (slices + async thunks) |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| Testing | React Testing Library + Jest |

## Architecture highlights

### Metadata-driven forms (Formly equivalent)
`FORM_SCHEMA` array drives the CreateWizard — add fields by config, not JSX.

### Redux Toolkit state (NgRx equivalent)
- `ticketsSlice` = NgRx feature + effects + selectors
- `useTickets()` hook = Angular injectable service
- `createAsyncThunk` = NgRx createEffect + switchMap

### Swap mock for real .NET API
Only change `ticketService.js` — everything else is untouched.

### Accessibility
WCAG 2.1 AA: aria-live counts, aria-busy loading, aria-describedby errors, keyboard navigation on all table rows.

## Angular migration path

| React | Angular 17 |
|-------|-----------|
| Redux slice | NgRx feature slice |
| useTickets() | Injectable service |
| FORM_SCHEMA | Formly FormlyFieldConfig |
| createAsyncThunk | createEffect + switchMap |
| useSelector | store.select(selector) |
