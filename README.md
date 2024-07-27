# Subspace Assignment

## Setup

- clone the project
- run `docker compose up -d` to start a local instance of hasura console

### Hasura console

- create table users
  - add user_id, first_name, last_name, email, password
  - user_id: primary_key
- create table accounts
- add account_id (pk) , user_id (fk), balance
- setup relationships between the two tables
- On accounts table: one to one relationship for each account belonging to one user -> userDetails
- On users table: Many to one relationship for many accounts belonging to one user -> accounts
- setup actions
  Name: hashPassword

  ```type Mutation {
  hashPassword(password: String!): HashPasswordOutput
  }

  type HashPasswordOutput {
  hashedPassword: String!
  }

  https://ss.backend.mooo.com/hash_passwords
  ```

  Name: verifyPassword

  ```
  type Mutation {
  verifyPassword(
      plainPassword: String!
      hashedPassword: String!
  ): VerifyPasswordOutput
  }

  type VerifyPasswordOutput {
  plainPassword: String!
  }
  ```

### Frontend

- `cd frontend`
- open the sigIn.html file in your browser

### Business logic

- Custom business logic is hosted on an E2C instance at: `https://ss.backend.mooo.com`
