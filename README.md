User Table:
user_id
user_name
user_pwd

Task Table:
task_id
list_id
task_content
task_status

List Table:
list_id
list_name

frontend:

- create a new list
  /list/new
- move task from one list to another
  /task/move
- sign in user
  /user/signin
- signout user
  /user/signout
- mark task complete and it will be removed from list
  /task/status

Stage 1:
Login & Logout

Stage 2:
Show Lists

Stage 3:
Draggable Tasks
