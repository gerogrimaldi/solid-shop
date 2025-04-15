
export async function POST(req:Request) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authorization/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          // Forward any necessary cookies or headers from the request
          Cookie: req.headers.get("cookie") || "",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }
  
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error("Error calling backend logout:", error);
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }