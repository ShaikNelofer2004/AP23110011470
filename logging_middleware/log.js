export const Log = async (stack, level, pkg, message) => {
  try {
    const allowedPackages = [
      "api",
      "component",
      "hook",
      "page",
      "state",
      "style"
    ];

    const safePackage = allowedPackages.includes(pkg) ? pkg : "api";

    const res = await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuZWxvZmVyX3NAc3JtYXAuZWR1LmluIiwiZXhwIjoxNzc3NzAyNTMxLCJpYXQiOjE3Nzc3MDE2MzEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJmMDdiYjg3ZC1mMzc5LTQxZGItODk3NC02OTkxMzdmMGRjYjMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzaGFpayBuZWxvZmVyIiwic3ViIjoiZjg1MWEwOTUtNmRmMS00ZDRhLWE4NTUtYWU4MjgwZjA2MGU4In0sImVtYWlsIjoibmVsb2Zlcl9zQHNybWFwLmVkdS5pbiIsIm5hbWUiOiJzaGFpayBuZWxvZmVyIiwicm9sbE5vIjoiYXAyMzExMDAxMTQ3MCIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6ImY4NTFhMDk1LTZkZjEtNGQ0YS1hODU1LWFlODI4MGYwNjBlOCIsImNsaWVudFNlY3JldCI6IlFWYll5Y1h0YlJmZlNlekMifQ.YzL6LRNZcoYysedlc8ZBIA6P8ggHY1BYGUVkvbXeC1E`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        stack,
        level,
        package: safePackage,
        message
      })
    });

    const data = await res.json();
    console.log("Log:", data);

  } catch (err) {
    console.error("Logging failed:", err);
  }
};