// import React, { useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { Card } from "react-bootstrap";
// import "./cc.css";

// const CalendarComponent = () => {
//   const [date, setDate] = useState(new Date());

//   return (
//     <Card className="p-3 calendar-container">
//       <h5 className="text-center">Calendar</h5>
//       <Calendar onChange={setDate} value={date} />
//       <p className="text-center mt-2">
//         Selected Date: <strong>{date.toDateString()}</strong>
//       </p>
//     </Card>
//   );
// };

// export default CalendarComponent;

// import React, { useEffect } from "react";
// import { gapi } from "gapi-script";

// const CLIENT_ID = "619361945309-o0gmmbdh9rh0dvebejkiu7b3q6lnpo8j.apps.googleusercontent.com";
// const API_KEY = "AIzaSyCpo6YUsvF5iiTiVg_BDRChzWQRlmukpPk";
// const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

// const GoogleCalendarAuth = () => {
//   useEffect(() => {
//     const initClient = () => {
//       gapi.client
//         .init({
//           apiKey: API_KEY,
//           clientId: CLIENT_ID,
//           discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
//           scope: SCOPES,
//         })
//         .then(() => {
//           console.log("GAPI initialized");
//         })
//         .catch((e) => console.error("Error loading GAPI client", e));
//     };

//     gapi.load("client:auth2", initClient);
//   }, []);

//   const handleLogin = () => {
//     const authInstance = gapi.auth2?.getAuthInstance();
//     if (authInstance) {
//       authInstance.signIn().then((user) => {
//         console.log("Logged in as:", user.getBasicProfile().getName());
//       });
//     } else {
//       console.error("GAPI Auth instance not ready");
//     }
//   };

//   return <button onClick={handleLogin}>Connect to Google Calendar</button>;
// };

// export default GoogleCalendarAuth;

// // src/components/GoogleCalendarAuth.js

// import React, { useEffect, useState } from "react";
// import { gapi } from "gapi-script";

// const CLIENT_ID = "619361945309-o0gmmbdh9rh0dvebejkiu7b3q6lnpo8j.apps.googleusercontent.com";
// const API_KEY = "AIzaSyCpo6YUsvF5iiTiVg_BDRChzWQRlmukpPk";
// const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
// const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

// const GoogleCalendarAuth = () => {
//   const [isSignedIn, setIsSignedIn] = useState(false);
//   const [userName, setUserName] = useState("");

//   useEffect(() => {
//     const loadGapi = () => {
//       const script = document.createElement("script");
//       script.src = "https://apis.google.com/js/api.js";
//       script.async = true;
//       script.defer = true;
  
//       script.onload = () => {
//         gapi.load("client:auth2", () => {
//           gapi.client
//             .init({
//               apiKey: API_KEY,
//               clientId: CLIENT_ID,
//               discoveryDocs: [DISCOVERY_DOC],
//               scope: SCOPES,
//             })
//             .then(() => {
//               const auth = gapi.auth2.getAuthInstance();
//               if (auth.isSignedIn.get()) {
//                 const profile = auth.currentUser.get().getBasicProfile();
//                 setUserName(profile.getName());
//                 setIsSignedIn(true);
//               }
//             })
//             .catch((err) => console.error("GAPI Init error", err));
//         });
//       };
  
//       document.body.appendChild(script);
//     };
  
//     loadGapi();
//   }, []);
  
//   useEffect(() => {
//     const start = () => {
//       gapi.client
//         .init({
//           apiKey: API_KEY,
//           clientId: CLIENT_ID,
//           discoveryDocs: [DISCOVERY_DOC],
//           scope: SCOPES,
//         })
//         .then(() => {
//           const auth = gapi.auth2.getAuthInstance();
//           if (auth.isSignedIn.get()) {
//             const user = auth.currentUser.get().getBasicProfile();
//             setIsSignedIn(true);
//             setUserName(user.getName());
//           }
//         })
//         .catch((err) => {
//           console.error("GAPI Init error", err);
//         });
//     };

//     gapi.load("client:auth2", start);
//   }, []);

//   const handleLogin = () => {
//     const auth = gapi.auth2.getAuthInstance();
//     if (auth) {
//       auth.signIn().then((user) => {
//         const profile = user.getBasicProfile();
//         setUserName(profile.getName());
//         setIsSignedIn(true);
//         console.log("Logged in as:", profile.getName());
//       });
//     } else {
//       console.error("Auth instance not initialized");
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleLogin}>Connect to Google Calendar</button>
//       {isSignedIn && <p>Welcome, {userName}</p>}
//     </div>
//   );
// };

// export default GoogleCalendarAuth;

import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "147555192500-ihtv7odk2vf9mo6ag8vqplkcuei108e1.apps.googleusercontent.com";
const API_KEY = "AIzaSyDjQPQvLDE3--8w7ZcqSCaUKE_el9K2hE4";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const GoogleCalendarAuth = () => {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadGapi = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        gapi.load("client:auth2", () => {
          gapi.client
            .init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: [DISCOVERY_DOC],
              scope: SCOPES,
            })
            .then(() => {
              console.log("GAPI initialized");
            })
            .catch((err) => console.error("GAPI Init error", err));
        });
      };

      document.body.appendChild(script);
    };

    loadGapi();
  }, []);

  const handleLogin = () => {
    const auth = gapi.auth2.getAuthInstance();
    auth
      .signIn()
      .then((user) => {
        console.log("Signed in");
        setUserSignedIn(true);
        fetchEvents();
      })
      .catch((err) => console.error("Sign-in error", err));
  };

  const fetchEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 5,
        orderBy: "startTime",
      })
      .then((response) => {
        setEvents(response.result.items);
        console.log("Events fetched");
      })
      .catch((error) => {
        console.error("Error fetching events", error);
      });
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <button onClick={handleLogin}>Connect to Google Calendar</button>

      {userSignedIn && (
        <>
          <h2>Welcome, Advika 🎉</h2>
          <h4>Upcoming Events:</h4>
          {events.length > 0 ? (
            <ul>
              {events.map((event) => (
                <li key={event.id}>
                  <strong>{event.summary}</strong>
                  <br />
                  {event.start.dateTime || event.start.date}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming events found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default GoogleCalendarAuth;

// import React, { useEffect, useState } from "react";

// const CLIENT_ID = "619361945309-22fcuobqpnt8du17hk2jfcgjr9ibde8q.apps.googleusercontent.com";
// const API_KEY = "AIzaSyBaNltMTtnX-hZZZF8KPdHqfYku17mgtmY";

// const DISCOVERY_DOCS = [
//   "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
// ];
// const SCOPES =
//   "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile";

// function App() {
//   const [isSignedIn, setIsSignedIn] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [events, setEvents] = useState([]);

//   const loadGapi = () => {
//     const script = document.createElement("script");
//     script.src = "https://apis.google.com/js/api.js";
//     script.onload = initClient;
//     document.body.appendChild(script);
//   };

//   const initClient = () => {
//     window.gapi.load("client:auth2", async () => {
//       await window.gapi.client.init({
//         apiKey: API_KEY,
//         clientId: CLIENT_ID,
//         discoveryDocs: DISCOVERY_DOCS,
//         scope: SCOPES,
//       });

//       window.gapi.client.load("oauth2", "v2");

//       const authInstance = window.gapi.auth2.getAuthInstance();
//       authInstance.isSignedIn.listen(updateSigninStatus);
//       updateSigninStatus(authInstance.isSignedIn.get());
//     });
//   };

//   const updateSigninStatus = async (isSignedIn) => {
//     setIsSignedIn(isSignedIn);
//     if (isSignedIn) {
//       try {
//         const userInfo = await window.gapi.client.oauth2.userinfo.get();
//         setUserName(userInfo.result.name);
//         fetchEvents();
//       } catch (err) {
//         console.error("Error getting user info:", err);
//       }
//     } else {
//       setUserName("");
//       setEvents([]);
//     }
//   };

//   const fetchEvents = async () => {
//     try {
//       const response = await window.gapi.client.calendar.events.list({
//         calendarId: "primary",
//         timeMin: new Date().toISOString(),
//         showDeleted: false,
//         singleEvents: true,
//         maxResults: 10,
//         orderBy: "startTime",
//       });

//       setEvents(response.result.items);
//     } catch (error) {
//       console.error("Error fetching events", error);
//     }
//   };

//   const handleAuthClick = () => {
//     window.gapi.auth2.getAuthInstance().signIn();
//   };

//   const handleSignOutClick = () => {
//     window.gapi.auth2.getAuthInstance().signOut();
//   };

//   useEffect(() => {
//     loadGapi();
//   }, []);

//   return (
//     <div style={{ padding: "2rem", fontFamily: "Arial" }}>
//       {!isSignedIn ? (
//         <button onClick={handleAuthClick}>Connect to Google Calendar</button>
//       ) : (
//         <div>
//           <p>Welcome, {userName}</p>
//           <button onClick={handleSignOutClick}>Sign out</button>
//           <h2>Your Events:</h2>
//           <ul>
//             {events.length > 0 ? (
//               events.map((event) => (
//                 <li key={event.id}>
//                   <strong>{event.summary}</strong> —{" "}
//                   {event.start.dateTime || event.start.date}
//                 </li>
//               ))
//             ) : (
//               <p>No upcoming events.</p>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
