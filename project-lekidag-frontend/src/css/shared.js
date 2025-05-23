export const sharedStyles = `
  :host {
    font-family: "DynaPuff", cursive;
    font-optical-sizing: auto;
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
    font-size: 1.2rem;
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

  .user-buttons {
    display: flex;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 0;
  }

  .user-buttons button,
  .styled-button {
    font-family: "DynaPuff", cursive;
    font-style: normal;
    letter-spacing: 1px;
    padding: 0.8rem 1.2rem;
    border-radius: 12px;
    border: 1px solid #E89E69;
    background-color: #fffef9;
    color: #E89E69;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .user-buttons button:hover,
  .styled-button:hover {
    background-color: #F7D5B4;
    color: white;
    transform: scale(1.05);
  }

  .title {
    font-size: 1.5rem;
    color: #E89E69;
    margin-bottom: 1rem;
    border-bottom: 2px dashed #E89E69;
    padding-bottom: 0.5rem;
    text-align: center;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
  }

  .instruction, .solution {
    font-family: "Indie Flower", cursive;
    white-space: pre-line;
    margin-bottom: 2rem;
    font-size: 1.3rem;
    font-weight: 400;
    background-color: #fffef9;
    padding: 1.5rem 2rem;
    border-radius: 16px;
    border-left: 4px solid #E89E69;
    border-right: 4px solid #E89E69;
    max-width: 700px;
    margin: 0 auto 2rem auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  ol {
    list-style-position: inside;
    margin-left: 0;
    padding-left: 1rem;
  }

  .solution h3 {
    padding-bottom: 0.2rem;
    border-bottom: 2px dashed #E89E69;
    font-family: "DynaPuff", cursive;
    font-size: 1.2rem;
  }

  header, main, footer {
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

  a {
    color:rgb(237, 183, 144);
    text-decoration: none;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }

  main {
    flex-grow: 1;
    padding: 2rem;
    border: 3px solid #E89E69;
    background-color: #fffef9;
    color: #E89E69;
  }

  weather-element {
    display: block;
    min-height: 110px;
  }

  .header-content {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 2rem;
  }

  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .right-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fffef9;
    border: 2px solid #E89E69;
    color: #E89E69;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    z-index: 9999;
    font-size: 1rem;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .popup.display {
    display: block;
    opacity: 1;
  }

  .illustration {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1rem auto;
  }

  @media (max-width: 1024px) {
    .header-content {
      grid-template-columns: 1fr;
      gap: 1rem;
      text-align: center;
    }

    .right-side {
      align-items: center;
      margin-top: 1rem;
    }

    .user-buttons {
      justify-content: center;
    }

    main {
      padding: 1.5rem;
    }

    .buttons {
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.6rem;
    }

    .buttons button {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 768px) {
    .header-content {
      grid-template-columns: 1fr;
    }

    .menu {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .right-side {
      align-items: center;
      margin-top: 1rem;
    }

    .instruction, .solution {
      font-size: 1.2rem;
    }

    .buttons button {
      width: 100%;
      font-size: 1rem;
    }

    main {
      padding: 1rem;
    }

    .logga {
      max-height: 120px;
    }
  }

  @media (max-width: 600px) {
    .logga {
      display: none;
    }
  
    .instruction, .solution {
      font-size: 1.1rem;
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

    .swimmingarea-map {
    height: 40vh;
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

    .swimmingarea-map {
      height: 40vh;
    }
  }
`
