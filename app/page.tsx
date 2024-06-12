"use client";

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// スタイル定義
const Container = styled.div`
  display: flex;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Column = styled.div`
  flex: 1;
  padding: 10px;
  margin: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
`;

const TimeLabel = styled.span`
  width: 60px;
  text-align: right;
  margin-right: 10px;
  font-family: 'Arial', sans-serif;
  color: #333;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  width: 100%;
  max-width: 400px;
  border: none;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  font-family: 'Arial', sans-serif;
  color: #555;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
`;

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  color: #333;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

const SvgContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

// タスクのインターフェースを定義します
interface Task {
  time: string;
  task: string;
}

// Appコンポーネントを定義します
const App: React.FC = () => {
  // 30分ごとの時間スロットを生成します
  const hours: string[] = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minutes}`;
  });

  // 状態を定義します
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todoItems, setTodoItems] = useState<string[]>(['Task 1', 'Task 2', 'Task 3', 'Task 4']);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<string[][]>(Array(48).fill([]).map(() => []));

  // コンポーネントが初めてレンダリングされたときに、ローカルストレージからデータを取得します
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('tasks');
      const savedTodoItems = localStorage.getItem('todoItems');
      const savedTaskAssignments = localStorage.getItem('taskAssignments');

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
      if (savedTodoItems) {
        setTodoItems(JSON.parse(savedTodoItems));
      }
      if (savedTaskAssignments) {
        setTaskAssignments(JSON.parse(savedTaskAssignments));
      }
    }
  }, []);

  // 状態が更新されるたびに、ローカルストレージにデータを保存します
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('todoItems', JSON.stringify(todoItems));
      localStorage.setItem('taskAssignments', JSON.stringify(taskAssignments));
    }
  }, [tasks, todoItems, taskAssignments]);

  // TODOアイテムがクリックされたときのハンドラ
  const handleTodoClick = (task: string) => {
    setSelectedTask(task);
  };

  // 時間スロットがクリックされたときのハンドラ
  const handleTimeSlotClick = (index: number) => {
    if (selectedTask !== null) {
      const newTaskAssignments = [...taskAssignments];
      newTaskAssignments[index] = [...newTaskAssignments[index], selectedTask];
      setTaskAssignments(newTaskAssignments);
      setSelectedTask(null);
    }
  };

  // 時間スロットのタスクを削除するハンドラ
  const handleDeleteTask = (timeIndex: number, taskIndex: number) => {
    const newTaskAssignments = [...taskAssignments];
    newTaskAssignments[timeIndex] = newTaskAssignments[timeIndex].filter((_, i) => i !== taskIndex);
    setTaskAssignments(newTaskAssignments);
  };

  // TODOアイテムのテキストが変更されたときのハンドラ
  const handleTodoChange = (index: number, value: string) => {
    const newTodoItems = [...todoItems];
    newTodoItems[index] = value;
    setTodoItems(newTodoItems);
  };

  // 新しいTODOアイテムを追加するハンドラ
  const handleAddTodo = () => {
    setTodoItems([...todoItems, '']);
  };

  // TODOアイテムを削除するハンドラ
  const handleDeleteTodo = (index: number) => {
    const newTodoItems = [...todoItems];
    newTodoItems.splice(index, 1);
    setTodoItems(newTodoItems);

    // 割り当てられたタスクも削除します
    const newTaskAssignments = taskAssignments.map(slot =>
      slot.filter(task => task !== todoItems[index])
    );
    setTaskAssignments(newTaskAssignments);
  };

  // SVGのrefを定義
  const svgRef = useRef<SVGSVGElement>(null);

  // 線を描画する関数
  const drawLines = () => {
    const svg = svgRef.current;
    if (!svg) return;

    // 古い線を削除
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // 新しい線を描画
    taskAssignments.forEach((tasks, timeIndex) => {
      const timeElement = document.getElementById(`time-${timeIndex}`);
      if (timeElement) {
        const timeRect = timeElement.getBoundingClientRect();
        const timeX = timeRect.left + window.scrollX;
        const timeY = timeRect.top + timeRect.height / 2 + window.scrollY;

        tasks.forEach(task => {
          const taskIndex = todoItems.indexOf(task);
          if (taskIndex !== -1) {
            const taskElement = document.getElementById(`task-${taskIndex}`);
            if (taskElement) {
              const taskRect = taskElement.getBoundingClientRect();
              const taskX = taskRect.right + window.scrollX;
              const taskY = taskRect.top + taskRect.height / 2 + window.scrollY;

              // ビューポート座標をSVG座標に変換
              const svgRect = svg.getBoundingClientRect();
              const adjustedTaskX = taskX - svgRect.left;
              const adjustedTaskY = taskY - svgRect.top;
              const adjustedTimeX = timeX - svgRect.left;
              const adjustedTimeY = timeY - svgRect.top;

              // 線を描画
              const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
              line.setAttribute('x1', adjustedTaskX.toString());
              line.setAttribute('y1', adjustedTaskY.toString());
              line.setAttribute('x2', adjustedTimeX.toString());
              line.setAttribute('y2', adjustedTimeY.toString());
              line.setAttribute('stroke', 'black');
              line.setAttribute('stroke-width', '2');
              svg.appendChild(line);
            }
          }
        });
      }
    });
  };

  // タスクの割り当てが変更されたときに線を描画
  useEffect(() => {
    drawLines();
  }, [taskAssignments, todoItems]);

  return (
    <Container>
      <Column>
        <h2>TODO List</h2>
        {todoItems.map((item, index) => (
          <TodoItem key={index} id={`task-${index}`} onClick={() => handleTodoClick(item)}>
            <Input
              type="text"
              value={item}
              onChange={(e) => handleTodoChange(index, e.target.value)}
            />
            <DeleteButton onClick={() => handleDeleteTodo(index)}>Delete</DeleteButton>
          </TodoItem>
        ))}
        <button onClick={handleAddTodo}>Add Task</button>
      </Column>
      <Column>
        <h2>Schedule</h2>
        {hours.map((hour, index) => (
          <Row key={index} id={`time-${index}`} onClick={() => handleTimeSlotClick(index)}>
            <TimeLabel>{hour}</TimeLabel>
            <div>
              {taskAssignments[index].map((task, taskIndex) => (
                <div key={taskIndex} style={{ display: 'flex', alignItems: 'center' }}>
                  <Input type="text" value={task} readOnly />
                  <DeleteButton onClick={() => handleDeleteTask(index, taskIndex)}>x</DeleteButton>
                </div>
              ))}
            </div>
          </Row>
        ))}
        <SvgContainer ref={svgRef} />
      </Column>
    </Container>
  );
};

export default App;
