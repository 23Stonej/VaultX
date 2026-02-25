const users = [];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email and password required" }),
    };
  }

  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "User already exists" }),
    };
  }

  users.push({ email, password });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Signup successful" }),
  };
};
