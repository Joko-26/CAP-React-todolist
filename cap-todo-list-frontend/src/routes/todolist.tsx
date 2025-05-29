import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router';
//import { useStableCallback } from 'node_modules/@tanstack/react-router/dist/cjs/utils.d.cts';
import { useState } from 'react';
import { useEffect } from 'react';

export const Route = createFileRoute('/todolist')({
  validateSearch: (search: Record<string, unknown>) => ({
    userId: String(search.userId ?? ''), // or use zod for more strict validation
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const search = useSearch({ from: '/todolist' });
  const user = search.userId;

  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('')
  const [error, setError] = useState<any>(null);
  const [result, setResult] = useState<{  id: number, title: String; done: boolean }[]>([]);
  const [done, setDone] = useState<boolean>(false);

  // triggers update_tasks() when the pages loades first (renders)
useEffect(() => {
  update_tasks();
}, []);

  // gets tasks extracts the useful info and puts it in an array for it to be rendered 
  const update_tasks = async () => {
    const data = { user }
    try {
      const answer = await fetch("http://localhost:4004/browse/getTasks", {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      
      const response = await answer.json();

      const tasks = Array.isArray(response) ? response : response.value;
      
    // extracts useful info from tasks and puts it into mapped tasks and then result if result is array
    if (Array.isArray(tasks)) {
      const mappedTasks = tasks.map((task: any) => ({
        id: task.id ?? task.ID,
        title: task.title,
        done: task.done,
      }));
      setResult(mappedTasks);
    } else {
      setError("Backend-Antwort ist kein Array!");
    }
    // sets erro to any error that occurs
    } catch (error) {
      setError(error)
    }
  }

  // deletes the task associated id and calls update tasks
  const delete_task = async (id: number) => {
    const data = {id}
    try {
      const answer = await fetch(`http://localhost:4004/browse/Tasks(${id})`, {
        method: 'DELETE',
      });
      // when the answer is ok calls update tasks if not sets error accordingly
      if (answer.ok) {
        update_tasks();
      } else {
        setError('Failed to add Task')
      }
    // sets error to any occuring error
    } catch (error) {
      setError(error)
    }
  };

  // adds task with if the title set in the ui is less 50 characters
  const add_task = async () => {
    // checks if there is an title and if it is less than 50 characters
    if (title && title.length < 50) {
      const data = {user, title}
      try{
        const answer = await fetch("http://localhost:4004/browse/createTask", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',},
        body: JSON.stringify(data),
        });
        // when the answer is ok calls update tasks if not sets error accordingly
        if (answer.ok) {
          update_tasks();
          setTitle('')
        } else {
          setError('Failed to add task')
        }
        // sets error to any occuring error
      } catch (error) {
        setError(error)
      }
    }
  } 
  
  // Updates the "done" property of the task with the given id (CAP) to the given boolean value
  const do_Task = async (task: number, done:boolean) => {
    const data = {task, done}
    try{
      const answer = await fetch("http://localhost:4004/browse/doTask", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',},
      body: JSON.stringify(data),
      });
      // when the answer is ok calls update tasks if not sets error accordingly
      if (answer.ok) {
        update_tasks();
      } else {
        setError('Failed to mark task as done')
      }
    // sets error to any occuring error
    } catch (error) {
      setError(error)
    }
  }

  // deletes the user thats logged in then returns to the index page
  const delete_user = async () => {
    try{
      const answer = await fetch(`http://localhost:4004/browse/User(${user})`, {
        method: 'DELETE',
      });
      // when the answer is ok navigates to the index page
      if (answer.ok) {
        navigate({to: '/'})
      }
      // sets error to any occuring error
    } catch (error) {
      setError(error)
    }
  }

  return <div>
    {/*back button navigates to the index page and the account delete button calls delete_user() */}
    <button className='back-button' onClick={() => navigate({ to: '/' })}> ⬅️ Logout </button>
    <button className='delete-user-button' onClick={() => delete_user()}> 🗑️ Delete Account</button>
    {/*the container in the center of the page*/}
    <div className='center-container'>
    {/*the add task element on the page*/}
    <ul className='add-countainer'>
      <li className='task'>
        <input type="text" name="new_task_title" id="new_task_title" placeholder='Enter new task Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
        <button className='add-button' onClick={() => add_task()}>Add task</button>
      </li>
      <li>
        {/*checks if the title for the new task is longer then 49 and the displays the message accordingly*/}
        {title.length > 49 && (
          <span>Task title to long</span>
        )}
      </li>
    </ul>
    {/*the tasks container*/}
    <ul className='task-container'>
      {/*the result array gets mapped for every task*/}
      {result.map((task, idx) => (
        <li key={idx} className='task'>
          {/*the checkbox that calls do_Task*/}
          <input className='custom-checkbox' type="checkbox" name="Done" id="done" checked={task.done} onChange={(e) => do_Task(task.id , e.target.checked)}/>
          <span>{task.title}</span>
          {/*the button that calls delete tasks*/}
          <button className='task-delete-button' onClick={() => delete_task(task.id)}> 🗑️ Delete Task</button>
        </li>
      ))}
      {/*Displayes an message if there are no tasks*/}
      {result.length === 0 && (
        <li>
          <span>No Tasks available</span>
        </li>
      )}
    </ul>
    {error && <div>Fehler: {String(error)}</div>}

    </div>
  </div>
}
