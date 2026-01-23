import React from "react";
import QRScanner from "./QRScanner";
import "./App.css"; // Import the App.css file
import feastLogo from "./images/TFlogo.png"; // Import logo
import feastYouthLogo from "./images/FYlogo.png"; // Import logo

function App() {
  return (
    <div className="app-container">
      <header className="header-container">
      </header>
      <main className="main-content">
        <QRScanner />
      </main>
      <footer className="footer-container">
        <span className="footer-text">Camp Calye 2025: OASIS </span>
        <div className="footer-logos">
          <img src={feastLogo} alt="The Feast Logo" />
          <img src={feastYouthLogo} alt="The Feast Youth Logo" />
        </div>
      </footer>
    </div>
  );
}

export default App;
