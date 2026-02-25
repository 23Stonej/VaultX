let users = [];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing fields" })
    };
  }

  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "User already exists" })
    };
  }

  users.push({ email, password });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "User created successfully" })
  };
};
