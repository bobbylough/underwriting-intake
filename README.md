This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Risk IOP MVP – Risk Intake and Orchestration Platform

## Problem Statement

Clients need a way to submit CSV files containing data about groups of people for risk evaluation whether through a web interface, SFTP upload, or API integration.  We offer a variety of risk modeling services that evaluate different aspects of the risks involved in insuring groups of people. These services are tailored to meet the specific needs of our clients who have licensed one or more of them. For the CSV file to be assessed by one of our risk services, it must adhere to several validation rules.

The file requirements are as follows:

- FirstName column, cannot be empty
- LastName column, cannot be empty
- DOB column, must be a date in the past, formatted as YYYY-MM-DD
- ZipCode column, must be formatted as ddddd or ddddd-dddd
- Gender column, must be either “M” or “F”

> **Why Next.js + TypeScript?**  
> Next.js was created and is maintained by the same company that built Vercel where I intend to deploy this. While this MVP uses TypeScript, Vercel also supports other runtimes, including Python.

## Assumptions

To keep the MVP focused and lightweight, several enterprise features are **assumed** to exist:

#### The Risk Models here would be seperate services rather than part of a mono repo, however there is no point in doing that for this prototype as they are currently just mock endpoints.

#### **Authorization Layer**

In production, the client identity (`clientId`) would come from an authorization service (e.g., JWT claims or OAuth context), not user input.

#### **API Gateway**

Rate limiting, logging, and access control would be handled by an API Gateway (e.g., Vercel Edge Middleware).  
Vercel already provides automatic rate limiting and request isolation by default.

#### **Persistence Layer**

Currently, results are returned on the fly and not stored.  
Future versions could use Neon Postgres
