import React from "react";
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from "./Components/Header";
import Tasks from "./Components/Tasks";
import AddTask from "./Components/AddTask";
import Footer from "./Components/Footer";
import About from "./Components/About";

//rafce to create a stub of a functional component
function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks (tasksFromServer);
    }
    getTasks();
    
  }, [])
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();

    return data;
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();

    return data;
  }

  //Add Task
  const addTask = async (task) =>
  {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {'content-type': 'application/json'} ,
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])
    //Pre-JSON server approach
    // console.log(task)
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])

  }

  //Delete task
  const deleteTask = async (id) => 
  {
    console.log('http://localhost:5000/tasks/' + id, { method: 'DELETE' })
    await fetch('http://localhost:5000/tasks/' + id, { method: 'DELETE' })
    setTasks(tasks.filter((task) => task.id !== id)) 
  }

  //Toggle reminder
  const toggleReminder = async (id) =>
  {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}
    const res = await fetch(`http://localhost:5000/tasks/${id}`,
    {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json()
    setTasks(tasks.map((task) => 
    task.id === id ? {...task, reminder: data.reminder} : task))
    //Pre JSON server approach
    // setTasks(tasks.map((task) => task.id === id ? {...task, reminder: !task.reminder} : task))
  }

  return (
    //can only return one parent element
    <Router>
      <div className='App container'>
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />

        <Routes>
          {/* <Route path='/about' component={About} /> */}
          <Route path='/' exact element= {
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : 'No Tasks'}
            </>
          }/>
          <Route path='/about' element={ <About/> }/>
        </Routes> 
        <Footer />
      </div>
    </Router>
  );
}



//class based componenet
// class App extends React.Component
// {
//   render()
//   {
//     return <h1>Hello from a class!</h1>
//   }
// }
export default App;
