useEffect(() => {
    axios.get("http://127.0.0.1:8000/quiz")
      .then((response) => {
        console.log("✅ Quiz Data Fetched:", response.data);
        setQuizData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("🔥 Error fetching quiz data:", error);
        setError("Failed to load quiz data");
        setLoading(false);
      });
  
    axios.get("http://127.0.0.1:8000/quiz-analytics")
      .then((response) => {
        console.log("✅ Graph Data Fetched:", response.data);
        setGraphData(response.data);
      })
      .catch((error) => {
        console.error("🔥 Error fetching graph data:", error);
      });
  }, []);
  