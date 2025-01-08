export const handleDelete = async (id: string): Promise<string> => {
  try {
    const response = await fetch(`/api/sheets/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return "success";
    } else {
      const error = await response.json();
      return error.message || "An error occurred";
    }
  } catch (error) {
    return `Error: ${error}`;
  }
};
