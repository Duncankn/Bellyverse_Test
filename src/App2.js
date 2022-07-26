import React from "react";
import Navbar from "./components/navbar"
import Main from "./components/main"
import MyCollection from "./components/myCollection";

function App() {
    return (
    <div className="screen--container">
      <Navbar />
      <Main />
      <MyCollection />
    </div>
  );
}

export default App;
