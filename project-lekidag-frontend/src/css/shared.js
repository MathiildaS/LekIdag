export const sharedStyles = `
  :host {
    font-family: Georgia, serif;
    display: block;
    width: 90%;
    margin: 0 auto;
    padding: 0;
  }

  .layout-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #fffef9;
  }

  button {
    padding: 0.6rem 1.2rem;
    background-color: #ffffff;
    margin: 0.3rem;
    border: none;
    border-radius: 8px;
    color: #f5a623;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
  }

  button:hover {
    background-color: #f5a623;
    color: white;
    transform: scale(1.05);
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 5px #ffffff;
  }

  .instruction {
    white-space: pre-line;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  header,
  main,
  footer {
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  header {
    background-color: #f5a623;
    padding: 1rem 1rem 2rem 1rem;
    color: #ffffff;
    position: relative;
    text-align: center;
  }

  footer {
    background-color: #f5a623;
    padding: 1rem;
    color: #ffffff;
    text-align: center;
    font-size: 0.9rem;
  }

  main {
    flex-grow: 1;
    padding: 2rem;
    border: 3px solid orange;
    background-color: #fffef9;
    color: #f5a623;
  }

  weather-element {
    width: 100%;
    max-width: 250px;
    margin: 0 auto;
    position: absolute;
  }

  @media (max-width: 600px) {
    .buttons {
      flex-direction: column;
      align-items: center;
    }

    .buttons button {
      width: 80%;
      text-align: center;
      font-size: 1rem;
    }

    weather-element {
      position: static;
      margin-top: 1rem;
    }

    main {
      padding: 1rem;
    }

    .playgrounds-map {
      height: 45vh;
    }
  }

  @media (max-width: 400px) {
    .buttons button {
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
    }

    header, footer {
      padding: 0.8rem;
    }

    main {
      padding: 0.8rem;
      font-size: 0.95rem;
    }

    footer {
      font-size: 0.75rem;
    }

    .playgrounds-map {
      height: 40vh;
    }
  }
`
