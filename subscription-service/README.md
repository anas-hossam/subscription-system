<h1 align="center" style="border-bottom: none;color: green;">Subscription Service</h1>


## Overview

This microservice implementing subscription logic, including presistence of subscription data in database and email notification to confirm process is completed, exposes **API** for CRUD operations like `POST subscribe`, `PUT unsubscribe`, `GET subscriptions/:id` and `GET subscriptions` for `subscription`.

---

# Table of Contents
* [Stack](#stack)
* [How To Use](#how-to-use)
* [Used Frameworks OR Libraries](#used-frameworks-or-libraries)
* [Used Frameworks OR Libraries In Testing](#used-frameworks-or-libraries-in-testing)


---

## [Stack](#stack)
```
- NodeJs 12.9.0
- MongoDb 3.6.5
- Docker 3.4
```

## [How To Use](#how-to-use)
```
- To run locally, first we need to install dependencies, then start server
```
- $ npm install
- $ npm run start
```
- To run docker
```
- $ npm run docker
```
- To run Swagger docs, run below command then open url in browser after getting port from console so, will be like that `localhost:${port}/docs`
```
- $ npm run docs
```
- To run tests
```
- $ npm run test
```

```

## [Used Frameworks OR Libraries](#used-frameworks-or-libraries)
```
- express
```
what it is purpose, why it used ?
- Fast, unopinionated, minimalist web framework for node.
- used to expose API endpoints
```

- awilix
```
what it is purpose, why it used ?
- Extremely powerful Dependency Injection (DI) container for JavaScript/Node, written in TypeScript. Make IoC great again!.
- used to inject services to container, makes it simple for me to manage dependencies between objects, Reduced Dependencies and makes code more readable, reuseable and testable
```

- mongodb
```
what it is purpose, why it used ?
- is a document database, which means it stores data in JSON-like documents.
- used to persist data in database

```
- body parser
```
what it is purpose, why it used ?
- Node.js body parsing middleware.

- to parse incoming request bodies in a middleware before your handlers, available under the req.body property
```
- cors
```
what it is purpose, why it used ?
- Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any other origins (domain, scheme, or port) than its own from which a browser should permit loading of resources. CORS also relies on a mechanism by which browsers make a “preflight” request to the server hosting the cross-origin resource, in order to check that the server will permit the actual request. In that preflight, the browser sends headers that indicate the HTTP method and headers that will be used in the actual request.
- used to enable CORS with various options.
```
- helmet
```
what it is purpose, why it used ?
- is a useful Node. js module that helps you secure HTTP headers returned by your Express apps, The headers provide important metadata about the HTTP request or response so the client (browser) and server can send additional information in a transaction.
- used to secure HTTP headers.
```
- joi
```
what it is purpose, why it used ?
- The most powerful schema description language and data validator for JavaScript.
- used to validate schema of subscription object
```
- jws
```
what it is purpose, why it used ?
- JSON Web Tokens It’s a way of encrypting a value, in turn creating a unique token that users use as an identifier. This token verifies your identity. It can authenticate who you are, and authorize various resources you have access to
- used to secure requests, by providing token secured by specific secret token
```
- lodash
```
what it is purpose, why it used ?
- is a JavaScript library that provides utility functions for common programming tasks.
- used to write more concise and easier to maintain JavaScript code. Lodash contains tools to simplify programming with strings, numbers, arrays, functions and objects. 
```
- axios
```
what it is purpose, why it used ?
- is a promise based HTTP client for the browser and Nodejs.
- used to send asynchronous HTTP requests to REST endpoints and perform CRUD operations.
```
- morgan
```
what it is purpose, why it used ?
- is a HTTP request logger middleware for Nodejs.
- used to simplify the process of logging requests to your application
```
```

## [Used Frameworks OR Libraries In Testing](#used-frameworks-or-libraries-in-testing)
```

- chai
```
what it is purpose, why it used ?
- is an assertion library, similar to Node's built-in assert.
- It makes testing much easier by giving you lots of assertions you can run against your code.
```
- chai as promised
```
what it is purpose, why it used ?
- extends Chai with a fluent language for asserting facts about promises
```
- mocha
```
what it is purpose, why it used ?
- Simple, flexible, fun JavaScript test framework for Node.js & The Browser.
- making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases.
```
- supertest
```
what it is purpose, why it used ?
- send HTTP requests to a server
- ysed to provide some assertions API testing
```
- swagger ui express
```
what it is purpose, why it used ?
- allows you to serve auto-generated swagger-ui generated API docs from express, based on a swagger.json file. The result is living documentation for your API hosted from your API server via a route.
```
```
