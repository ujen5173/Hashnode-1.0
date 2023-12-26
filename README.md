# Hashnode Clone

This is a **full-stack application** that serves as a clone of the popular blogging website, _Hashnode_. The purpose of this project is to showcase my skills in web development and serve as a learning experience. I have utilized Next.js, Nextjs, Tailwind CSS, and the T3 stack with PostgreSQL as the technology stack for this project. With a plethora of exciting features, this intermediate-level project replicates most of the functionalities found on the original Hashnode website. I hope you enjoy this project as much as I enjoyed building it. Cheers 🍻. Contributions are welcome!

# [[WEB] Hashnode using React-native.](https://github.com/ujen5173/hashnode-rn)

I'm creating Hashnode in React Native from the ground up, using React Native, Tailwind, and MongoDB. If you're curious about the project's progress, check it out! If you enjoy it, give it a star. This is my first time diving into React Native, so it's a bit of a challenge for me.

## Live Urls

- With Drizzle Orm
  - Live: https://hashnode-t3.vercel.app/
  - Code: https://github.com/ujen5173/Hashnode
- With Prisma Orm
  - Live: https://hashnode-4moa9m90e-ujen5173.vercel.app/
  - Code: https://github.com/ujen5173/Hashnode/tree/ede835b251d16bbe96ac62fb9028137d32380e93

## Table of Contents

- Features
- Installation
- Setting up the development environment
- Contribution

## Features

1. Authentication
2. User images
3. Comments with Replies
4. Tags
5. Search Functionality
6. Likes and Bookmarks
7. Follow System
8. Notifications
9. Dashboard
10. Payment Gateway using stripe

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

### Setting up the development environment

- Set up the required environment variables. Refer to the `.env.example` file for the necessary variables.
- Create `.env` file in the root directory of the project and add the environment variables with reference to the `.env.example` file.
- Push the database schema to your PostgreSQL database: `yarn prisma-dev`
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
