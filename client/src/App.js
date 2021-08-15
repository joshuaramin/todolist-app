import "./App.scss";
import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const todosQuery = gql`
  query {
    todoQuery {
      todoID
      todolist
      createdAt
    }
  }
`;

const createTodo = gql`
  mutation CreateTodoMutation($createTodoTodolist: String!) {
    createTodo(todolist: $createTodoTodolist) {
      todoID
      todolist
      createdAt
    }
  }
`;

const deleteTodo = gql`
  mutation DeleteTodoMutation($deleteTodoTodoId: ID!) {
    deleteTodo(todoID: $deleteTodoTodoId) {
      todoID
      todolist
      createdAt
    }
  }
`;

const updateTodo = gql`
  mutation UpdateTodoMutation(
    $updateTodoTodoId: ID!
    $updateTodoTodolist: String!
  ) {
    updateTodo(todoID: $updateTodoTodoId, todolist: $updateTodoTodolist) {
      todoID
      todolist
      createdAt
    }
  }
`;
function App({ todoID, todolist }) {
  const [g, setG] = useState({
    todo: "",
  });
  const { loading, error, data } = useQuery(todosQuery);

  const [cTodo] = useMutation(createTodo, {
    variables: {
      createTodoTodolist: g.todo,
    },
    awaitRefetchQueries: true,
    refetchQueries: [{ query: todosQuery }],
  });

  const [Dtodo] = useMutation(deleteTodo, {
    refetchQueries: [{ query: todosQuery }],
    awaitRefetchQueries: true,
  });

  const [utodo] = useMutation(updateTodo, {
    refetchQueries: [{ query: todosQuery }],
    awaitRefetchQueries: true,
  });

  const submitMutationHandler = (e) => {
    e.preventDefault();
    cTodo();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='App'>
      <h2>Todo App using React, Graphql, and MongoDB</h2>
      {loading ? <div>Loading...</div> : null}
      <form onSubmit={submitMutationHandler}>
        <input
          type='text'
          value={g.todo}
          onChange={(e) => setG({ todo: e.target.value })}
          placeholder='Add Todo or Task'
        />
        <button type='submit'>Submit</button>
      </form>
      {loading ? <div>Loading...</div> : null}
      {data.todoQuery.map(({ todoID, todolist }) => (
        <div key={todoID} className='todoDiv'>
          <li>{todolist}</li>
          <div className='workinBtn'>
            <button
              className='deleteBtn'
              onClick={() =>
                Dtodo({ variables: { deleteTodoTodoId: todoID } })
              }>
              Delete
            </button>
            <button
              onClick={(e) =>
                utodo({
                  variables: {
                    updateTodoTodoId: todoID,
                    updateTodoTodolist: g.todo,
                  },
                })
              }
              className='updateBtn'>
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
export default App;
