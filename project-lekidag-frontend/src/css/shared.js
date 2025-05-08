export const sharedStyles = `
@import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@500&display=swap');

  :host {
    font-family: "DynaPuff", cursive;
    font-optical-sizing: auto;
  font-weight: 470;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
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

  .buttons button {
  font-family: "DynaPuff", cursive;
      font-optical-sizing: auto;
  font-weight: 470;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
    font-weight: bold;
  text-transform: uppercase;
  }

  button {
    padding: 0.6rem 1.2rem;
    background-color: #fffef9;
    margin: 0.3rem;
    border: 1px solid #E89E69;
    border-radius: 12px;
    color: #E89E69;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  button:hover {
    background-color: #F7D5B4;
    color: white;
    transform: scale(1.05);
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 5px #fffef9;
  }

  .instruction {
    white-space: pre-line;
    line-height: 1.6;
    margin-bottom: 2rem;
    font-size: 1.3rem;
  }

  header,
  main,
  footer {
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  header {
    background-color: #FFF5E5;
    padding: 1rem 1rem 2rem 1rem;
    position: relative;
    text-align: center;
    min-height: 230px
  }

  footer {
    background-color: #FFF5E5;
    padding: 1rem;
    color: #E89E69;
    text-align: center;
    font-size: 0.9rem;
  }

  main {
    flex-grow: 1;
    padding: 2rem;
    border: 3px solid #E89E69;
    background-color: #fffef9;
    color: #E89E69;
  }

  weather-element {
    width: 100%;
    max-width: 250px;
    margin: 0 auto;
    position: absolute;
  }

  @media (max-width: 600px) {
  .logga {
    display: none;
  }
  
    .instruction {
    font-size: 0.9rem;
  }

  .buttons {
    flex-direction: column;
    align-items: center;
    row-gap: 0.3rem;
    margin-top: 0.8rem;
    margin-bottom: 0.5rem;
  }

  .buttons button {
    width: 90%;
    font-size: 1.05rem;
    padding: 0.8rem 1.2rem;
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
    font-size: 0.95rem;
    padding: 0.6rem 1rem;
  }

  .buttons {
    margin-top: 0.5rem;
    row-gap: 0.2rem;
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
