# Warsaw Salons Directory

This is a full-stack web application serving as a directory for beauty and hair salons in Warsaw. The project features a paginated list of salons, district filtering, and the ability to view, create, edit, and delete salon details. The database is automatically seeded with real-world data from OpenStreetMap.


## Technical Solution and Frameworks Used

**Backend:**
* **Java 17 & Spring Boot 3:** Provides a RESTful API.
* **Spring Data JPA & Hibernate:** For database interactions and ORM.
* **PostgreSQL:** Relational database for storing salon entities.
* **Custom Data Seeder:** A `CommandLineRunner` script that queries the OpenStreetMap Overpass API on startup to fill an empty database with real salons in Warsaw.

**Frontend:**
* **React & TypeScript:** 
* **Vite:** 
* **Axios:** For making HTTP requests to the backend.


## How to Run the Application

### Prerequisites
* Java 17+
* Node.js (v16+)
* PostgreSQL running locally

### 1. Database Setup
1. Open PostgreSQL and create a new database named `salons_db`.
2. The application expects the following default credentials (you can change them in `src/main/resources/application.properties`):
   * **URL:** `jdbc:postgresql://localhost:5432/salons_db`
   * **Username:** `postgres`
   * **Password:** `postgres`

### 2. Running the Backend
1. Open the backend project in your preferred Java IDE (e.g., IntelliJ IDEA).
2. Run the `WarsawSalonsApplication.java` main class.
3. The server will start on `http://localhost:8080`.
   > **Note:** Upon the very first startup, the application will automatically connect to the OpenStreetMap API and insert real data into your local database. Please ensure you have an active internet connection.

### 3. Running the Frontend
1. Open a terminal and navigate to the frontend directory.
2. Install the required dependencies:
   ```bash
   npm install
3. Start the development server:
   `npm run dev`
4. The application will be accessible at `http://localhost:5173`.


## What I'd Improve with More Time

If I had more time, I would enhance the project with the following features:

1. **Dockerization:** I would add a `docker-compose.yml` file to containerize the database, backend and frontend.
2. **Backend Pagination and Filtering:** Currently, the district filter is handled locally on the client-side for the current page. I would move this logic to the Spring Boot repository using `@Query` or Specifications.
3. **Data Validation:** Implement `spring-boot-starter-validation` annotations (like `@NotBlank`, `@Size`) on the backend DTOs to ensure clean data entry, and display friendly error messages on the React frontend.
