# Football Data GraphQL API
This project is a GraphQL API that fetches data from the [football-data.org API v4](https://www.football-data.org/) and stores it in a PostgreSQL local database. You can find the provided mutations and queries in the features section.

# Features

- importLeague mutation: Imports league data by league code from the Football Data API and stores it locally. The imported data includes the league, teams that participate on it, and players or coach for each team. This mutation returns true as soon as possible and doesn't wait until the import process is completed. To be notified when the league was already imported you have to subscribe to the ```importedLeague``` subscription.
- importedLeague subscription: Returns the imported league or an error.
- players query: Returns the players that play for the teams in a given league. It can also filter them by a specific team in the league.
- team query: Returns the corresponding team for a given team name and, additionally, if requested in the query, the players or coach for that team.

# Environment Variables

The application uses environment variables for various purposes, such as configuring the connection to your PostgreSQL database. Therefore, before running the application, make sure to set up the environment variables in the .env file (you can follow the .env.template file as a guide). If any of the environment variables are not configured correctly, the application will not start and will throw an error specifying which environment variables are missing or misconfigured.

# Getting Started

## Run with Docker

### Prerequisites

Before you begin, ensure you have met the following requirements:

Docker: Ensure that you have Docker installed on your system. If you don't have Docker installed, you can download and install it from [Docker's official website](https://www.docker.com/).

### Clone and Run with Docker

To clone and run the project using Docker, follow these steps:

1. Clone the repository to your local machine:
```bash
$ git clone https://github.com/lischetti-lorenzo/football-data-graphql-api
```

2. Navigate to the project directory:
```bash
$ cd football-data-graphql-api
```

3. Create a .env file in the root of the project and add the environment variables following the .env.template file.
   
4. Build the Docker container:
```bash
$ docker-compose up
```

5. The API should be running now. You can access the GraphQL Playground at http://localhost:${NODE_PORT}/graphql in your web browser.

### Clone and Run without Docker

If you prefer to run the project without Docker, follow these steps:

1. Clone the repository to your local machine and navigate to the project directory as described in the previous section.

2. Install project dependencies:
```bash
$ npm install
```

3. Create a .env file in the root of the project and add the environment variables following the .env.template file.

4. Run the migrations to create the database schema:
```bash
$ npx prisma migrate dev
```

5. Start the application:
```bash
$ npm run start:dev
```

6. The API should be running now. You can access the GraphQL Playground at http://localhost:${NODE_PORT}/graphql in your web browser.

# Test

```bash
# unit tests
$ npm run test
```

# Technologies Used

- **Nest.js:** Powerful and extensible Node.js framework for building scalable and maintainable server-side applications, providing a modular and efficient structure. It is used here to structure and organize the API.
- **GraphQL:** Query and manipulation language for APIs that allows clients to request only the data they need. It provides a more efficient and flexible alternative to RESTful APIs.
- **PostgreSQL:** Robust and open-source relational database management system. It's used as the primary database to store and manage data.
- **Prisma:** Modern database toolkit that simplifies database access with a type-safe and auto-generated query builder. It helps us interact with the PostgreSQL database seamlessly.

# Design Decisions

- **NestJs:** NestJs was chosen because of its modular architecture, dependency injection system, and TypeScript support, which make it an ideal framework for building maintainable and scalable applications.
- **GraphQL:** GraphQL was chosen for its flexibility and the ability to request only the required data, reducing over-fetching and under-fetching of data.
- **Prisma:** Prisma was chosen because it simplifies the database access and query building with a type-safe API and auto-generated query builder.
