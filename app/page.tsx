"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

// コンテナのスタイル定義
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

// 各カラムのスタイル定義
const Column = styled.div`
  flex: 1;
  padding: 10px;
  margin: 10px 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
`;

// TODOリストのカラムスタイル定義
const TodoColumn = styled(Column)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: sticky;
  top: 20px;
  height: calc(100vh - 40px);
  overflow-y: auto;
`;

// タイムスロットのラッパーのスタイル定義
const TimeSlotWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  position: relative;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
`;

// 各行のスタイル定義
const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
`;

// 時間ラベルのスタイル定義
const TimeLabel = styled.span`
  width: 60px;
  font-family: "Arial", sans-serif;
  color: #333;
`;

// 入力フィールドのスタイル定義
const Input = styled.input`
  flex: 1;
  padding: 8px;
  width: 100%;
  max-width: 400px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  font-family: "Arial", sans-serif;
  color: #555;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &[data-completed="true"] {
    text-decoration: line-through;
    color: #999;
  }
`;

// TODOアイテムのスタイル定義
const TodoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
  color: #333;
  cursor: pointer;
`;

// 削除ボタンのスタイル定義
const DeleteButton = styled.button`
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

// 完了状態切替ボタンのスタイル定義
const ToggleCompletionButton = styled.button`
  background-color: #66cdaa;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #27ae60;
  }
`;

// タスク追加ボタンのスタイル定義
const AddTaskButton = styled.button`
  background-color: #87cefa;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #3498db;
  }
`;

// SVGを固定するためのスタイル定義
const SvgContainer = styled.svg`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

// タスクのインターフェースを定義
interface Task {
  text: string;
  completed: boolean;
}

// Appコンポーネントを定義
const App: React.FC = () => {
  // 30分ごとの時間スロットを生成
  const hours: string[] = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  // 状態を定義
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todoItems, setTodoItems] = useState<Task[]>([
    { text: "Task", completed: false },
    { text: "", completed: false },
    { text: "", completed: false },
    { text: "", completed: false },
  ]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<string[][]>(
    Array(48)
      .fill([])
      .map(() => [])
  );

  // コンポーネントが初めてレンダリングされたときにローカルストレージからデータを取得
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("tasks");
      const savedTodoItems = localStorage.getItem("todoItems");
      const savedTaskAssignments = localStorage.getItem("taskAssignments");

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

  // 状態が更新されるたびにローカルストレージにデータを保存
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("todoItems", JSON.stringify(todoItems));
      localStorage.setItem("taskAssignments", JSON.stringify(taskAssignments));
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
      newTaskAssignments[index] = [
        ...newTaskAssignments[index],
        selectedTask,
      ];
      setTaskAssignments(newTaskAssignments);
      setSelectedTask(null);
    }
  };

  // 時間スロットのタスクを削除するハンドラ
  const handleDeleteTask = (timeIndex: number, taskIndex: number) => {
    const newTaskAssignments = [...taskAssignments];
    newTaskAssignments[timeIndex] = newTaskAssignments[timeIndex].filter(
      (_, i) => i !== taskIndex
    );
    setTaskAssignments(newTaskAssignments);
  };

  // TODOアイテムのテキストが変更されたときのハンドラ
  const handleTodoChange = (index: number, value: string) => {
    const newTodoItems = [...todoItems];
    newTodoItems[index].text = value;
    setTodoItems(newTodoItems);
  };

  // 新しいTODOアイテムを追加するハンドラ
  const handleAddTodo = () => {
    setTodoItems([...todoItems, { text: "", completed: false }]);
  };

  // TODOアイテムを削除するハンドラ
  const handleDeleteTodo = (index: number) => {
    const deletedTask = todoItems[index].text;
    const newTodoItems = [...todoItems];
    newTodoItems.splice(index, 1);
    setTodoItems(newTodoItems);

    // 割り当てられたタスクも削除
    const newTaskAssignments = taskAssignments.map((slot) =>
      slot.filter((task) => task !== deletedTask)
    );
    setTaskAssignments(newTaskAssignments);
  };

  // TODOアイテムの完成状態を切り替えるハンドラ
  const handleToggleCompletion = (index: number) => {
    const newTodoItems = [...todoItems];
    newTodoItems[index].completed = !newTodoItems[index].completed;
    setTodoItems(newTodoItems);
  };

  // 線を描画する関数
  const drawLines = () => {
    const svg = svgRef.current;
    if (!svg) return;

    // 古い線を削除
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // スクロール位置を考慮
    const scrollX = window.scrollX;

    // 新しい線を描画
    taskAssignments.forEach((tasks, timeIndex) => {
      tasks.forEach((task, taskAssignmentIndex) => {
        // 各タスクスロットと対応するTODOアイテムのDOM要素を取得
        const timeElement = document.getElementById(
          `task-slot-${timeIndex}-${taskAssignmentIndex}`
        );
        const taskIndex = todoItems.findIndex((todo) => todo.text === task);
        const taskElement = document.getElementById(`task-${taskIndex}`);

        if (timeElement && taskElement) {
          const timeRect = timeElement.getBoundingClientRect();
          const taskRect = taskElement.getBoundingClientRect();

          // スケジューラのタスクの左端の中心を取得
          const timeX = timeRect.left + scrollX;
          const timeY = timeRect.top + timeRect.height / 2;

          // TODOアイテムの右端の中心を取得
          const taskX = taskRect.right + scrollX;
          const taskY = taskRect.top + taskRect.height / 2;

          // SVG要素の相対座標に変換
          const svgRect = svg.getBoundingClientRect();
          const adjustedTaskX = taskX - svgRect.left;
          const adjustedTaskY = taskY - svgRect.top;
          const adjustedTimeX = timeX - svgRect.left;
          const adjustedTimeY = timeY - svgRect.top;

          // SVGのline要素を作成
          const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          line.setAttribute("x1", adjustedTaskX.toString());
          line.setAttribute("y1", adjustedTaskY.toString());
          line.setAttribute("x2", adjustedTimeX.toString());
          line.setAttribute("y2", adjustedTimeY.toString());
          line.setAttribute("stroke", "#b0c4de");
          line.setAttribute("stroke-width", "1");
          svg.appendChild(line);
        }
      });
    });
  };

  // SVGのrefを定義
  const svgRef = useRef<SVGSVGElement>(null);

  // タスクの割り当てが変更されたときやスクロールされたときに線を描画
  useEffect(() => {
    drawLines();
    // スクロールやリサイズイベントで再描画する設定
    const handleScrollAndResize = () => {
      drawLines();
    };

    window.addEventListener("scroll", handleScrollAndResize);
    window.addEventListener("resize", handleScrollAndResize);

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize);
      window.removeEventListener("resize", handleScrollAndResize);
    };
  }, [taskAssignments, todoItems]);

  return (
    <Container>
      <SvgContainer ref={svgRef} />
      <TodoColumn>
        <h2>Today&apos;s ToDo</h2>
        {todoItems.map((item, index) => (
          <TodoItem
            key={index}
            id={`task-${index}`}
            onClick={() => handleTodoClick(item.text)}
          >
            <Input
              type="text"
              value={item.text}
              onChange={(e) => handleTodoChange(index, e.target.value)}
              data-completed={item.completed.toString()}
            />
            <ToggleCompletionButton onClick={() => handleToggleCompletion(index)}>
              {item.completed ? "Undo" : "Complete"}
            </ToggleCompletionButton>
            <DeleteButton onClick={() => handleDeleteTodo(index)}>Delete</DeleteButton>
          </TodoItem>
        ))}
        <AddTaskButton onClick={handleAddTodo}>Add Task</AddTaskButton>
      </TodoColumn>
      <Column>
        <h2>Time Schedule</h2>
        {hours.map((hour, index) => (
          <TimeSlotWrapper key={index}>
            <Row onClick={() => handleTimeSlotClick(index)}>
              <TimeLabel>{hour}</TimeLabel>
            </Row>
            <div>
              {taskAssignments[index].map((task, taskIndex) => (
                <div
                  key={taskIndex}
                  id={`task-slot-${index}-${taskIndex}`}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Input type="text" value={task} readOnly />
                  <DeleteButton onClick={() => handleDeleteTask(index, taskIndex)}>
                    x
                  </DeleteButton>
                </div>
              ))}
            </div>
          </TimeSlotWrapper>
        ))}
      </Column>
    </Container>
  );
};

export default App;
