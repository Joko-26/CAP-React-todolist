@echo off

start cmd /k "cd cap-todo-list-frontend && npm run start"
start cmd /k "cd cap-todo-list-backend && cds deploy && cds run" 