const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid')

const app = express();

app.use(cors());
app.use(express.json());

const users = [];



function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((users) => users.username === username)

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
  // Complete aqui

  /**
   * 
   * id => uuid
   * name => String
   * username => String
   * todo => Array
 */

  const { name, username } = request.body;

  const UserAlreadyExists = users.some((users) => users.username === username)

  if (UserAlreadyExists) {
    return response.status(400).json({ error: "Usuario existente...!" });
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todo: []
  })

  return response.status(201).json(users).send();
});

app.get('/users', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.status(200).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.status(200).json(user.todo);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  /**
   * id => uuid
   * title => String
   * done => Boolean
   * deadLine => Date
   * creat_at => Date
   */
  const { title } = request.body;

  const {user} = request;
  
  const task = {
    id: uuidv4(),
    title,
    done: false,
    deadLine: new Date(),
    creat_at: new Date()
  }

    user.todo.push(task)
    return response.status(201).json(user.todo).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
    const {id} = request.params;
    const {title , deadLine} = request.body;
    const {user} = request;

    const todo = user.todo.find((todo) => todo.id === id)

    if(!todo){
      return response.status(404).json({error: "TODO not found!"})
    }

    todo.title = title;
    todo.deadLine = new Date(deadLine);

    return response.json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params;
  const {user} = request;
  const todo = user.todo.find((todo) => todo.id === id)

  if(!todo){
    return response.status(404).json({error: "TODO not found...!"})
  }

  todo.done = true;

  return response.json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params;
  const {user} = request;

  const todo = user.todo.find((todo) => todo.id === id)

  if(!todo){
    return response.status(404).json({message: "TODO não encontrado...!"})
  }

 
  user.todo.splice(todo,1)

  return response.status(204).json();
});

module.exports = app;