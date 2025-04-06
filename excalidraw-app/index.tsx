import { createClient } from "@liveblocks/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import "../excalidraw-app/sentry";

import ExcalidrawApp from "./App";

const apiKey = import.meta.env.VITE_LIVEBLOCKS_API_KEY;
const client = createClient({
  publicKey: apiKey, // 从环境变量中读取 API 密钥
});
const room = client.room("excalidraw-room"); // 创建一个名为 "excalidraw-room" 的房间

// 订阅房间的状态，接收来自其他用户的更新
room.subscribe((presence) => {
  // presence 是从 Liveblocks 获取的其他用户的状态数据
  const { appState, elements } = presence;

  // 更新本地 Excalidraw 的状态和元素（绘图）
  excalidrawAPI.updateState(appState);
  excalidrawAPI.updateElements(elements);
});

// 监听绘制内容并更新到 Liveblocks
const updateCollaborativeState = () => {
  const appState = excalidrawAPI.getAppState();
  const elements = excalidrawAPI.getElements();

  // 将更新后的内容发送到 Liveblocks 房间，确保其他用户能够看到这些变化
  room.setPresence({
    appState,
    elements,
  });
};

// 在 Excalidraw 中监控绘图事件，并触发更新
excalidrawAPI.on("stateChange", updateCollaborativeState);

window.__EXCALIDRAW_SHA__ = import.meta.env.VITE_APP_GIT_SHA;
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
registerSW();
root.render(
  <StrictMode>
    <ExcalidrawApp />
  </StrictMode>,
);
