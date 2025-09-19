> [!NOTE]
> This project is no longer maintained. For the meanwhile check out my other projects while i build new version of Hashnode clone (flowlet) with the modern techstack and more efficient and structured codebase.

# Hashnode Clone

This is a **full-stack application** that serves as a clone of the popular blogging website, _Hashnode_. The purpose of this project is to showcase my skills in web development and serve as a learning experience. I have utilized Next.js, Nextjs, Tailwind CSS, and the T3 stack with PostgreSQL as the technology stack for this project. With a plethora of exciting features, this intermediate-level project replicates most of the functionalities found on the original Hashnode website. I hope you enjoy this project as much as I enjoyed building it. Cheers 🍻. Contributions are welcome!

## Table of Contents

- Features
- Installation
- Setting up the development environment
- Contribution

## Features

1. Authentication
2. User blogging dashboard
3. Search Functionality
4. Follow user/tag
5. Notifications
6. Text completion AI
7. Payment Gateway using stripe

## Installation

Clone the repository

```
 git clone https://github.com/ujen5173/hashnode.git
```

Navigate to the project directory:

```
  cd hashnode
```

Install the dependencies:

```
  yarn
```

### Create account in the below services and get the API keys

- [Google Cloud](https://console.cloud.google.com/)
- [Uploadthing for image upload](https://uploadthing.com/)
- [Railway for database](https://railway.app/)
- [Stripe for payment](https://stripe.com/)
- [Google AI for text completion](https://ai.google.dev/)

### Setting up the datase
- Create an account on [Railway](https://railway.app) to setup cloud postgresql database.
- Navigate to the [railway new app](https://railway.app/new) and choose Provision PostgreSQL.
- Access the Variables section within the newly created database.
- Retrieve the DATABASE_URL and transfer it to the .env file under the same name.
- Execute yarn db:dev to upload the schema to the Railway database.
 
### Setting up the development environment

- Set up the required environment variables. Refer to the `.env.example` file for the necessary variables.
- Create `.env` file in the root directory of the project and add the environment variables with reference to the `.env.example` file.
- Create an account in neon.tech for pushing database to the cloud. Use the neon database URL in the `.env` file -> `DATABASE_URL`.
- Push the database schema to your PostgreSQL database: `yarn db:dev`. (OPTIONAL IF YOU HAVE ALREADY PUSH THE DATABASE)
- Start the development server: `yarn dev`
- Open your web browser and visit **http://localhost:3000**

## Contribution

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

- Create issues for bugs and new features you would like to add.
- After an issue has been approved, you can create a pull request.
- Fork this repository.
- Create a new branch for your contribution: `git checkout -b feature/your-feature`
- Make your changes and commit them: `git commit -m "Add your message here"`
- Push the changes to your branch: `git push origin feature/your-feature`
- Open a pull request.

Cheers 🍻.
