import { Routes, Route } from 'react-router';

import Main from "./components/Main/Main";
import Landing from './components/Landing/Landing';
import Battle from './components/Battle/Battle';
import "./index.css";

export default function App() {
  return (
    <Routes>
      <Route path="" element={<Main />}>
        <Route index element={<Landing />} />
        <Route path="battle/:battleId" element={<Battle />} />
      </Route>
    </Routes>
  );
};
