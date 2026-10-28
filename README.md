#  TaxiTera

**Find your route. Find your terminal. Travel smarter.**

TaxiTera is a web application designed to help people navigate Addis Ababa's taxi transportation system more easily. It organizes taxi terminals, destinations, and routes into one accessible platform, helping users identify where to find a taxi and which destinations are served from different terminals.

##  Table of Contents

- [About the Project](#-about-the-project)
- [Objectives](#-objectives)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Terminal Data](#-terminal-data)
- [Contributing](#-contributing)
- [Future Improvements](#-future-improvements)
- [License](#-license)

##  About the Project

Finding the correct taxi terminal and route in Addis Ababa can be confusing, especially for people unfamiliar with the city's transportation network. Information about taxi destinations and departure points is often scattered or obtained by asking around.

TaxiTera aims to make this process easier by organizing transportation information digitally. Users can explore terminal locations, view available destinations, and find useful route information through a centralized platform.

The project combines a user-friendly web interface with a backend that manages terminal and location data.

##  Objectives

- Make taxi-terminal information easier to access.
- Help users identify terminals serving their desired destinations.
- Organize taxi routes and destinations in a structured database.
- Support location-based terminal discovery.
- Improve the accessibility of public transportation information in Addis Ababa.

##  Features

- **Terminal Discovery:** Access information about taxi terminals across Addis Ababa.
- **Destination Search:** Find terminals associated with particular destinations.
- **Route Information:** View destinations served by different terminals.
- **Location Data:** Store terminal coordinates for potential map integration and nearby-terminal searches.
- **Structured Terminal Database:** Organize terminal names, administrative areas, routes, and other relevant information.
- **Expandable Architecture:** Build on the frontend and backend to support additional transportation features.

*Note: The availability of each feature depends on the current implementation and connected backend services.*

## 🛠️ Technologies Used

The project uses the following technologies based on its current development setup:

| Technology | Purpose |
|---|---|
| HTML, CSS and JavaScript | Web interface and client-side logic |
| React | Component-based frontend development, if used in the current frontend |
| Vite | Frontend development server and build tooling |
| Node.js | JavaScript runtime for backend development |
| Express.js | Backend API framework, if configured |
| MongoDB | Storage for terminal and route-related data |
| Mongoose | MongoDB object modeling |
| Git and GitHub | Version control and team collaboration |

##  Project Structure

The repository may follow a structure similar to this:

```text
TaxiTera/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/
│   ├── src/
│   │   └── models/
│   │       └── Terminal.model.js
│   ├── seeds/
│   │   └── terminals.seed.js
│   ├── package.json
│   └── ...
└── README.md
```

The exact structure may differ depending on the current repository layout.

##  Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following tools before starting:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas connection
-  # TaxiTera Website Design
  This is a code bundle for TaxiTera Website Design. The original project is available at https://www.figma.com/design/cBVmpozxq7YgZoCUUKoE7m/TaxiTera-Website-Design.

You will also need access to the project repository.

### 1. Clone the Repository

```bash
git clone https://github.com/Etsub-tech/TaxiTera/
```

Navigate into the project directory:

```bash
cd TaxiTera
```

### 2. Install Dependencies

Install dependencies in the frontend and backend directories separately if each has its own `package.json`.

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd ../backend
npm install
`npm run dev` to start the development server.
`npm install axios` adds Axios to the project dependencies.
```

Adjust the directory paths if your repository uses a different structure.

##  Environment Configuration

The backend requires environment variables for configuration.

Create a `.env` file in the backend directory, or wherever the backend configuration expects it.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace the placeholder with your actual MongoDB connection string.

**Security reminder:** Never commit your `.env` file, database credentials, or API keys to GitHub. Add `.env` to your `.gitignore` file.

##  Running the Application

### Start the Backend

Open a terminal in the backend directory:

```bash
npm run dev
```

Make sure the backend's `package.json` defines a compatible `dev` script.

### Start the Frontend

Open a separate terminal in the frontend directory:

```bash
npm run dev
```

Vite will display a local development URL, commonly:

```text
http://localhost:5173
```

Open the URL displayed in your terminal in a browser.

The frontend and backend must both be running for features that depend on the API and database.

##  Terminal Data

TaxiTera organizes terminal information using fields such as:

- **Name:** The name of the taxi terminal.
- **Area:** The administrative area or neighborhood where the terminal is located.
- **Routes:** Destinations served from the terminal.
- **Price:** Fare information, when available.
- **Location:** Geographic coordinates stored in GeoJSON format.

Example terminal record:

```javascript
{
  name: "Megenagna Terminal",
  area: "Yeka",
  routes: ["Bole", "Piyasa"],
  price: 35,
  location: {
    type: "Point",
    coordinates: [38.7993, 9.0243]
  }
}
```

GeoJSON coordinates use the order `[longitude, latitude]`.

Terminal records can be added and maintained through the project's seed scripts and database tools, depending on the backend implementation.

##  Contributing

TaxiTera is a collaborative project. Contributions and improvements are welcome.

To contribute:

1. Clone the repository.
2. Check out the appropriate development branch.
3. Pull the latest changes before starting work.
4. Make your changes in a focused feature branch or the branch assigned to you.
5. Test your changes locally.
6. Commit your changes with a clear message.
7. Push your branch to GitHub and open a pull request when appropriate.

Example:

```bash
git checkout backend
git pull origin backend
git add .
git commit -m "Add new taxi terminal data"
git push origin backend
```

Coordinate changes to shared files with your teammates to reduce merge conflicts.

##  Future Improvements

Potential improvements for TaxiTera include:

- Interactive maps showing taxi terminals and destinations.
- Nearby-terminal discovery using the user's location.
- Improved search and filtering for destinations.
- More complete route and fare information.
- Better mobile responsiveness and accessibility.
- User feedback and verified terminal information.
- Expanded coverage of taxi routes throughout Addis Ababa.

##  License

A license has not yet been specified. Add a `LICENSE` file and update this section when the project license has been decided.

---

**TaxiTera — Making taxi transportation information easier to find in Addis Ababa.** 🚕
