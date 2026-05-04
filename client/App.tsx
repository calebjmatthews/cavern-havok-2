import { Routes, Route } from 'react-router';

import Main from "./components/Main/Main";
import Landing from './components/Landing/Landing';
import Battle from './components/Battle/Battle';
import Room from './components/Room/Room';
import Scene from './components/Scene/Scene';
import DebugTreasure from './components/Debug/DebugTreasure';
import DebugCharacter from './components/Debug/DebugCharacter';
import "./index.css";

export default function App() {
  return (
    <Routes>
      <Route path="" element={<Main />}>
        <Route index element={<Landing />} />
        <Route path="battle/:battleId" element={<Battle />} />
        <Route path="room/:roomId" element={<Room />} />
        <Route path="scene/:sceneId" element={<Scene />} />
        <Route path="debug-treasure" element={<DebugTreasure />} />
        <Route path="debug-character" element={<DebugCharacter />} />
      </Route>
    </Routes>
  );
};
