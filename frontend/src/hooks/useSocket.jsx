// import { io } from "socket.io-client";

// const socket = io("url");

// const useSocket = () => {
  // const [messages, setMessages] = useState([]);
  // const [input, setInput] = useState("");
  // const [data, setData] = useState("");
  // useEffect(() => {
  //   socket.on("broadcast", (data) => {
  //     setMessages((prev) => [...prev, data]);
  //   });
  //   const fetchData = async () => {
  //     const response = await fetch("url");
  //     const resData = await response.json();
  //     setData(resData);
  //   };
  //   fetchData();
  //   return () => {
  //     socket.off("broadcast");
  //   };
  // }, []);
  // const sendMessage = () => {
  //   if (input.trim()) {
  //     socket.emit("message", input);
  //     setInput("");
  //   }
  // };
  // return (
  // <div className="p-4">
  //   <h1 className="text-xl font-semibold font-barlow">{data.message}</h1>
  //   <div className="my-4">
  //     {messages.map((msg, index) => (
  //       <div key={index} className="my-2 p-2 border rounded">
  //         {msg}
  //       </div>
  //     ))}
  //   </div>
  //   <div className="font-">
  //     <input
  //       type="text"
  //       value={input}
  //       onChange={(e) => setInput(e.target.value)}
  //       className="border p-2"
  //     />
  //     <button
  //       onClick={sendMessage}
  //       className="ml-2 px-4 py-2 bg-blue-500 text-white"
  //     >
  //       Send
  //     </button>
  //   </div>
  // </div>
  // )
// };
