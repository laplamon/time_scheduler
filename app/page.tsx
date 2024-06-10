"use client"

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// コンテナ要素のスタイルを定義
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px; /* 全体の最大幅を設定 */
  margin: 0 auto; /* 中央揃え */
  background-color: #f7f7f7; /* 背景色を設定 */
  border-radius: 10px; /* 角丸を設定 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 影を追加 */
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 10px;
`;

const TimeLabel = styled.span`
  width: 60px;
  text-align: right;
  margin-right: 10px;
  font-family: 'Arial', sans-serif; /* フォントを設定 */
  color: #333; /* 文字色を設定 */
`;

const Input = styled.input`
  flex: 1;
  padding: 8px; /* 入力欄の余白を調整 */
  width: 100%;
  max-width: 400px;
  border: none; /* ボーダーを削除 */
  border-radius: 5px; /* 角丸を設定 */
  background-color: #fff; /* 背景色を設定 */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 影を追加 */
  transition: box-shadow 0.3s ease; /* 影の変化をスムーズにする */
  font-family: 'Arial', sans-serif;
  color: #555;
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
  const handleChange = (index: number, value: string) => {
    // 新しいtasks配列を作成して、変更されたタスクを更新
    const newTasks = [...tasks];
    newTasks[index] = value;
    // 更新されたtasks配列をステートにセット
    setTasks(newTasks);
  };

  return (
    <Container>
    {hours.map((hour, index) => (
      <Row key={index}>
        <TimeLabel>{hour}</TimeLabel>
        <Input
          type="text"
          value={tasks[index]}
          onChange={(e) => handleChange(index, e.target.value)}
        />
      </Row>
    ))}
  </Container>
);
};

export default Schedule;
