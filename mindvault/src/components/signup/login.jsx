import React, { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";
import "./login.css"; // Import CSS
export default function LoginPage() {
  const tiltRef = useRef(null);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 25,
        speed: 400,
        glare: true,
      });
    }
  }, []);

  return (
    <div className="login-page">
        <div className="login-container">
            <div ref={tiltRef} className="box">
                    <div className="elements untoldcoding"></div>
                        <div className="elements name">
                        <h2>Login Page</h2>
                        </div>
                        <div className="elements content">
                            <form>
                                <input type="text" placeholder="email" />
                                <input type="password" placeholder="password" />
                                <button>Login</button>
                            </form>
                        </div>
                <div className="card"></div>
            </div>
        </div>
    </div>
  );
}
