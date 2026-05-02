# Notification System

A full-stack application featuring a premium, white-themed Notification Viewer built with Vite, React, and TypeScript.

## Project Structure

- `notification_app_fe/`: The frontend React application.
- `notification_app_be/`: Backend services and related scripts.

## Frontend Application (`notification_app_fe`)

The frontend is a lightweight, high-performance notification viewer with an elegant, modern light mode UI.

### Key Features
- **Native Fetch API**: Uses standard, native `fetch` with no heavy HTTP libraries (like axios).
- **Vite Proxy**: Bypasses backend CORS issues dynamically during local development.
- **Premium UI**: Custom standard CSS featuring dot-matrix backgrounds, slide-up animations, distinct color indicators, and hover micro-interactions. No Tailwind or Bootstrap.
- **Filtering & Searching**: Quickly filter notifications by type (Placement, Result, Event) or search through message content dynamically.
- **Pagination**: Client-side pagination logic separating results into clean pages of 10 items.
- **Intelligent Sorting**: Automatically prioritizes notifications strictly by `Placement > Result > Event`, and secondarily by the latest timestamp.

### Setup and Running Locally

1. Navigate to the frontend directory:
   ```bash
   cd notification_app_fe
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```
3. Set up your authentication token. Ensure your `.env` file in the `notification_app_fe` directory has a valid token:
   ```env
   VITE_API_TOKEN=your_jwt_token_here
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Note: If you update your `.env` token while the server is running, you must restart the server for the changes to take effect.*

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### Core Technologies
- React 18
- Vite
- TypeScript
- Standard CSS
