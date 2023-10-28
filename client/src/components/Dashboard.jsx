import axios from "axios";
import { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DraggableTask = ({ task, handleChangeStatus }) => {
  const [, ref] = useDrag({
    type: "TASK",
    item: { ...task },
  });

  return (
    <div className='taskLine' ref={ref}>
      <input
        type='checkbox'
        name='status'
        id={task.task_id}
        checked={task.status}
        onChange={handleChangeStatus}
      />
      <div>{task.task_content}</div>
    </div>
  );
};

const DropTargetList = ({ children, tasks, setTasks, list }) => {
  const [, ref] = useDrop({
    accept: "TASK",
    drop: (task) => {
      console.log({ task });

      setTasks((tasks) => {
        let newTasks = [...tasks];
        newTasks.forEach((t) => {
          if (t.task_id === task.task_id) {
            t.list_id = list.list_id;
          }
        });

        return newTasks;
      });

      axios({
        method: "post",
        url: "http://localhost:5000/task/move",
        data: {
          task_id: task.task_id,
          list_id: list.list_id,
        },
      })
        .then((e) => {
          console.log(`task list changed for task ${task.task_id}`);
        })
        .catch((e) => {
          alert(e);
        });
    },
  });

  return (
    <div ref={ref} className='List'>
      {children}
    </div>
  );
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    // get lists
    axios({
      method: "get",
      url: "http://localhost:5000/lists",
    })
      .then((e) => {
        setLists([...e.data]);
      })
      .catch((e) => {
        alert(e);
      });
    // get tasks,
    axios({
      method: "get",
      url: "http://localhost:5000/tasks",
    })
      .then((e) => {
        setTasks([...e.data]);
      })
      .catch((e) => {
        alert(e);
      });
  }, []);

  const handleChangeStatus = (e) => {
    let task_id = e.target.id,
      task_status = e.target.checked;
    axios({
      method: "post",
      url: "http://localhost:5000/task/status",
      data: {
        task_id,
        task_status,
      },
    })
      .then((e) => {
        console.log(`task status changed for task ${task_id}`);
        window.location.reload();
      })
      .catch((e) => {
        alert(e);
      });
  };

  const handleAddNewList = () => {
    const newList = {
      list_name: ~~(Math.random() * 1000),
      list_id: ~~(Math.random() * 100000),
    };
    axios({
      method: "post",
      url: "http://localhost:5000/list/new",
      data: {
        list_name: newList.list_name,
        list_id: newList.list_id,
      },
    })
      .then((e) => {
        console.log(`Created new list : ${newList.list_id}`);
      })
      .catch((e) => {
        alert(e);
      });

    setLists([...lists, newList]);
  };

  const handleLogout = () => {
    localStorage.removeItem("task_board_token");
    // navigate("/");
    window.location.reload();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className='topBar'>
          <h3>Welcome Aditya</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className='centerScreen'>
          {lists.map((list) => (
            <DropTargetList tasks={tasks} setTasks={setTasks} list={list}>
              <h4 className='ListHeading'>
                <span>List {list.list_name}</span>
              </h4>
              {tasks.map((task) =>
                task.list_id === list.list_id && task.task_status !== "true" ? (
                  <DraggableTask
                    task={task}
                    handleChangeStatus={handleChangeStatus}
                  />
                ) : (
                  <></>
                )
              )}
            </DropTargetList>
          ))}
          <div className='List' style={{ minHeight: "fit-content" }}>
            <h4 className='ListHeading'>Create New List</h4>
            <button className='addNewList' onClick={handleAddNewList}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                height={32}>
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M12 4.5v15m7.5-7.5h-15'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Dashboard;
