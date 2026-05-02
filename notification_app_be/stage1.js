import { Log } from "../logging_middleware/log.js";


const rankTable = {
  Placement: 10,
  Result: 6,
  Event: 2
};


async function loadData() {
  Log("frontend", "info", "api", "Requesting notification dataset");

  const res = await fetch(
    "http://20.207.122.201/evaluation-service/notifications",
    {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuZWxvZmVyX3NAc3JtYXAuZWR1LmluIiwiZXhwIjoxNzc3NzAyNTMxLCJpYXQiOjE3Nzc3MDE2MzEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJmMDdiYjg3ZC1mMzc5LTQxZGItODk3NC02OTkxMzdmMGRjYjMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzaGFpayBuZWxvZmVyIiwic3ViIjoiZjg1MWEwOTUtNmRmMS00ZDRhLWE4NTUtYWU4MjgwZjA2MGU4In0sImVtYWlsIjoibmVsb2Zlcl9zQHNybWFwLmVkdS5pbiIsIm5hbWUiOiJzaGFpayBuZWxvZmVyIiwicm9sbE5vIjoiYXAyMzExMDAxMTQ3MCIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6ImY4NTFhMDk1LTZkZjEtNGQ0YS1hODU1LWFlODI4MGYwNjBlOCIsImNsaWVudFNlY3JldCI6IlFWYll5Y1h0YlJmZlNlekMifQ.YzL6LRNZcoYysedlc8ZBIA6P8ggHY1BYGUVkvbXeC1E"
      }
    }
  );

  const body = await res.json();

  if (!body.notifications || !Array.isArray(body.notifications)) {
    Log("frontend", "error", "api", "Invalid notification response");
    throw new Error("Invalid API response");
  }

  Log("frontend", "info", "api", `Fetched ${body.notifications.length} items`);

  return body.notifications;
}

function transform(item) {
  return {
    ...item,
    weight: rankTable[item.Type] || 0,
    time: new Date(item.Timestamp).getTime()
  };
}


function prioritize(data) {
  Log("frontend", "info", "api", "Applying ranking and time-based ordering");

  const enriched = data.map(transform);

  enriched.sort((a, b) => {
    if (a.weight === b.weight) {
      return b.time - a.time;
    }
    return b.weight - a.weight;
  });

  return enriched;
}


function pickTop(data, limit = 10) {
  Log("frontend", "info", "api", "Selecting highest priority entries");
  return data.slice(0, limit);
}


function display(list) {
  console.log("\n===== PRIORITY NOTIFICATIONS =====\n");

  list.forEach((n, i) => {
    console.log(
      `${i + 1}) ${n.Type.toUpperCase()} → ${n.Message} @ ${n.Timestamp}`
    );
  });
}


async function execute() {
  try {
    Log("frontend", "info", "api", "Stage 1 pipeline started");

    const raw = await loadData();

    const ordered = prioritize(raw);

    const finalList = pickTop(ordered, 10);

    Log("frontend", "info", "api", "Final prioritized list ready");

    display(finalList);

  } catch (err) {
    Log("frontend", "error", "api", "Pipeline execution failed");
    console.error("Execution error:", err.message);
  }
}

execute();