export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");
  const supabaseUrl =
    process.env.SUPABASE_URL || "http://127.0.0.1:54321";

  const response = await fetch(`${supabaseUrl}/storage/v1/${path}`);

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: response.statusText,
    });
  }

  const contentType = response.headers.get("content-type");
  if (contentType) {
    setResponseHeader(event, "content-type", contentType);
  }

  setResponseHeader(event, "cache-control", "public, max-age=31536000");

  return response.body;
});
