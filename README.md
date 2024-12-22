# Description

This project is a simple NestJS application.

## Getting Started

### Requirements
Before you start, make sure you have the following installed:

- **Node.js**  
  Check the installed version of Node.js and npm:
  ```bash
  node -v
  npm -v
  ```

- **MySQL**  
  Ensure MySQL is installed and running on your system.

### Installation

1. **Clone the repository**  
   First, clone the project repository to your local machine:
   ```bash
   git clone git@github.com:exralvio/nestjs-small-project.git
   ```

2. **Install dependencies**  
   Navigate to the project folder and install the required npm packages:
   ```bash
   cd nestjs-small-project
   npm install
   ```

3. **Configure environment variables**  
   Copy the `.env.example` file to `.env` and update the MySQL database connection settings:
   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=secret
   DB_NAME=db_name
   ```

2. **Run database migrations**  
   Execute the migration to set up your database:
   ```bash
   npm run migration:run
   ```

### Running the Application
To start the application in development mode, use the following command:

```bash
npm run start:dev
```