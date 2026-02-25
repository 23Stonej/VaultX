let users = [];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const { email, password } = JSON.parse(event.body);

  const user = users.find(
    user => user.email === email && user.password === password
  );

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid credentials" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Login successful" })
  };
};
