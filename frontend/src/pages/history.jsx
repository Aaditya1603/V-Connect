import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import { IconButton, Box, Container } from "@mui/material";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistoryOfUser();

        if (Array.isArray(response)) {
          setMeetings(response);
        } else if (response && Array.isArray(response.data)) {
          setMeetings(response.data);
        } else {
          setMeetings([]);
        }
      } catch (error) {
        console.error("Failed to load history items", error);
      }
    };

    fetchHistory();
  }, []);

  let formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      {/* Home Navigation button pinned to the left */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
        <IconButton
          onClick={() => {
            routeTo("/home");
          }}
          color="primary"
        >
          <HomeIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Primary Data List Loop */}
      {Array.isArray(meetings) && meetings.length !== 0 ? (
        meetings.map((e, i) => {
          const meetingCode =
            typeof e === "object" && e !== null
              ? e.meeting_code || e.meetingCode
              : e;
          const meetingDate =
            typeof e === "object" && e !== null ? e.date : new Date();

          return (
            // Fixed structural bug: key must go on the outermost wrapper element, not the inner component
            <Card
              key={e._id || e.id || i}
              variant="outlined"
              sx={{ mb: 2, width: "100%", boxShadow: 1 }}
            >
              <CardContent>
                <Typography
                  sx={{ fontSize: 16, fontWeight: "bold" }}
                  color="text.primary"
                  gutterBottom
                >
                  Code: {meetingCode || "Unknown Code"}
                </Typography>

                <Typography sx={{ mb: 0 }} color="text.secondary">
                  Date: {formatDate(meetingDate)}
                </Typography>
              </CardContent>
            </Card>
          );
        })
      ) : (
        // Balanced center typography layout wrapper
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <Typography align="center" color="text.secondary" variant="h6">
            No meeting history found.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
