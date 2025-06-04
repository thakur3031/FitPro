# FitApp Trainer Dashboard - Frontend

This project is the frontend for the FitApp Trainer Dashboard, bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

To get the frontend running locally, follow these steps:

### 1. Prerequisites

*   Node.js (which includes npm) installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
*   The backend server should be running. Refer to the main project README or `backend/README.md` for instructions on starting the backend.

### 2. Installation

Navigate to the `frontend` directory and install the necessary dependencies:

```bash
cd frontend
npm install
```

### 3. Running the Development Server

Once the dependencies are installed, you can start the development server:

```bash
npm start
```

This runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload automatically when you make changes to the code.\
You may also see any lint errors in the console.

### Available Scripts

In addition to `npm start`, the following scripts are available:

*   **`npm test`**: Launches the test runner in interactive watch mode.
*   **`npm run build`**: Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
*   **`npm run eject`**: (Use with caution) Removes the single build dependency and copies configuration files and transitive dependencies into your project for full control. This is a one-way operation.

## Project Structure

*   **`public/`**: Contains static assets and the main `index.html` file.
*   **`src/`**: Contains the React application code.
    *   **`api/`**: Functions for making API calls to the backend (e.g., `authService.js`).
    *   **`components/`**: Reusable UI components (e.g., `PrivateRoute.js`).
    *   **`hooks/`**: Custom React hooks.
    *   **`pages/`**: Top-level page components (e.g., `LoginPage.js`, `DashboardPage.js`).
    *   **`utils/`**: Utility functions.
    *   **`App.js`**: Main application component with routing setup.
    *   **`index.js`**: Entry point for the React application.
    *   **`*.css`**: CSS files for styling components and pages.

## Learn More

To learn more about React, check out the [React documentation](https://reactjs.org/).
You can learn more about Create React App in its [documentation](https://facebook.github.io/create-react-app/docs/getting-started).
