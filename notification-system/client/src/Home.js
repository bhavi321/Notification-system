import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Home.css";
function Home({user}) {
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]); // Added state for notifications
  const [fetchedNotifications, setFetchedNotifications] = useState([]);
  const [expandedNotification, setExpandedNotification] = useState(null);

  // Establish socket connection on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const newSocket = io("http://localhost:3001", {
        auth: { token },
      });
      setSocket(newSocket);
      // Fetch notifications from backend
      newSocket.on("broadcastNotification", (payload) => {
        // Add the new message to the messages state
        console.log("inside socket.on", payload);
        setNotifications((prevMessages) => [
          ...prevMessages,
          { message: payload.message },
        ]);
      });

      // Cleanup on unmount
      return () => newSocket.close();
    }
  }, []);

  const handleClick = async () => {
    console.log(localStorage.getItem("token"));
    socket.emit("clickSend", inputValue);
    if (socket) {
      const response = await fetch("http://localhost:3000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
    }
  };
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/api/notifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    setFetchedNotifications(data);
  };

  const handleExpand = async (id, notificationId) => {
    // setExpandedNotification(expandedNotification === id ? null : id);

    if (expandedNotification === notificationId) {
      setExpandedNotification(null);
    } else {
      setExpandedNotification(notificationId);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/notifications/${notificationId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        console.log("Notification marked as read");
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mt-5">{user}</h2>
      <h2 className="mt-5">Notificationss</h2>
      <ul>
        {notifications.map(
          (
            notification // Render notifications from state
          ) => (
            <li key={notification._id}>{notification.message}</li> // Display each notification  message
          )
        )}
      </ul>
      <h2>Send Notification</h2>
      <div className="form-group">
        <label>Input</label>
        <input
          type="text"
          className="form-control"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mt-3" onClick={handleClick}>
        Send
      </button>
      <br></br>
      <button className="btn btn-secondary mt-3" onClick={fetchNotifications}>
        Get Notifications
      </button>
      <h2>Fetched Notifications</h2>
      <ul className="fetched-notifications-list">
        {fetchedNotifications.map((notification) => (
          <li key={notification._id} className="notification-item">
            <div
              onClick={() =>
                handleExpand(notification.userId._id, notification._id)
              }
            >
              {notification.userId.username}
            </div>
            {expandedNotification === notification._id && (
              <div className="notification-message">{notification.message}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
