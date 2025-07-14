# Application Setup and Dependencies

This document outlines the steps to set up the application and describes the dependencies required to run the project effectively.

## Dependencies Installation

The project requires several npm packages for core functionality and development purposes. Below is the list of packages and their usage:

### Core Dependencies

1. **express**: A fast, unopinionated, minimalist web framework for Node.js.
   ```bash
   npm install express
   ```
2. **mongoose**: An elegant MongoDB object modeling tool designed to work in an asynchronous environment.
   ```bash
   npm install mongoose
   ```
3. **dotenv**: Loads environment variables from a `.env` file into `process.env`.
   ```bash
   npm install dotenv
   ```
4. **cookie-parser**: Parses `Cookie` header and populates `req.cookies` with an object keyed by the cookie names.
   ```bash
   npm install cookie-parser
   ```
5. **cors**: Provides a middleware to enable Cross-Origin Resource Sharing (CORS).
   ```bash
   npm install cors
   ```
6. **multer**: A middleware for handling `multipart/form-data`, primarily for file uploads.
   ```bash
   npm install multer
   ```
7. **bcrypt**: A library to help you hash passwords.
   ```bash
   npm install bcrypt
   ```
8. **jsonwebtoken**: A library to create and verify JSON Web Tokens (JWTs) for authentication.
   ```bash
   npm install jsonwebtoken
   ```
9. **nodemailer**: A module for Node.js applications to send emails easily.
   ```bash
   npm install nodemailer
   ```
10. **joi**: A powerful schema description language and data validator for JavaScript.
    ```bash
    npm install joi
    ```
11. **winston**:Winston is a versatile logging library for Node.js that supports various logging levels, formats, and transports.
    It enables developers to easily manage logs in different environments with features like time stamping, file logging, and custom formats.
    ```bash
     npm install winston
    ```
12. **morgen**:Morgan is a HTTP request logger middleware for Node.js that simplifies logging details of incoming requests.
    It's commonly used in Express applications to monitor server activity and debug issues effectively.
    `bash
 npm install morgan
`
    13 . **loadtest** :Load testing is crucial for evaluating a web application's performance under heavy load, identifying bottlenecks and potential issues. The "npm loadtest" tool is widely used to test the performance of Node.js Express.js APIs.
    `bash
 npm install loadtest
`

### Development Dependencies

For development, the following packages ensure code quality and hot-reloading during development:

1. **eslint**: A tool for identifying and fixing problems in JavaScript code.
   ```bash
   npm install --save-dev eslint
   ```
2. **nodemon**: A utility that monitors for changes in source files and automatically restarts the server.
   ```bash
   npm install --save-dev nodemon
   ```
3. **prettier**: A code formatter to ensure consistent code style.
   ```bash
   npm install --save-dev prettier
   ```

## Additional Notes

- Ensure your Google account has App Passwords enabled for email functionalities.
- Use `eslint` and `prettier` to maintain code quality and consistency.
- Use `nodemon` for hot-reloading during development.

By following these steps, your application should be ready to use. For more detailed documentation, refer to individual package documentation or the project wiki.
