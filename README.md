# NextTodo

> **Simple todo app written in React synchronized with database.**

---

## About the project

NextTodo is a lightweight Todo application written in **React** and bundled with **Vite**.
The project is prepared for further integration with a database and team collaboration via Git.

---

## Getting Started

Follow the steps below to run the project locally.

### Requirements

* **Node.js** (recommended: LTS version, 18+)
* **npm** (installed automatically with Node.js)

---

### Check installed versions

Run in your terminal:

```bash
node -v
npm -v
```

If Node.js is not installed, download it from:
[https://nodejs.org](https://nodejs.org)

---

### Installation
```bash
git clone https://github.com/matt400/NextTodo
cd NextTodo
npm run install:all
npm run db:init
```

---

### Run the project

```bash
cd NextTodo
npm run dev:server
npm run dev:client
```

---

### Client URL

By default, the client app will be available at:

```
http://localhost:5173
```

> If the port is already in use, Vite will automatically select another one and display it in the console.

---

### API Docs 

You can access the API documentation once the server is running by visiting the URL below:

```
http://localhost:3000/api_docs
```

---

## Collaboration

* `node_modules` is intentionally ignored (via `.gitignore`)
* After cloning the repository, always run `npm install`
