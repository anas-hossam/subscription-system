<h1 align="center" style="border-bottom: none;color: #00BFFF;">Subscription System</h1>


## Overview

This system will be composed of three microservices:

- **Public Service**: Backend for Fronend microservice to be used by UI forntend.
- **Subscription Service**: This microservice implementing subscription logic, including presistence of subscription data in database and email notification to confirm process is completed.
- **Mail Service**: microservice to implement email notifications.

# Important Notes
```
- when running `docker` start first by running `subscription-service`, as it is initialize common network between the three services then you can run any service after it.

- you need to read README in each service to be able to run it by following how to run section.
```