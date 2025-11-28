# Interactive Line Chart

An interactive line chart application built with React, TypeScript, and Recharts to visualize A/B test statistics.

## Implemented Features

### Core Features
- **Interactive Chart**: Visualizes conversion rates for multiple variations (Original, A, B, C).
- **Filtering**: Multi-select dropdown to toggle specific variations.
- **Time Aggregation**: Switch between Daily and Weekly data views.
- **Responsive Design**: Adapts to different screen sizes.

### Bonus Features
- **Zoom & Pan**: Integrated `Brush` component for zooming into specific time ranges.
- **Line Styles**: Toggle between **Monotone** (Smooth), **Linear** (Straight), **Step**, and **Area** charts.
- **Theme Support**: Full **Light** and **Dark** mode support.
- **Export**: One-click export of the current chart view to **PNG**.
- **Zoom Controls**: Dedicated buttons for Zoom In, Zoom Out, and Reset Zoom.

## Local Setup Instructions

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

3.  **Build for production**:
    ```bash
    npm run build
    ```

## Deployment

The project is configured for deployment to GitHub Pages.

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Deploy**:
    ```bash
    npm run deploy
    ```
    This command will build the project and push the `dist` folder to the `gh-pages` branch.
