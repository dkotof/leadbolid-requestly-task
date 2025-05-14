async function modifyResponse(args) {
    const {
      method,
      url,
      response,
      responseType,
      requestHeaders,
      requestData,
      responseJSON,
    } = args;
  
    try {
      const res = await fetch("http://localhost:3000/api/prices", {
        headers: { accept: "application/json", 'ngrok-skip-browser-warning': '1' },
      });
      const data = await res.json();
      responseJSON.data.body.data.quotes = data.data.body.data.quotes;
      return responseJSON;
    } catch (e) {
      console.error("[Requestly] mock failed → falling back", e);
      return args.response; // show Binance response if mock dies
    }
  }
  