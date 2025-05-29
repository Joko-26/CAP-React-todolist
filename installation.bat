@echo off

start cmd /k "cd F:\Projekte\Code\fullstack\CAP-todolist\cap-todo-list-frontend && npm install"
start cmd /k "cd F:\Projekte\Code\fullstack\CAP-todolist\cap-todo-list-backend && npm install && cds deploy"