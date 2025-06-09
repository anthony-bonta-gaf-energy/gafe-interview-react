# Description

Company A has an application which is consumed primarily by other companies. Each company in the system has an account and there are many individual users per account that are allowed to log into the system.

A user in an account has the following information (see packages/user-web/user/user.mts):

```ts
enum UserType {
  Admin = 'admin',
  Basic = 'basic',
}

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  type: UserType;
}
```

### API

The admin user is the user that is allowed to add new users to the system. There exists an api which conforms to the following rest endpoints.

| Endpoint   | Verb  | Usage                                                                                                                |
| ---------- | ----- | -------------------------------------------------------------------------------------------------------------------- |
| /users     | GET   | Gets a list of all users                                                                                             |
| /users/:id | GET   | Gets an individual user. Returns a 404 if the user with the given id does not exist.                                 |
| /users     | POST  | Creates a new user with a payload of the User object defined above. Fields not allowed to be undefined are required. |
| /users/:id | PATCH | Partially updates a new user. You can send a partial in this case.                                                   |

## Getting Started

You will need git, node, and an editor of your choice. It is recommended to use vscode as the settings and recommended extensions are already setup for it.

### Mac OSX

```sh
brew install git
brew install visual-studio-code
# It's recommended to use nvm for node installations (https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating), but you can use this in lieu for the sake of time. Just target the lts version
brew install node@22
```

### Windows

```sh
choco install git
choco install vscode
choco install nodejs-lts
```

Now fork the repository in your own github. You can always delete this afterwards. The goal here is to try and complete the first feature while keeping the second feature in mind.

To run the application, clone, install and start the user-web workspace

```sh
git clone https://github.com/my-account/gafe-interview-react
cd /path/to/gafe-interview-react
npm ci
npm --workspace @anthony-bonta-gaf-energy/user-web start
```

To run the unit tests

```sh
npm test
```

## Frontend Assignment

The assignment is to basically write the UserPage component. The user page is responsible for creating a new user if they do not exist, or
updating an existing user if they exist. You don't have to worry about styling any components.

### Feature: Create a New User

**Background**:\
**When** I navigate to /users/new\
**Or** I click the Create New User button on the users list

_Scenario_: Allow me to fill out the form\
**Then** I should see an empty user form\
**And** I should be able to enter in the information for &lt;Field&gt; of type &lt;Type&gt;\
**Examples**:

| Field        | MapsTo      | Type     |
| ------------ | ----------- | -------- |
| First Name   | firstName   | text     |
| Last Name    | lastName    | text     |
| Phone Number | phoneNumber | tel      |
| Email        | email       | email    |
| Type         | type        | dropdown |

_Scenario_: Disable the save button when a required field is not entered\
**And** I fill out 0 or more fields\
**And** I don't fill out &lt;RequiredField&gt;\
**Then** the save button should be disabled\
**Examples**:

| RequiredField |
| ------------- |
| First Name    |
| Last Name     |
| Email         |
| Type          |

_Scenario_: Save the user when the save button is clicked\
**And** I fill out all required information in the form\
**And** I click the Save button\
**Then** the user is saved\
**And** I am returned to the user list

_Scenario_: Cancel the save\
**And** I click the cancel button\
**Then** no user is saved\
**And** I am returned to the user list.

### Feature: Update an Existing User

**Background**:\
**When** I navigate to /users/:id\
**Or** I click the edit button on any row in the users table on the users list

_Scenario_: Navigate to the form.\
**Then** I &lt;Field&gt; should be populated with the value in &lt;MapsFrom&gt;\
**Examples**:

| Field        | MapsFrom    | Type     |
| ------------ | ----------- | -------- |
| First Name   | firstName   | text     |
| Last Name    | lastName    | text     |
| Phone Number | phoneNumber | tel      |
| Email        | email       | email    |
| Type         | type        | dropdown |

_Scenario_: Disable the save button when the form is clean\
**Then** the save button should be disabled

_Scenario_: Enable the save button\
**And** I change any of the user information\
**And** all required fields are filled out\
**Then** the save button is enabled

_Scenario_: Disable the save button when the form returns to clean\
**And** I change any of the user information\
**And** I revert the changes that I've made\
**Then** the save button is disabled

_Scenario_: Update the user when the save button is clicked\
**And** I make a change to any field\
**And** there are no validation issues on the form\
**And** I click the Save button\
**Then** the user is saved\
**And** I am returned to the user list

_Scenario_: Cancel the save\
**And** I click the cancel button\
**Then** no user is saved\
**And** I am returned to the user list.

## Rules

1. You can use any resources you want. Yes, you may use AI as a resource. If you generate code with AI, be prepared to clean it up and be able to articulate what it is doing.
1. Do not modify the user-list component. That is not part of the assignment and you do not need to implement the changes to it. The only thing you need to modify is the user-page component.
1. Make sure you use the API. Your app does not have to successfully create a user anywhere. The API is provided for you in the API section.
1. You should not be eager loading every user. Assume that we have hundreds of thousands or even millions of users.

## Submission

Once you are happy with your solution, push your changes to your branch and send your repository link to anthony.bonta@gaf.energy, OR create a pull request across forks back to the original repository. The choice here is yours.
