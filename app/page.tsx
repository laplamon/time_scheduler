"use client"; // このファイルがクライアントサイドでのみレンダリングされることを明示します。

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// コンテナのスタイルを定義します。ページの中央に配置し、背景色やボックスシャドウなどを設定しています。
const Container = styled.div`
  display: flex;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

// 列のスタイルを定義します。各列はフレックスボックスの一部として表示されます。
const Column = styled.div`
  flex: 1;
  padding: 10px;
  margin: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

// 行のスタイルを定義します。時間スロットをフレックスボックスで横並びにします。
const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
`;

// 時間ラベルのスタイルを定義します。時間表示を右揃えにし、余白を設定しています。
const TimeLabel = styled.span`
  width: 60px;
  text-align: right;
  margin-right: 10px;
  font-family: 'Arial', sans-serif;
  color: #333;
`;

// 入力フィールドのスタイルを定義します。背景色やボックスシャドウ、フォーカス時のスタイルを設定しています。
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

// TODOアイテムのスタイルを定義します。背景色やボックスシャドウ、ホバー時のスタイルを設定しています。
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

// タスク削除ボタンのスタイルを定義します。
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

// 線のスタイルを定義します。TODOアイテムと時間スロットを線で結ぶために使用します。
const Line = styled.div`
  position: absolute;
  height: 2px;
  background-color: #333;
  z-index: 0;
`;

// タスクのインターフェースを定義します。時間とタスクの文字列を持ちます。
interface Task {
  time: string;
  task: string;
}

// Appコンポーネントを定義します。
const App: React.FC = () => {
  // 30分ごとの時間スロットを生成します。
  const hours: string[] = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minutes}`;
  });

  // タスク、TODOアイテム、選択されたタスク、タスクの割り当てを管理するための状態を定義します。
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todoItems, setTodoItems] = useState<string[]>(['Task 1', 'Task 2', 'Task 3', 'Task 4']);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<string[][]>(Array(48).fill([]).map(() => []));

  // コンポーネントが初めてレンダリングされたときに、ローカルストレージからデータを取得します。
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

  // タスク、TODOアイテム、タスクの割り当てが更新されるたびに、ローカルストレージにデータを保存します。
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('todoItems', JSON.stringify(todoItems));
      localStorage.setItem('taskAssignments', JSON.stringify(taskAssignments));
    }
  }, [tasks, todoItems, taskAssignments]);

  // TODOアイテムがクリックされたときに、選択されたタスクを設定します。
  const handleTodoClick = (task: string) => {
    setSelectedTask(task);
  };

  // 時間スロットがクリックされたときに、選択されたタスクをそのスロットに割り当てます。
  const handleTimeSlotClick = (index: number) => {
    if (selectedTask !== null) {
      const newTaskAssignments = [...taskAssignments];
      newTaskAssignments[index] = [...newTaskAssignments[index], selectedTask];
      setTaskAssignments(newTaskAssignments);
      setSelectedTask(null);
    }
  };

  // TODOアイテムのテキストが変更されたときに、その値を更新します。
  const handleTodoChange = (index: number, value: string) => {
    const newTodoItems = [...todoItems];
    newTodoItems[index] = value;
    setTodoItems(newTodoItems);
  };

  // 新しいTODOアイテムを追加します。
  const handleAddTodo = () => {
    setTodoItems([...todoItems, '']);
  };

  // TODOアイテムを削除します。
  const handleDeleteTodo = (index: number) => {
    const newTodoItems = [...todoItems];
    newTodoItems.splice(index, 1);
    setTodoItems(newTodoItems);

    // 割り当てられたタスクも削除します。
    const newTaskAssignments = taskAssignments.map(slot =>
      slot.filter(task => task !== todoItems[index])
    );
    setTaskAssignments(newTaskAssignments);
  };

  // タスクの位置を計算します。これはTODOアイテムと時間スロットを線で結ぶために使用されます。
  const getTaskPosition = (task: string): number | null => {
    const index = todoItems.indexOf(task);
    return index !== -1 ? index * 50 + 40 : null;
  };

  return (
    <Container>
      <Column>
        <h2>TODO List</h2>
        {todoItems.map((item, index) => (
          <TodoItem key={index}>
            <Input
              type="text"
              value={item}
              onChange={(e) => handleTodoChange(index, e.target.value)}
              onClick={() => handleTodoClick(item)}
            />
            <DeleteButton onClick={() => handleDeleteTodo(index)}>Delete</DeleteButton>
          </TodoItem>
        ))}
        <button onClick={handleAddTodo}>Add Task</button>
      </Column>
      <Column>
        <h2>Schedule</h2>
        {hours.map((hour, index) => (
          <Row key={index} onClick={() => handleTimeSlotClick(index)}>
            <TimeLabel>{hour}</TimeLabel>
            <Input type="text" value={taskAssignments[index].join(', ')} readOnly />
            {taskAssignments[index].map(task => (
              <Line key={task} style={{ top: getTaskPosition(task), left: 60 }} />
            ))}
          </Row>
        ))}
      </Column>
    </Container>
  );
};

export default App;
