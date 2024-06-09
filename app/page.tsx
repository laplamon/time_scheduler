"use client"

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// コンテナ要素のスタイルを定義
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

// 各時間ブロックのスタイルを定義
const HourBlock = styled.div`
  width: 300px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
`;

// タスク入力フィールドのスタイルを定義
const Input = styled.input`
  width: 100%;
  padding: 5px;
  margin-top: 5px;
`;

// 0:00から23:00までの24時間の配列を生成
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const Schedule = () => {
  // tasksは24時間分のタスクを格納する配列で、初期値は空文字列の配列
  const [tasks, setTasks] = useState<string[]>(Array(24).fill(''));

  // コンポーネントがマウントされたときに実行される
  useEffect(() => {
    // ローカルストレージからタスクを取得
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      // 保存されているタスクが存在する場合は、JSONパースしてセット
      setTasks(JSON.parse(savedTasks));
    }
  }, []); // 空の依存配列により、初回マウント時のみ実行

  // tasksが変更されるたびに実行される
  useEffect(() => {
    // 現在のtasks配列をローカルストレージに保存
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]); // tasksが依存配列に含まれているため、tasksが変更されるたびに実行

  // タスクが変更されたときに呼ばれる関数
  const handleTaskChange = (index: number, value: string) => {
    // 新しいtasks配列を作成して、変更されたタスクを更新
    const newTasks = [...tasks];
    newTasks[index] = value;
    // 更新されたtasks配列をステートにセット
    setTasks(newTasks);
  };

  return (
    <Container>
      {/* 各時間ごとにHourBlockを生成 */}
      {hours.map((hour, index) => (
        <HourBlock key={index}>
          <div>{hour}</div>
          {/* タスク入力フィールド */}
          <Input
            type="text"
            value={tasks[index]}
            // タスクが変更されたときにhandleTaskChangeを呼ぶ
            onChange={(e) => handleTaskChange(index, e.target.value)}
          />
        </HourBlock>
      ))}
    </Container>
  );
};

export default Schedule;
