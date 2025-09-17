# Hiking-logbook

Tracking completed hikes was historically done with a physical logbook. **Hiking Log** serves the same role, but is available on the web. Track your hikes, their location, distance, and thoughts from anywhere.

![Hiking Log Screenshot](frontend/src/assets/hiking.jpg)

## Features
- Add and view hikes
- Record location, distance, and notes
- Accessible anywhere on the web

## Tech Stack
- Frontend: React / Vite 
- Backend: Node.js / Supabase 

## documentation site:
[Notion External Documentation](https://www.notion.so/Hiking-logbook-2528687957a4803eb460fec9b6d35ae2)

### print planning site:
[tagia](https://tree.taiga.io/project/noblewolf-hiking-logbook)
### code coverage:
[![codecov](https://codecov.io/gh/DolfShungube/Hiking-Logbook/branch/master/graph/badge.svg)](https://codecov.io/gh/DolfShungube/Hiking-Logbook)
[coverage graph](https://codecov.io/gh/DolfShungube/Hiking-Logbook/graphs/sunburst.svg?token=3IHG16fCjK)

## Project Setup for running the application locally

### 1. Clone the repository from [GitHub](https://github.com/DolfShungube/Hiking-Logbook.git)

```bash
git clone https://github.com/DolfShungube/Hiking-Logbook.git
```

### 2.If you want to use the deployed API ignore the following 2 steps


### 3. If you want to run the API locally go to the backend folder:
```bash
cd backend
```
  create a .env file ,(you will need the supabase url and anon key used for the project)

  ..install dependencies
```bash
npm install
```
  ... start server
```bash
npm start
```
### 4. go back to the root of the project
```bash
cd ..
```

### 5. go to the frontend folder
```bash
cd frontend
```
.create a .env file ,(you will need the supabase url and anon key used for the project)

..install dependencies
```bash
npm install
```
 start server
```bash
npm run dev
```
