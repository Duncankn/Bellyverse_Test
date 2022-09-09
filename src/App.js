import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/navbar";
import Spaceship from "./components/main";
import Collection from "./components/myCollection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Spaceship />} />
          <Route path="gallery" element={<Collection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
