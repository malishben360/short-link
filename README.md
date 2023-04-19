# ShortLink
ShortLink V1.0.0 is a URL shortening service that allows you to create short, easy-to-remember links for any website. It is built with Node.js, TypeScript, Express.js, and MongoDB.
### The project is for assessment purpose.

## Technologies Used
|   Name    |  Version  |
|-----------|-----------|
|  Node.js  |  v18.16.0 |
|TypeScript |  v5.0.4   |
| Express.js| v4.18.2   |
| Mongoose/MongoDB | v7.0.3 |
| Jest             | v29.5.0 |

## Getting Started
To get started with ShortLink, follow these steps:

1. Clone this repository to your local machine using git clone [https://github.com/your-username/short-link.git](https://github.com/your-username/short-link).
2. Install the required dependencies using npm install
3. Create a .env file in the root of the project and fill in the required environment variables. See .env.example for an example configuration or rename the file to .env.
4. Start the server using npm run start

## Project Structure
The [`ShortLink`](https://github.com/your-username/short-link) project has the following directory structure:

short-link/
   ├── src/
   │   ├── controllers/
   |    |   ├── authentication.controller.ts
   |   |   ├── statistic.controller.ts
   |   |   ├── url.controller.ts
   |   |   └── user.controller.ts
   │   ├── helpers/
   |   |   ├──auth.helper.ts
   |   |   ├──url.helper.ts
   |   |   └── index.ts  
   │   ├── middlewares/
   |   |   └── index.ts
   │   ├── models/
   |   |   ├── statistic.model.ts
   |   |   ├── url.model.ts
   |   |   └── user.model.ts
   │   ├── services/
   |   |   ├── statistic.service.ts
   |   |   ├── url.service.ts
   |   |   ├── user.service.ts
   |   |   └── index.ts
   │   ├── routes/
   │   │   ├── v1/
   |   |   |   ├── authentication.route.ts
   |   |   |   ├── statistic.route.ts
   |   |   |   ├── url.route.ts
   |   |   |   └── user.route.ts
   |   |   └── index.ts
   │   ├── tests/
   |   |   ├── authentication.test.ts
   |   |   ├── decode.url.test.ts
   |   |   ├── encode.url.route.ts
   |   |   └── statistic.url.route.ts
   │   └── index.ts
   ├── .env.example
   ├── package.json
   ├── babel.config.js
   ├── jest.config.js
   ├── nodemon.json
   └── package.lock.json
   ├── package.json
   ├── README.md
   └── tsconfig.json

* `src/controllers`: Contains the request handlers for each API endpoint
* `src/helpers`: Contains helper functions used throughout the project
* `src/middlewares`: Contains middleware functions used to handle incoming requests
* `src/models`: Contains the Mongoose models for the MongoDB database
* `src/services`: Contains the business logic of the application
* `src/routes/v1`: Contains the API routes for version 1 of the application
* `src/routes/index.ts`: Combines all the routes into one router
* `src/tests`: Contains the Jest tests for the application
* `src/index.ts`: The entry point of the application

## API Endpoints
ShortLink provides the following API endpoints:

* `/api/v1/auth/register`: Registers a new user with the application
* `/api/v1/auth/login`: Logs in a user and set a cookie.
* `/api/v1/encode`: Encodes a long URL into a short URL
* `/api/v1/decode`: Decodes a short URL into a long URL
* `/api/v1/statistic/:url_path`: Gets the statistics for a particular short URL

|   End Point                      |  Payload Sample                                                |                Function                  |
|----------------------------------|----------------------------------------------------------------|------------------------------------------|
|POST `/api/v1/auth/register`      |{username:'malish',email:'malish@indicina.co',password:'12345'} |Registers a new user with the application |
|----------------------------------|----------------------------------------------------------------|------------------------------------------|
|POST `/api/v1/auth/login`         |{email: 'malish@indicina.com', password: '12345' }              |Logs in a user and setup cookie           |
|----------------------------------|----------------------------------------------------------------|------------------------------------------|
|POST `/api/v1/encode`             |{ longURL:'https://indicina.co' }                               |Encodes a long URL into a short URL       |
|----------------------------------|----------------------------------------------------------------|------------------------------------------|
|GET `/api/v1/decode`              |{ shortURL:'http://short.est/' }                                |Decodes a short URL into a long URL       |
|----------------------------------|----------------------------------------------------------------|------------------------------------------|
|GET `/api/v1/statistic/:url_path` |                                                            |Gets the statistics for a particular short URL|
|----------------------------------|----------------------------------------------------------------|------------------------------------------|



## MongoDB Cluster Setup
To set up a MongoDB cluster for ShortLink, follow these steps:

1. [`First, create a MongoDB account or log in`](https://account.mongodb.com/account/login).
2. Then create a new project. Give it a name and press the Next button.
3. Then click Create Project after that.
4. Create a database in the next window by selecting a cloud provider, a location, and specs. So press `Build a Database` to get going.
5. Choose "Shared" because it is sufficient for testing purposes. And then click Create.
6. Next, select `aws` as your cloud provider and the region that is closest to you. Following your selection, click `Create Cluster`.

#### The cluster's formation will take some time. Create a user to access your database in the meanwhile.

7. Choose "My Local Environment" because you are runing the application locally. You can then add an IP addresses. To conclude, `click Close`.
You will receive a URI string after the database is set up, which you will use to connect to the database. The string appears as follows:

#### `mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER_URL>/<DATABASE_NAME>?retryWrites=true&w=majority`
Put this string on line 5 of .env file.

## Testing
To run the tests for ShortLink, Create the a new user with the above sample payload via the register end point, and use the command `npm run test`.
This will run all the Jest tests in the src/tests directory and give you a report of the test results.

## Sugestions and Contributions
The project main objective is to make three API endpoints available:
1. `/api/v1/encode`: Encodes a long URL into a short URL
2. `/api/v1/decode`: Decodes a short URL into a long URL
3. `/api/v1/statistic/:url_path`: Gets the statistics for a particular short URL
More end points will be aviable in V1.5.0 after my assessment with Indicina's HR.

Contributions are always welcome! If you'd like to contribute to this project, please create a fork of this repository and submit a pull request with your changes.

## Contact
If you have any questions or feedback about ShortLink, please feel free to contact me at my email address: malishben360@gmail.com.

