// src/About.tsx
import React from "react";

const About: React.FC = () => {
  return (
    <div>
      <h1>About This Application</h1>
      <p>
        This React application was built by <strong>Anusha Ramadugu</strong> as
        of the RS School React course.
      </p>
      <p>
        Check out the course here:{" "}
        <a
          href="https://rs.school/react/"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School React Course
        </a>
      </p>
    </div>
  );
};

export default About;
